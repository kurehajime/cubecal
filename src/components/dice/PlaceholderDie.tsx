import { RoundedBox } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

type PlaceholderDieProps = {
  color: string
  position: [number, number, number]
}

export function PlaceholderDie({
  color,
  position,
}: PlaceholderDieProps) {
  return (
    <RigidBody position={position} type="fixed">
      <RoundedBox
        args={[1, 1, 1]}
        castShadow
        receiveShadow
        radius={0.08}
        smoothness={6}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.08}
          roughness={0.35}
        />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.501, 0]}>
        <planeGeometry args={[0.78, 0.78]} />
        <meshStandardMaterial
          color="#f6eee2"
          roughness={0.8}
        />
      </mesh>
    </RigidBody>
  )
}
