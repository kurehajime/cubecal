import { useState } from 'react'
import './App.css'
import { SceneCanvas } from './components/scene/SceneCanvas'
import { SelectionOverlay } from './components/overlay/SelectionOverlay'
import type { DiceKind, RotationAction } from './features/calendar/model/types'
import {
  cloneOrientation,
  createInitialDiceState,
  rotateDiceOrientation,
} from './features/calendar/model/state'

function App() {
  const [diceStates, setDiceStates] = useState(() => createInitialDiceState())
  const [selectedDiceId, setSelectedDiceId] = useState<DiceKind | null>(null)
  const [isDateDiceSwapped, setIsDateDiceSwapped] = useState(false)

  const handleSelectDice = (nextSelectedDiceId: DiceKind | null) => {
    setDiceStates((current) => {
      const nextState = { ...current }

      if (selectedDiceId) {
        const selectedState = current[selectedDiceId]

        nextState[selectedDiceId] = {
          ...selectedState,
          previewOrientation: cloneOrientation(selectedState.confirmedOrientation),
          status: 'idle',
        }
      }

      if (nextSelectedDiceId) {
        const nextSelectedState = nextState[nextSelectedDiceId]

        nextState[nextSelectedDiceId] = {
          ...nextSelectedState,
          previewOrientation: cloneOrientation(nextSelectedState.confirmedOrientation),
          status: 'selected',
        }
      }

      return nextState
    })

    setSelectedDiceId(nextSelectedDiceId)
  }

  const handleRotate = (action: RotationAction) => {
    if (!selectedDiceId) {
      return
    }

    setDiceStates((current) => {
      const selectedState = current[selectedDiceId]
      const nextPreviewOrientation = rotateDiceOrientation(
        selectedState.previewOrientation,
        action,
      )

      return {
        ...current,
        [selectedDiceId]: {
          ...selectedState,
          previewOrientation: nextPreviewOrientation,
          status: 'selected',
        },
      }
    })
  }

  const handleConfirm = () => {
    if (!selectedDiceId) {
      return
    }

    setDiceStates((current) => {
      const selectedState = current[selectedDiceId]

      return {
        ...current,
        [selectedDiceId]: {
          ...selectedState,
          confirmedOrientation: cloneOrientation(selectedState.previewOrientation),
          status: 'confirmed',
        },
      }
    })

    setSelectedDiceId(null)
  }

  const handleSwap = () => {
    setIsDateDiceSwapped((current) => !current)

    if (selectedDiceId === 'dateTens') {
      handleSelectDice('dateOnes')
      return
    }

    if (selectedDiceId === 'dateOnes') {
      handleSelectDice('dateTens')
    }
  }

  return (
    <main className="app-shell">
      <section className="scene-panel" aria-label="Dice calendar 3D scene">
        <SceneCanvas
          diceStates={diceStates}
          isDateDiceSwapped={isDateDiceSwapped}
          selectedDiceId={selectedDiceId}
          onSelectDice={handleSelectDice}
        />
        <SelectionOverlay
          selectedDiceId={selectedDiceId}
          onConfirm={handleConfirm}
          onRotate={handleRotate}
          onSwap={handleSwap}
        />
      </section>
    </main>
  )
}

export default App
