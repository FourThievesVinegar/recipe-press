import React, { createContext, useContext, useEffect, useState } from 'react'
import { Recipe, RecipeStepType, useRecipeContext } from './RecipeContext'
import { TaskType } from '../constants'

export type RecipeSimulatorContext = {
  automatedStepLength: number
  setAutomatedStepLength: (length: number) => void
  cancelSimulation: () => void
  goToNextStep: () => void
  goToStep: (stepIndex: number) => void
  simulationStep: RecipeStepType | null
  simulationStepIndex: number | undefined
  isSimulating: boolean
  simulateRecipe: () => void
  startSimulation: () => void
}
//@ts-ignore
export const RecipeSimulatorContext = createContext<RecipeSimulatorContext>(null)

export const useRecipeSimulatorContext = () => {
  const context = useContext(RecipeSimulatorContext)

  if (!context) {
    console.log('ERROR! RecipeSimulator context used outside its provider')
  }

  return context
}

export const RecipeSimulatorProvider = ({ children }: React.PropsWithChildren) => {
  const [automatedStepLength, setAutomatedStepLength] = useState(3)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationRecipe, setSimulationRecipe] = useState<Recipe | null>(null)
  const [simulationStepIndex, setSimulationStepIndex] = useState<number | undefined>(0)
  const [simulationStep, setSimulationStep] = useState<RecipeStepType | null>(null)
  const { currentRecipe, recipes } = useRecipeContext()

  useEffect(() => {
    //might throw an error?
    //@ts-ignore
    const step = simulationRecipe?.steps[simulationStepIndex]

    if (step?.baseTask && step?.baseTask !== TaskType.HUMAN_TASK) {
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
    if (simulationRecipe) {
      setSimulationStepIndex(0)
      setSimulationStep(simulationRecipe.steps[0])
    }
  }
  const goToNextStep = () => {
    if (simulationStep && simulationRecipe) {
      setSimulationStepIndex(simulationStep.next)
      //might throw an error?
      //@ts-ignore
      setSimulationStep(simulationRecipe.steps[simulationStep.next])
    }
  }

  const goToStep = (stepIndex: number) => {
    if (simulationRecipe) {
      setSimulationStepIndex(stepIndex)
      setSimulationStep(simulationRecipe.steps[stepIndex])
    }
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
