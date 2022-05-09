import { AppHeader } from './components/Header'
import { RecipeOverview } from './components/RecipeOverview'
import { RecipeProvider } from './contexts/RecipeContext'
import { StepDetails } from './components/StepDetails'

import './App.css'

function App() {
  return (
    <div className="App">
      <RecipeProvider>
        <AppHeader />
        <RecipeOverview />
        <StepDetails />
      </RecipeProvider>
    </div>
  )
}

export default App
