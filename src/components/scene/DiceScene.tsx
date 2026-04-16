import type { DiceKind } from '../../features/calendar/model/types'
import { Physics } from '@react-three/rapier'
import { ContactShadows } from '@react-three/drei'
import { PlaceholderDie } from '../dice/PlaceholderDie'
import { CalendarBase } from '../stage/CalendarBase'
import { diceDefinitions } from '../../features/calendar/model/definitions'

type DiceSceneProps = {
  isDateDiceSwapped: boolean
  selectedDiceId: DiceKind | null
  onSelectDice: (diceId: DiceKind) => void
}

export function DiceScene({
  isDateDiceSwapped,
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
              basePositionValue={
                isDateDiceSwapped
                  ? getSwappedBasePosition(definition.id)
                  : definition.placement.basePosition
              }
              key={definition.id}
              definition={definition}
              isSelected={selectedDiceId === definition.id}
              onSelect={onSelectDice}
            />
          ))}
        </Physics>
      </group>

      <ContactShadows
        blur={2.2}
        color="#3d3025"
        opacity={0.25}
        position={[0, -0.92, 0]}
        scale={12}
      />
    </>
  )
}

function getSwappedBasePosition(diceId: DiceKind) {
  const dateTens = diceDefinitions.find((definition) => definition.id === 'dateTens')
  const dateOnes = diceDefinitions.find((definition) => definition.id === 'dateOnes')

  if (!dateTens || !dateOnes) {
    throw new Error('Date dice definitions are missing')
  }

  if (diceId === 'dateTens') {
    return dateOnes.placement.basePosition
  }

  if (diceId === 'dateOnes') {
    return dateTens.placement.basePosition
  }

  const definition = diceDefinitions.find((item) => item.id === diceId)

  if (!definition) {
    throw new Error(`Unknown dice id: ${diceId}`)
  }

  return definition.placement.basePosition
}
