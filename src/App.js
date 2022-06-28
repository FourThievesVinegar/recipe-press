import { AppHeader } from './components/Header'
import { RecipeOverview } from './components/RecipeOverview'
import { RecipeProvider } from './contexts/RecipeContext'
import { StepDetails } from './components/StepDetails'

import './App.css'
import { RecipeSimulatorProvider } from './contexts/RecipeSimulatorContext'
import { RecipeSimulator } from './components/RecipeSimulator'

function App() {
  return (
    <div className="App">
      <RecipeProvider>
        <RecipeSimulatorProvider>
          <AppHeader />
          <RecipeOverview />
          <StepDetails />
          <RecipeSimulator />
        </RecipeSimulatorProvider>
      </RecipeProvider>
    </div>
  )
}

export default App
