import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { SceneCanvas } from './components/scene/SceneCanvas'
import { SelectionOverlay } from './components/overlay/SelectionOverlay'
import {
  bootstrapCalendarState,
  saveCalendarState,
  subscribeToCalendarState,
} from './features/calendar/data/realtimeDatabase'
import type {
  DiceKind,
  PersistedCalendarState,
  RotationAction,
} from './features/calendar/model/types'
import {
  cloneOrientation,
  createInitialPersistedCalendarState,
  createInitialSessionCalendarState,
  resolveDisplayedOrientations,
  rotateDiceOrientation,
} from './features/calendar/model/state'
import { isFirebaseConfigured } from './lib/firebase/client'

function App() {
  const [persistedState, setPersistedState] = useState(() =>
    createInitialPersistedCalendarState(),
  )
  const [sessionState, setSessionState] = useState(() =>
    createInitialSessionCalendarState(),
  )

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return
    }

    void bootstrapCalendarState()

    return subscribeToCalendarState(
      (nextState) => {
        setPersistedState(nextState)
      },
      (error) => {
        console.error('Failed to sync calendar state from Realtime Database.', error)
      },
    )
  }, [])

  const commitPersistedState = (
    updater: (current: PersistedCalendarState) => PersistedCalendarState,
  ) => {
    setPersistedState((current) => {
      const nextState = updater(current)

      if (nextState !== current) {
        void saveCalendarState(nextState).catch((error) => {
          console.error('Failed to save calendar state to Realtime Database.', error)
        })
      }

      return nextState
    })
  }

  const handleSelectDice = (nextSelectedDiceId: DiceKind | null) => {
    setSessionState(() => {
      if (!nextSelectedDiceId) {
        return createInitialSessionCalendarState()
      }

      return {
        selectedDiceId: nextSelectedDiceId,
        previewOrientation: cloneOrientation(
          persistedState.diceStates[nextSelectedDiceId].orientation,
        ),
      }
    })
  }

  const handleRotate = (action: RotationAction) => {
    if (!sessionState.selectedDiceId || !sessionState.previewOrientation) {
      return
    }

    setSessionState((current) => {
      if (!current.selectedDiceId || !current.previewOrientation) {
        return current
      }

      const nextPreviewOrientation = rotateDiceOrientation(current.previewOrientation, action)

      return {
        ...current,
        previewOrientation: nextPreviewOrientation,
      }
    })
  }

  const handleConfirm = () => {
    if (!sessionState.selectedDiceId || !sessionState.previewOrientation) {
      return
    }

    const confirmedDiceId = sessionState.selectedDiceId
    const confirmedOrientation = cloneOrientation(sessionState.previewOrientation)

    commitPersistedState((current) => ({
      ...current,
      diceStates: {
        ...current.diceStates,
        [confirmedDiceId]: {
          ...current.diceStates[confirmedDiceId],
          orientation: confirmedOrientation,
        },
      },
    }))

    setSessionState(createInitialSessionCalendarState())
  }

  const selectedDiceId = sessionState.selectedDiceId
  const diceOrder = persistedState.diceOrder
  const selectedDiceIndex = selectedDiceId ? diceOrder.indexOf(selectedDiceId) : -1
  const canMoveLeft = selectedDiceIndex > 0
  const canMoveRight =
    selectedDiceIndex !== -1 && selectedDiceIndex < diceOrder.length - 1

  const moveSelectedDice = (direction: 'left' | 'right') => {
    if (!selectedDiceId) {
      return
    }

    commitPersistedState((current) => {
      const currentIndex = current.diceOrder.indexOf(selectedDiceId)

      if (currentIndex === -1) {
        return current
      }

      const nextIndex =
        direction === 'left' ? currentIndex - 1 : currentIndex + 1

      if (nextIndex < 0 || nextIndex >= current.diceOrder.length) {
        return current
      }

      const nextOrder = [...current.diceOrder]
      ;[nextOrder[currentIndex], nextOrder[nextIndex]] = [
        nextOrder[nextIndex],
        nextOrder[currentIndex],
      ]

      return {
        ...current,
        diceOrder: nextOrder,
      }
    })
  }

  const handleMoveLeft = () => {
    if (!canMoveLeft) {
      return
    }

    moveSelectedDice('left')
  }

  const handleMoveRight = () => {
    if (!canMoveRight) {
      return
    }

    moveSelectedDice('right')
  }

  const displayedOrientations = useMemo(
    () => resolveDisplayedOrientations(persistedState.diceStates, sessionState),
    [persistedState.diceStates, sessionState],
  )

  return (
    <main className="app-shell">
      <section className="scene-panel" aria-label="Cube calendar 3D scene">
        <SceneCanvas
          diceOrientations={displayedOrientations}
          diceOrder={diceOrder}
          onSelectDice={handleSelectDice}
          selectedDiceId={selectedDiceId}
        />
        <SelectionOverlay
          canMoveLeft={canMoveLeft}
          canMoveRight={canMoveRight}
          selectedDiceId={selectedDiceId}
          onConfirm={handleConfirm}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          onRotate={handleRotate}
        />
      </section>
    </main>
  )
}

export default App
