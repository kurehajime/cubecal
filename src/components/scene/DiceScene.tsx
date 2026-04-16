import { Physics } from '@react-three/rapier'
import { ContactShadows } from '@react-three/drei'
import { PlaceholderDie } from '../dice/PlaceholderDie'
import { CalendarBase } from '../stage/CalendarBase'

const diceColors = ['#c96d44', '#4b7f75', '#d3a24d', '#7c5e8f']
const spawnPositions: [number, number, number][] = [
  [-1.85, 0.42, -1.85],
  [-0.62, 0.42, -0.62],
  [0.62, 0.42, 0.62],
  [1.85, 0.42, 1.85],
]

export function DiceScene() {
  return (
    <>
      <group position={[0, -1.35, 0]}>
        <Physics gravity={[0, -9.81, 0]}>
          <CalendarBase />
          {spawnPositions.map((position, index) => (
            <PlaceholderDie
              key={diceColors[index]}
              color={diceColors[index]}
              position={position}
            />
          ))}
        </Physics>
      </group>

      <ContactShadows
        blur={2.4}
        color="#5c4633"
        opacity={0.45}
        position={[0, -1.34, 0]}
        scale={14}
      />
    </>
  )
}
