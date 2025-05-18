import { useState } from 'react'
import GameScene from './components/GameScene'
import HUD from './components/HUD'
import StartMenu from './components/StartMenu'
import GameOverScreen from './components/GameOverScreen'
import { useGameStore } from './store/gameStore'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)
  const resetGame = useGameStore((s) => s.resetGame)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)

  const start = () => {
    resetGame()
    setStarted(true)
  }

  const restart = () => {
    resetGame()
    setStarted(true)
  }

  const showEndScreen = started && (isGameOver || isGameWon)

  return (
    <>
      {started && <GameScene />}
      {started && <HUD />}
      {!started && <StartMenu onStart={start} />}
      {showEndScreen && <GameOverScreen onRestart={restart} />}
    </>
  )
}

export default App
