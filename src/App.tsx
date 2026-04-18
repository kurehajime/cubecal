import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SceneCanvas } from './components/scene/SceneCanvas'
import { SelectionOverlay } from './components/overlay/SelectionOverlay'
import type { DiceKind, RotationAction } from './features/calendar/model/types'
import {
  cloneOrientation,
  createInitialPersistedCalendarState,
  createInitialSessionCalendarState,
  resolveDisplayedOrientations,
  rotateDiceOrientation,
} from './features/calendar/model/state'

function App() {
  const [persistedState, setPersistedState] = useState(() =>
    createInitialPersistedCalendarState(),
  )
  const [sessionState, setSessionState] = useState(() =>
    createInitialSessionCalendarState(),
  )
  const putAudioRef = useRef<HTMLAudioElement | null>(null)
  const spinAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const putAudio = new Audio('/put.mp3')
    putAudio.preload = 'auto'
    putAudio.volume = 0.03
    putAudioRef.current = putAudio

    const spinAudio = new Audio('/spin.mp3')
    spinAudio.preload = 'auto'
    spinAudio.volume = 0.1
    spinAudioRef.current = spinAudio

    return () => {
      putAudio.pause()
      spinAudio.pause()
      putAudioRef.current = null
      spinAudioRef.current = null
    }
  }, [])

  const playPutSound = () => {
    const audio = putAudioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = 0
    void audio.play().catch(() => { })
  }

  const playSpinSound = () => {
    const audio = spinAudioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = 0
    void audio.play().catch(() => { })
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

    playSpinSound()

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

    setPersistedState((current) => ({
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

    setPersistedState((current) => {
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
      playPutSound()

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
      <section className="scene-panel" aria-label="Dice calendar 3D scene">
        <SceneCanvas
          diceOrientations={displayedOrientations}
          diceOrder={diceOrder}
          selectedDiceId={selectedDiceId}
          onSelectDice={handleSelectDice}
          onPutSound={playPutSound}
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
