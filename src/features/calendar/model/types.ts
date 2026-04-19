export const diceKinds = [
  'month',
  'weekday',
  'date012678',
  'date012345',
] as const

export type DiceKind = (typeof diceKinds)[number]

export const cubeFaces = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom',
] as const

export type CubeFace = (typeof cubeFaces)[number]

export type Vec3 = [number, number, number]

export type Quaternion = [number, number, number, number]

export type QuarterTurn = 0 | 1 | 2 | 3

export type QuarterTurnVector = {
  x: QuarterTurn
  y: QuarterTurn
  z: QuarterTurn
}

export type RotationAction =
  | 'tiltUp'
  | 'tiltDown'
  | 'tiltLeft'
  | 'tiltRight'
  | 'spinCcw'
  | 'spinCw'

export type DiceFaceLabels = Record<CubeFace, string>

export type DicePlacement = {
  basePosition: Vec3
  baseRotation: Vec3
}

export type DiceOrientation = {
  quarterTurns: QuarterTurnVector
  quaternion: Quaternion
}

export type DiceDefinition = {
  id: DiceKind
  kind: DiceKind
  color: string
  labelColor?: string
  faces: DiceFaceLabels
  placement: DicePlacement
  initialOrientation: DiceOrientation
}

export type PersistedDiceState = {
  id: DiceKind
  kind: DiceKind
  orientation: DiceOrientation
}

export type PersistedCalendarState = {
  diceOrder: DiceKind[]
  diceStates: Record<DiceKind, PersistedDiceState>
}

export type SessionCalendarState = {
  selectedDiceId: DiceKind | null
  previewOrientation: DiceOrientation | null
}
