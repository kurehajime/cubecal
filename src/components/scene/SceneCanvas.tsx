import type {
  DiceKind,
  DiceOrientation,
} from '../../features/calendar/model/types'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { DiceScene } from './DiceScene'

const DEFAULT_CAMERA_POSITION: [number, number, number] = [2.25, 3.25, 12.1]
const DEFAULT_CONTROLS_TARGET: [number, number, number] = [0, -0.28, 0]

type SceneCanvasProps = {
  diceOrientations: Record<DiceKind, DiceOrientation>
  diceOrder: DiceKind[]
  selectedDiceId: DiceKind | null
  onSelectDice: (diceId: DiceKind | null) => void
}

export function SceneCanvas({
  diceOrientations,
  diceOrder,
  selectedDiceId,
  onSelectDice,
}: SceneCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  useEffect(() => {
    const controls = controlsRef.current

    if (!selectedDiceId || !controls) {
      return
    }

    controls.object.position.set(...DEFAULT_CAMERA_POSITION)
    controls.target.set(...DEFAULT_CONTROLS_TARGET)
    controls.update()
  }, [selectedDiceId])

  return (
    <Canvas
      camera={{ position: DEFAULT_CAMERA_POSITION, fov: 29.5 }}
      gl={{ alpha: true }}
      shadows
      dpr={[1, 1.75]}
      onPointerMissed={() => onSelectDice(null)}
    >
      <fog attach="fog" args={['#efe6d8', 10, 21]} />
      <hemisphereLight args={['#fff8ef', '#b28b68', 1]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        intensity={2.2}
        position={[5, 8, 9]}
        shadow-bias={-0.00035}
        shadow-normalBias={0.02}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={2.8}
        shadow-camera-right={4.4}
        shadow-camera-bottom={-2.6}
        shadow-camera-left={-4.4}
      />
      <directionalLight
        intensity={0.45}
        position={[-6, 3, -4]}
      />
      <DiceScene
        diceOrientations={diceOrientations}
        diceOrder={diceOrder}
        onSelectDice={onSelectDice}
        selectedDiceId={selectedDiceId}
      />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        enabled={!selectedDiceId}
        enablePan={false}
        enableZoom={false}
        maxDistance={15.5}
        minDistance={7}
        minPolarAngle={0.78}
        maxPolarAngle={1.08}
        target={DEFAULT_CONTROLS_TARGET}
      />
    </Canvas>
  )
}
