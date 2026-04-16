import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DiceScene } from './DiceScene'

export function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [2.25, 3.25, 12.1], fov: 29.5 }}
      shadows
      dpr={[1, 1.75]}
    >
      <color attach="background" args={['#efe6d8']} />
      <fog attach="fog" args={['#efe6d8', 10, 21]} />
      <hemisphereLight args={['#fff8ef', '#b28b68', 1]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        intensity={2.2}
        position={[5, 8, 9]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <directionalLight
        intensity={0.45}
        position={[-6, 3, -4]}
      />
      <DiceScene />
      <OrbitControls
        enableDamping
        enablePan={false}
        maxDistance={15.5}
        minDistance={7}
        minPolarAngle={0.78}
        maxPolarAngle={1.08}
        target={[0, -0.12, 0]}
      />
    </Canvas>
  )
}
