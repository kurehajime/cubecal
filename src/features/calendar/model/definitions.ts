import type {
  CubeFace,
  DiceDefinition,
  DiceFaceLabels,
  DiceKind,
  DiceOrientation,
} from './types'

const faceAssignmentOrder: CubeFace[] = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom',
]

function createFaceLabels(labels: string[]): DiceFaceLabels {
  return faceAssignmentOrder.reduce<DiceFaceLabels>(
    (faces, face, index) => ({
      ...faces,
      [face]: labels[index],
    }),
    {
      front: '',
      right: '',
      back: '',
      left: '',
      top: '',
      bottom: '',
    },
  )
}

const identityOrientation: DiceOrientation = {
  quarterTurns: { x: 0, y: 0, z: 0 },
  quaternion: [0, 0, 0, 1],
}

export const diceFaceLabelsByKind: Record<DiceKind, DiceFaceLabels> = {
  month: createFaceLabels([
    'JUN/DEC',
    'FEB/AUG',
    'MAR/SEP',
    'APR/OCT',
    'MAY/NOV',
    'JAN/JUL',
  ]),
  weekday: createFaceLabels(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT/SUN']),
  dateTens: createFaceLabels(['0', '1', '2', '6', '7', '8']),
  dateOnes: createFaceLabels(['0', '1', '2', '3', '4', '5']),
}

export const diceDefinitions: DiceDefinition[] = [
  {
    id: 'month',
    kind: 'month',
    color: '#69b012',
    faces: diceFaceLabelsByKind.month,
    placement: {
      basePosition: [-1.62, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
  {
    id: 'weekday',
    kind: 'weekday',
    color: '#1390d0',
    faces: diceFaceLabelsByKind.weekday,
    placement: {
      basePosition: [-0.54, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
  {
    id: 'dateTens',
    kind: 'dateTens',
    color: '#e68302',
    faces: diceFaceLabelsByKind.dateTens,
    placement: {
      basePosition: [0.54, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
  {
    id: 'dateOnes',
    kind: 'dateOnes',
    color: '#f8bb13',
    faces: diceFaceLabelsByKind.dateOnes,
    placement: {
      basePosition: [1.62, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
]
