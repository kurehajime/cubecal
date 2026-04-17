import { diceDefinitions } from './definitions'
import { Euler, Quaternion } from 'three'
import type {
  DiceDefinition,
  DiceKind,
  DiceOrientation,
  DiceRuntimeState,
  QuarterTurnVector,
  RotationAction,
} from './types'

const QUARTER_TURN_ANGLE = Math.PI / 2
const ORIENTATION_MATCH_EPSILON = 1e-6

export function cloneOrientation(orientation: DiceOrientation): DiceOrientation {
  return {
    quarterTurns: { ...orientation.quarterTurns },
    quaternion: [...orientation.quaternion] as DiceOrientation['quaternion'],
  }
}

function toThreeQuaternion(
  quaternion: DiceOrientation['quaternion'],
): Quaternion {
  return new Quaternion(...quaternion)
}

function toQuaternionTuple(
  quaternion: Quaternion,
): DiceOrientation['quaternion'] {
  return [quaternion.x, quaternion.y, quaternion.z, quaternion.w]
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
  return new Quaternion().setFromEuler(
    new Euler(
      quarterTurns.x * QUARTER_TURN_ANGLE,
      quarterTurns.y * QUARTER_TURN_ANGLE,
      quarterTurns.z * QUARTER_TURN_ANGLE,
      'XYZ',
    ),
  )
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
        const score = Math.abs(quaternion.dot(candidateQuaternion))

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
      return new Quaternion().setFromEuler(new Euler(QUARTER_TURN_ANGLE, 0, 0))
    case 'tiltDown':
      return new Quaternion().setFromEuler(new Euler(-QUARTER_TURN_ANGLE, 0, 0))
    case 'tiltLeft':
      return new Quaternion().setFromEuler(new Euler(0, QUARTER_TURN_ANGLE, 0))
    case 'tiltRight':
      return new Quaternion().setFromEuler(new Euler(0, -QUARTER_TURN_ANGLE, 0))
    case 'spinCcw':
      return new Quaternion().setFromEuler(new Euler(0, 0, QUARTER_TURN_ANGLE))
    case 'spinCw':
      return new Quaternion().setFromEuler(new Euler(0, 0, -QUARTER_TURN_ANGLE))
  }
}

export function rotateDiceOrientation(
  orientation: DiceOrientation,
  action: RotationAction,
): DiceOrientation {
  const nextQuaternion = toThreeQuaternion(orientation.quaternion)
    .multiply(getActionQuaternion(action))
    .normalize()
  const nextQuarterTurns = findNearestQuarterTurns(nextQuaternion)

  return {
    quarterTurns: nextQuarterTurns,
    quaternion: toQuaternionTuple(nextQuaternion),
  }
}

export function createInitialDiceState(): Record<DiceKind, DiceRuntimeState> {
  return Object.fromEntries(
    diceDefinitions.map((definition) => [
      definition.id,
      {
        id: definition.id,
        kind: definition.kind,
        status: 'idle',
        confirmedOrientation: cloneOrientation(definition.initialOrientation),
        previewOrientation: cloneOrientation(definition.initialOrientation),
      },
    ]),
  ) as Record<DiceKind, DiceRuntimeState>
}

export function getDiceDefinition(kind: DiceKind): DiceDefinition {
  const definition = diceDefinitions.find((item) => item.kind === kind)

  if (!definition) {
    throw new Error(`Unknown dice kind: ${kind}`)
  }

  return definition
}
