import { useState } from 'react'
import './App.css'
import { SceneCanvas } from './components/scene/SceneCanvas'
import {
  SelectionOverlay,
  type RotationAction,
} from './components/overlay/SelectionOverlay'
import type { DiceKind } from './features/calendar/model/types'

function App() {
  const [selectedDiceId, setSelectedDiceId] = useState<DiceKind | null>(null)
  const [isDateDiceSwapped, setIsDateDiceSwapped] = useState(false)
  const handleRotate: (action: RotationAction) => void = () => {}
  const handleSwap = () => {
    setIsDateDiceSwapped((current) => !current)
    setSelectedDiceId((current) => {
      if (current === 'dateTens') {
        return 'dateOnes'
      }

      if (current === 'dateOnes') {
        return 'dateTens'
      }

      return current
    })
  }

  return (
    <main className="app-shell">
      <section className="scene-panel" aria-label="Dice calendar 3D scene">
        <SceneCanvas
          isDateDiceSwapped={isDateDiceSwapped}
          selectedDiceId={selectedDiceId}
          onSelectDice={setSelectedDiceId}
        />
        <SelectionOverlay
          selectedDiceId={selectedDiceId}
          onConfirm={() => setSelectedDiceId(null)}
          onRotate={handleRotate}
          onSwap={handleSwap}
        />
      </section>
    </main>
  )
}

export default App
