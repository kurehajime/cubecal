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
  date012678: createFaceLabels(['0', '1', '2', '6', '7', '8']),
  date012345: createFaceLabels(['0', '1', '2', '3', '4', '5']),
}

export const diceDefinitions: DiceDefinition[] = [
  {
    id: 'month',
    kind: 'month',
    color: '#1b1d1e',
    labelColor: '#ffffff',
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
    color: '#00AEEF',
    faces: diceFaceLabelsByKind.weekday,
    placement: {
      basePosition: [-0.54, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
  {
    id: 'date012678',
    kind: 'date012678',
    color: '#EC008C',
    faces: diceFaceLabelsByKind.date012678,
    placement: {
      basePosition: [0.54, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
  {
    id: 'date012345',
    kind: 'date012345',
    color: '#FFF500',
    faces: diceFaceLabelsByKind.date012345,
    placement: {
      basePosition: [1.62, 0.54, 0.02],
      baseRotation: [-0.32, 0, 0],
    },
    initialOrientation: identityOrientation,
  },
]
