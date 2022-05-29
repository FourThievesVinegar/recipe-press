import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

import Looking from '../icons/looking.svg'
import ReactionChamber from '../icons/reaction_chamber.svg'
import ReactionComplete from '../icons/reaction_complete.svg'
//import SyringeEmpty from '../icons/syringe_empty.svg'
import Syringe from '../icons/syringe.svg'
import Temperature from '../icons/temperature.svg'

import './RecipeOverviewStep.css'

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
    case 'humanTask':
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

export const RecpieOverViewStepArrows = ({ step, index }) => {
  let arrows = []

  if (step.options) {
    arrows = step.options.map((option, optionIndex) => {
      const nextDistance = parseInt(option.next) - index
      let styleObject = {}
      if (nextDistance === 0) {
        styleObject = {}
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-same"
            style={styleObject}
          >
            {option.text}
          </div>
        )
      }
      if (nextDistance > 1) {
        const arrowWidth = 50 + 120 * (nextDistance - 1)
        const arrowTop = 0 + 100 * (Math.min(nextDistance, 6) - 1)
        styleObject = { width: `${arrowWidth}%`, top: `${arrowTop}%` }
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-forward"
            style={styleObject}
          >
            {option.text}: {index} {'⇨'} {option.next}
          </div>
        )
      }
      if (nextDistance === 1) {
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-forward"
            style={styleObject}
          >
            {`${option.text}`}
          </div>
        )
      }
      if (nextDistance === -1) {
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-backward"
            style={styleObject}
          >
            {`${option.text}`}
          </div>
        )
      }
      if (nextDistance < -1) {
        const arrowWidth = 50 - 120 * (nextDistance + 1)
        const arrowTop = 0 - 100 * (Math.max(nextDistance, -6) + 1)
        styleObject = { width: `${arrowWidth}%`, top: `${arrowTop}%` }
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-backward"
            style={styleObject}
          >
            {`${option.text}`}: {index} {'⇨'} {option.next}
          </div>
        )
      }
    })
  }

  return <div className="recipe-step-arrows">{arrows}</div>
}

export const RecipeOverviewStep = ({ step, index, isCurrentStep }) => {
  const { setCurrentStep } = useRecipeContext()

  const dragStartHandler = e => {
    e.dataTransfer.setData('dragged/index', index)
  }

  return (
    <div
      className={`recipe-overview-step ${isCurrentStep ? 'current-step' : ''} ${
        !step.baseTask || step.baseTask === 'humanTask' ? 'human-task' : 'automated-task'
      }`}
      onClick={() => setCurrentStep(index)}
      draggable="true"
      onDragStart={e => dragStartHandler(e)}
    >
      <div className="recipe-overview-step-index">{index}</div>
      {step.done && <div className="recipe-step-final-step">☑</div>}
      <div className="recipe-overview-step-icon">
        <RecipeOverviewStepIcon step={step} />
      </div>
      <p>{step.message}</p>
      {index === 0 && <RecipeOverViewDropTarget index={index} />}
      <RecipeOverViewDropTarget index={index + 1} />
      <RecpieOverViewStepArrows step={step} index={index} />
    </div>
  )
}
