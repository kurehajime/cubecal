export const diceKinds = ['month', 'weekday', 'dateTens', 'dateOnes'] as const

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

export type DiceStatus = 'idle' | 'selected' | 'rotating' | 'confirmed'

export type DiceRuntimeState = {
  id: DiceKind
  kind: DiceKind
  status: DiceStatus
  confirmedOrientation: DiceOrientation
  previewOrientation: DiceOrientation
}
