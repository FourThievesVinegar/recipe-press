import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

import Looking from '../icons/looking.svg'
import ReactionChamber from '../icons/reaction_chamber.svg'
import ReactionComplete from '../icons/reaction_complete.svg'
//import SyringeEmpty from '../icons/syringe_empty.svg'
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
      return <img src={ReactionComplete} alt="" />
  }
}

export const RecipeOverViewDropTarget = ({ index }) => {
  const { reorderStep } = useRecipeContext()
  const [hovered, setHovered] = useState(false)

  const dropHandler = (newIndex, stepIndex) => {
    if (newIndex && stepIndex) {
      reorderStep(newIndex, stepIndex)
    }
  }
  return (
    <div
      droppable="true"
      onDrop={e => {
        const stepIndex = parseInt(e.dataTransfer.getData('dragged/index'))
        setHovered(false)
        dropHandler(index, stepIndex)
      }}
      onDragOver={e => {
        e.stopPropagation()
        e.preventDefault()
        setHovered(true)
      }}
      onDragLeave={() => setHovered(false)}
      className={`${index === 0 ? 'first-target-drop-target ' : ''}${
        hovered ? 'hovered-drop-target ' : ''
      }recipe-overview-drop-target`}
    />
  )
}

export const RecipeOverviewStep = ({ step, index, isCurrentStep }) => {
  const { setCurrentStep } = useRecipeContext()

  const dragStartHandler = e => {
    e.dataTransfer.setData('dragged/index', index)
  }

  return (
    <div
      className={`recipe-overview-step ${isCurrentStep ? 'current-step' : ''} ${
        !step.baseTask || step.baseTask === 'noTask' ? 'human-task' : 'automated-task'
      }`}
      onClick={() => setCurrentStep(index)}
      draggable="true"
      onDragStart={e => dragStartHandler(e)}
    >
      <div className="recipe-overview-step-icon">
        <RecipeOverviewStepIcon step={step} />
      </div>
      <p>{step.message}</p>
      {index === 0 && <RecipeOverViewDropTarget index={index} />}
      <RecipeOverViewDropTarget index={index + 1} />
    </div>
  )
}
