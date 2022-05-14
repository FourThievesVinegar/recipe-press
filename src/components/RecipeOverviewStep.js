import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

import Looking from '../icons/looking.svg'
import ReactionChamber from '../icons/reaction_chamber.svg'
import ReactionComplete from '../icons/reaction_complete.svg'
import SyringeEmpty from '../icons/syringe_empty.svg'
import Syringe from '../icons/syringe.svg'
import Temperature from '../icons/temperature.svg'

const RecipeOverviewStepIcon = ({ step }) => {
  if (!step) return <></>

  switch (step.baseTask) {
    case 'cool':
    case 'heat':
    case 'maintainCool':
    case 'maintainHeat':
      return <img src={Temperature} alt="Heating or cooling" />
    case 'pump':
      return <img src={Syringe} alt="Pumping reagent" />
    case 'stir':
      return <img src={ReactionChamber} alt="Reaction chamber" />
    case 'noTask':
      return <img src={Looking} alt="Human task" />
    default:
      return <img src={ReactionComplete} alt="Default image" />
  }
}

export const RecipeOverviewStep = ({ step, index }) => {
  const { setCurrentStep } = useRecipeContext()

  return (
    <div
      className={`recipe-overview-step ${
        !step.baseTask || step.baseTask === 'noTask' ? 'human-task' : 'automated-task'
      }`}
      onClick={() => setCurrentStep(index)}
    >
      <div className="recipe-overview-step-icon">
        <RecipeOverviewStepIcon step={step} />
      </div>
      <p>{step.message}</p>
    </div>
  )
}
