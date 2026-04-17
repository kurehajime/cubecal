import type {
  DiceKind,
  DiceRuntimeState,
} from '../../features/calendar/model/types'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DiceScene } from './DiceScene'

type SceneCanvasProps = {
  diceStates: Record<DiceKind, DiceRuntimeState>
  diceOrder: DiceKind[]
  selectedDiceId: DiceKind | null
  onSelectDice: (diceId: DiceKind | null) => void
}

export function SceneCanvas({
  diceStates,
  diceOrder,
  selectedDiceId,
  onSelectDice,
}: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [2.25, 3.25, 12.1], fov: 29.5 }}
      shadows
      dpr={[1, 1.75]}
      onPointerMissed={() => onSelectDice(null)}
    >
      <color attach="background" args={['#efe6d8']} />
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
        diceStates={diceStates}
        diceOrder={diceOrder}
        onSelectDice={onSelectDice}
        selectedDiceId={selectedDiceId}
      />
      <OrbitControls
        enableDamping
        enablePan={false}
        maxDistance={15.5}
        minDistance={7}
        minPolarAngle={0.78}
        maxPolarAngle={1.08}
        target={[0, -0.28, 0]}
      />
    </Canvas>
  )
}
