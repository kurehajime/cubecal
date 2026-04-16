import './App.css'
import { SceneCanvas } from './components/scene/SceneCanvas'

function App() {
  return (
    <main className="app-shell">
      <section className="app-copy">
        <p className="app-eyebrow">Dice Calendar</p>
        <h1>Scene Bootstrap</h1>
        <p className="app-lead">
          Three.js / React Three Fiber / Rapier を使った初期シーンです。
          次のタスクでダイス面、選択 UI、回転ロジックを実装します。
        </p>
      </section>

      <section className="scene-panel" aria-label="Dice calendar 3D scene">
        <SceneCanvas />
      </section>
    </main>
  )
}

export default App
