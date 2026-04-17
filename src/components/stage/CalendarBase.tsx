import { diceDefinitions } from '../../features/calendar/model/definitions'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Text } from '@react-three/drei'

export function CalendarBase() {
  return (
    <>
      <RigidBody colliders={false} type="fixed">
        <mesh
          position={[0, -0.54, 0]}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#d8c8b5" roughness={0.95} />
        </mesh>
        <CuboidCollider args={[15, 0.1, 15]} position={[0, -0.64, 0]} />
      </RigidBody>

      <RigidBody colliders={false} position={[0, 0, 0]} type="fixed">
        <mesh castShadow position={[0, -0.27, -0.02]} receiveShadow>
          <boxGeometry args={[4.72, 0.54, 1.56]} />
          <meshStandardMaterial color="#232325" roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.33, 0.77]} receiveShadow>
          <planeGeometry args={[4.68, 0.18]} />
          <meshStandardMaterial color="#2a2a2d" roughness={0.7} />
        </mesh>

        <mesh castShadow position={[0, -0.01, -0.41]} receiveShadow>
          <boxGeometry args={[4.18, 0.18, 0.14]} />
          <meshStandardMaterial color="#2b2c30" roughness={0.58} />
        </mesh>
        <mesh castShadow position={[0, -0.15, 0.38]} receiveShadow>
          <boxGeometry args={[4.18, 0.04, 0.1]} />
          <meshStandardMaterial color="#2d2e33" roughness={0.62} />
        </mesh>
        <mesh castShadow position={[-2.05, -0.07, -0.02]} receiveShadow>
          <boxGeometry args={[0.08, 0.1, 0.92]} />
          <meshStandardMaterial color="#2a2b2f" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[2.05, -0.07, -0.02]} receiveShadow>
          <boxGeometry args={[0.08, 0.1, 0.92]} />
          <meshStandardMaterial color="#2a2b2f" roughness={0.6} />
        </mesh>

        <mesh
          castShadow
          position={[0, -0.07, -0.04]}
          receiveShadow
          rotation={[-0.32, 0, 0]}
        >
          <boxGeometry args={[4.08, 0.04, 0.84]} />
          <meshStandardMaterial color="#16171a" roughness={0.92} />
        </mesh>

        <group position={[0, -0.2, 0.79]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.46, 0.42, 0.04]} />
            <meshStandardMaterial color="#f7f5ef" roughness={0.78} />
          </mesh>
          <Text
            color="#111111"
            fontSize={0.145}
            fontWeight={900}
            letterSpacing={0.01}
            maxWidth={3.1}
            position={[0, 0, 0.024]}
            textAlign="center"
          >
            Help keep this calendar up to date.
          </Text>
        </group>

        {diceDefinitions.map((definition) => (
          <mesh
            key={definition.id}
            position={[definition.placement.basePosition[0], -0.12, 0.34]}
            receiveShadow
          >
            <boxGeometry args={[0.94, 0.03, 0.05]} />
            <meshStandardMaterial color="#1a1b1d" roughness={0.96} />
          </mesh>
        ))}

        <CuboidCollider args={[2.36, 0.27, 0.78]} position={[0, -0.27, -0.02]} />
      </RigidBody>
    </>
  )
}
