import type { DiceDefinition } from '../../features/calendar/model/types'
import { RoundedBox } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { DiceFaceLabels } from './DiceFaceLabels'
 
type PlaceholderDieProps = {
  definition: DiceDefinition
}

export function PlaceholderDie({
  definition,
}: PlaceholderDieProps) {
  return (
    <RigidBody
      position={definition.placement.basePosition}
      rotation={definition.placement.baseRotation}
      type="fixed"
    >
      <RoundedBox
        args={[1, 1, 1]}
        castShadow
        receiveShadow
        radius={0.08}
        smoothness={6}
      >
        <meshStandardMaterial
          color={definition.color}
          metalness={0.08}
          roughness={0.35}
        />
      </RoundedBox>
      <DiceFaceLabels faces={definition.faces} />
    </RigidBody>
  )
}
