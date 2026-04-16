import './App.css'
import { SceneCanvas } from './components/scene/SceneCanvas'

function App() {
  return (
    <main className="app-shell">
      <section className="scene-panel" aria-label="Dice calendar 3D scene">
        <SceneCanvas />
      </section>
    </main>
  )
}

export default App
