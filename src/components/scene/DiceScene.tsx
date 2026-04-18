import type {
  DiceKind,
  DiceOrientation,
} from '../../features/calendar/model/types'
import { Physics } from '@react-three/rapier'
import { ContactShadows } from '@react-three/drei'
import { PlaceholderDie } from '../dice/PlaceholderDie'
import { CalendarBase } from '../stage/CalendarBase'
import { diceDefinitions } from '../../features/calendar/model/definitions'

type DiceSceneProps = {
  diceOrientations: Record<DiceKind, DiceOrientation>
  diceOrder: DiceKind[]
  selectedDiceId: DiceKind | null
  onSelectDice: (diceId: DiceKind) => void
}

export function DiceScene({
  diceOrientations,
  diceOrder,
  selectedDiceId,
  onSelectDice,
}: DiceSceneProps) {
  return (
    <>
      <group position={[0, -0.92, 0]}>
        <Physics gravity={[0, -9.81, 0]}>
          <CalendarBase />
          {diceDefinitions.map((definition) => (
            <PlaceholderDie
              basePositionValue={getOrderedBasePosition(definition.id, diceOrder)}
              key={definition.id}
              definition={definition}
              isSelected={selectedDiceId === definition.id}
              orientationValue={diceOrientations[definition.id].quaternion}
              onSelect={onSelectDice}
            />
          ))}
        </Physics>
      </group>

      <ContactShadows
        blur={2.8}
        color="#5a4638"
        opacity={0.12}
        position={[0, -1.445, 0]}
        scale={10}
      />
    </>
  )
}

function getOrderedBasePosition(diceId: DiceKind, diceOrder: DiceKind[]) {
  const slotIndex = diceOrder.indexOf(diceId)

  if (slotIndex === -1) {
    throw new Error(`Unknown dice id in order: ${diceId}`)
  }

  const slotDefinition = diceDefinitions[slotIndex]

  if (!slotDefinition) {
    throw new Error(`Missing slot definition for index: ${slotIndex}`)
  }

  return slotDefinition.placement.basePosition
}
