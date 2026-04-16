import { CuboidCollider, RigidBody } from '@react-three/rapier'

export function CalendarBase() {
  return (
    <>
      <RigidBody colliders={false} type="fixed">
        <mesh
          position={[0, -1.75, 0]}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#d8c8b5" roughness={0.95} />
        </mesh>
        <CuboidCollider args={[15, 0.1, 15]} position={[0, -1.85, 0]} />
      </RigidBody>

      <RigidBody
        colliders={false}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 4, 0]}
        type="fixed"
      >
        <mesh castShadow position={[0, -0.38, 0]} receiveShadow>
          <boxGeometry args={[6.4, 0.55, 3.5]} />
          <meshStandardMaterial color="#8d6341" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, -0.92, 0]} receiveShadow>
          <boxGeometry args={[4.4, 0.5, 1.7]} />
          <meshStandardMaterial color="#6d4b33" roughness={0.78} />
        </mesh>
        <CuboidCollider args={[3.2, 0.275, 1.75]} position={[0, -0.38, 0]} />
      </RigidBody>
    </>
  )
}
