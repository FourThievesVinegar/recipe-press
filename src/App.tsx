import { AppHeader } from './components/Header'
import { RecipeMap } from './components/RecipeMap'
import { RecipeOverview } from './components/RecipeOverview'
import { RecipeProvider } from './contexts/RecipeContext'
import { StepDetails } from './components/StepDetails'

import './App.css'
import { RecipeSimulatorProvider } from './contexts/RecipeSimulatorContext'
import { RecipeSimulator } from './components/RecipeSimulator'
import React from 'react'

function App() {
  return (
    <div className="App">
      <RecipeProvider>
        <RecipeSimulatorProvider>
          <AppHeader />
          <main>
            <RecipeMap />
            <RecipeOverview />
            <StepDetails />
          </main>
          <RecipeSimulator />
        </RecipeSimulatorProvider>
      </RecipeProvider>
    </div>
  )
}

export default App
