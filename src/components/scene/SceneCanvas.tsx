import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DiceScene } from './DiceScene'

export function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [7.5, 6.5, 7.5], fov: 34 }}
      shadows
      dpr={[1, 1.75]}
    >
      <color attach="background" args={['#efe6d8']} />
      <fog attach="fog" args={['#efe6d8', 10, 20]} />
      <ambientLight intensity={1.1} />
      <directionalLight
        castShadow
        intensity={2.2}
        position={[6, 10, 5]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <DiceScene />
      <OrbitControls
        enablePan={false}
        maxDistance={16}
        minDistance={8}
        minPolarAngle={0.7}
        maxPolarAngle={1.35}
      />
    </Canvas>
  )
}
