import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRecipeContext } from './RecipeContext'
import { HUMAN_TASK } from '../constants'

export const RecipeSimulatorContext = createContext({})

export const useRecipeSimulatorContext = () => {
  const context = useContext(RecipeSimulatorContext)

  if (!context) {
    console.log('ERROR! RecipeSimulator context used outside its provider')
  }

  return context
}

export const RecipeSimulatorProvider = ({ children }) => {
  const [automatedStepLength, setAutomatedStepLength] = useState(3)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationRecipe, setSimulationRecipe] = useState(null)
  const [simulationStepIndex, setSimulationStepIndex] = useState(0)
  const [simulationStep, setSimulationStep] = useState(null)
  const { currentRecipe, recipes } = useRecipeContext()

  useEffect(() => {
    const step = simulationRecipe?.steps[simulationStepIndex]

    if (step?.baseTask && step?.baseTask !== HUMAN_TASK) {
      window.setTimeout(() => {
        goToNextStep()
      }, 1000 * automatedStepLength)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationStepIndex])

  const simulateRecipe = () => {
    setSimulationRecipe(recipes[currentRecipe])
    setSimulationStep(recipes[currentRecipe].steps[0])
    setSimulationStepIndex(0)
    setIsSimulating(true)
  }
  const cancelSimulation = () => {
    setIsSimulating(false)
  }
  const startSimulation = () => {
    setSimulationStepIndex(0)
    setSimulationStep(simulationRecipe.steps[0])
  }
  const goToNextStep = () => {
    setSimulationStepIndex(simulationStep.next)
    setSimulationStep(simulationRecipe.steps[simulationStep.next])
  }

  const goToStep = stepIndex => {
    setSimulationStepIndex(stepIndex)
    setSimulationStep(simulationRecipe.steps[stepIndex])
  }

  return (
    <RecipeSimulatorContext.Provider
      value={{
        automatedStepLength,
        setAutomatedStepLength,
        cancelSimulation,
        goToNextStep,
        goToStep,
        simulationStep,
        simulationStepIndex,
        isSimulating,
        simulateRecipe,
        startSimulation,
      }}
    >
      {children}
    </RecipeSimulatorContext.Provider>
  )
}
