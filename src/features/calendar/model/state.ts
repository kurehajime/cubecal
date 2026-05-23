import { diceDefinitions } from './definitions'
import type {
  DiceDefinition,
  DiceKind,
  DiceOrientation,
  Quaternion,
  PersistedCalendarState,
  PersistedDiceState,
  QuarterTurnVector,
  RotationAction,
  SessionCalendarState,
} from './types'

const QUARTER_TURN_ANGLE = Math.PI / 2
const ORIENTATION_MATCH_EPSILON = 1e-6

export function cloneOrientation(orientation: DiceOrientation): DiceOrientation {
  return {
    quarterTurns: { ...orientation.quarterTurns },
    quaternion: [...orientation.quaternion] as DiceOrientation['quaternion'],
  }
}

function toQuarterTurnVector(
  x: number,
  y: number,
  z: number,
): QuarterTurnVector {
  return {
    x: x as QuarterTurnVector['x'],
    y: y as QuarterTurnVector['y'],
    z: z as QuarterTurnVector['z'],
  }
}

function quaternionFromQuarterTurns(
  quarterTurns: QuarterTurnVector,
): Quaternion {
  return quaternionFromEuler(
    quarterTurns.x * QUARTER_TURN_ANGLE,
    quarterTurns.y * QUARTER_TURN_ANGLE,
    quarterTurns.z * QUARTER_TURN_ANGLE,
  )
}

export function createOrientationFromQuarterTurns(
  quarterTurns: QuarterTurnVector,
): DiceOrientation {
  const quaternion = quaternionFromQuarterTurns(quarterTurns)

  return {
    quarterTurns: { ...quarterTurns },
    quaternion,
  }
}

function findNearestQuarterTurns(
  quaternion: Quaternion,
): QuarterTurnVector {
  let bestMatch = toQuarterTurnVector(0, 0, 0)
  let bestScore = -Infinity

  for (let x = 0; x < 4; x += 1) {
    for (let y = 0; y < 4; y += 1) {
      for (let z = 0; z < 4; z += 1) {
        const candidate = toQuarterTurnVector(x, y, z)
        const candidateQuaternion = quaternionFromQuarterTurns(candidate)
        const score = Math.abs(dotQuaternions(quaternion, candidateQuaternion))

        if (score > bestScore + ORIENTATION_MATCH_EPSILON) {
          bestMatch = candidate
          bestScore = score
        }
      }
    }
  }

  return bestMatch
}

function getActionQuaternion(action: RotationAction): Quaternion {
  switch (action) {
    case 'tiltUp':
      return quaternionFromEuler(QUARTER_TURN_ANGLE, 0, 0)
    case 'tiltDown':
      return quaternionFromEuler(-QUARTER_TURN_ANGLE, 0, 0)
    case 'tiltLeft':
      return quaternionFromEuler(0, QUARTER_TURN_ANGLE, 0)
    case 'tiltRight':
      return quaternionFromEuler(0, -QUARTER_TURN_ANGLE, 0)
    case 'spinCcw':
      return quaternionFromEuler(0, 0, QUARTER_TURN_ANGLE)
    case 'spinCw':
      return quaternionFromEuler(0, 0, -QUARTER_TURN_ANGLE)
  }
}

export function rotateDiceOrientation(
  orientation: DiceOrientation,
  action: RotationAction,
): DiceOrientation {
  const nextQuaternion = normalizeQuaternion(
    multiplyQuaternions(getActionQuaternion(action), orientation.quaternion),
  )
  const nextQuarterTurns = findNearestQuarterTurns(nextQuaternion)

  return {
    quarterTurns: nextQuarterTurns,
    quaternion: nextQuaternion,
  }
}

function quaternionFromEuler(x: number, y: number, z: number): Quaternion {
  const c1 = Math.cos(x / 2)
  const c2 = Math.cos(y / 2)
  const c3 = Math.cos(z / 2)
  const s1 = Math.sin(x / 2)
  const s2 = Math.sin(y / 2)
  const s3 = Math.sin(z / 2)

  return [
    s1 * c2 * c3 + c1 * s2 * s3,
    c1 * s2 * c3 - s1 * c2 * s3,
    c1 * c2 * s3 + s1 * s2 * c3,
    c1 * c2 * c3 - s1 * s2 * s3,
  ]
}

function multiplyQuaternions(left: Quaternion, right: Quaternion): Quaternion {
  const [leftX, leftY, leftZ, leftW] = left
  const [rightX, rightY, rightZ, rightW] = right

  return [
    leftX * rightW + leftW * rightX + leftY * rightZ - leftZ * rightY,
    leftY * rightW + leftW * rightY + leftZ * rightX - leftX * rightZ,
    leftZ * rightW + leftW * rightZ + leftX * rightY - leftY * rightX,
    leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ,
  ]
}

function normalizeQuaternion(quaternion: Quaternion): Quaternion {
  const [x, y, z, w] = quaternion
  const length = Math.hypot(x, y, z, w)

  if (length === 0) {
    return [0, 0, 0, 1]
  }

  return [x / length, y / length, z / length, w / length]
}

function dotQuaternions(left: Quaternion, right: Quaternion) {
  return (
    left[0] * right[0] +
    left[1] * right[1] +
    left[2] * right[2] +
    left[3] * right[3]
  )
}

export function createInitialPersistedCalendarState(): PersistedCalendarState {
  return {
    diceOrder: [...diceDefinitions.map((definition) => definition.id)],
    diceStates: Object.fromEntries(
      diceDefinitions.map((definition) => [
        definition.id,
        {
          id: definition.id,
          kind: definition.kind,
          orientation: cloneOrientation(definition.initialOrientation),
        } satisfies PersistedDiceState,
      ]),
    ) as Record<DiceKind, PersistedDiceState>,
  }
}

export function createInitialSessionCalendarState(): SessionCalendarState {
  return {
    selectedDiceId: null,
    previewOrientation: null,
  }
}

export function resolveDisplayedOrientations(
  diceStates: PersistedCalendarState['diceStates'],
  sessionState: SessionCalendarState,
): Record<DiceKind, DiceOrientation> {
  return Object.fromEntries(
    Object.entries(diceStates).map(([diceId, diceState]) => [
      diceId,
      sessionState.selectedDiceId === diceId && sessionState.previewOrientation
        ? sessionState.previewOrientation
        : diceState.orientation,
    ]),
  ) as Record<DiceKind, DiceOrientation>
}

export function getDiceDefinition(kind: DiceKind): DiceDefinition {
  const definition = diceDefinitions.find((item) => item.kind === kind)

  if (!definition) {
    throw new Error(`Unknown dice kind: ${kind}`)
  }

  return definition
}
