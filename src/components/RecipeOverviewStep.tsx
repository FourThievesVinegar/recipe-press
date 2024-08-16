import React, { useState } from 'react'
import { RecipeStepType, useRecipeContext } from '../contexts/RecipeContext'

import { ICON_MAP, TASK_TO_ICON_MAP, TaskType } from '../constants'

import './RecipeOverviewStep.css'
import { useTranslation } from 'react-i18next'

export const RecipeOverviewStepIcon = ({ step }: { step: RecipeStepType }) => {
  if (!step) return <></>
  //@ts-ignore
  const icon = ICON_MAP[step.icon || TASK_TO_ICON_MAP[step.baseTask]]
  return <div className="recipe-overview-step-icon">{icon?.image}</div>
}

export const RecipeOverViewDropTarget = ({ index }: { index: number }) => {
  const { reorderStep } = useRecipeContext()
  const [hovered, setHovered] = useState(false)

  const dropHandler = (newIndex: number, stepIndex: number) => {
    if (newIndex !== undefined && stepIndex !== undefined) {
      reorderStep(newIndex, stepIndex)
    }
  }

  return (
    <div
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

export const RecpieOverViewStepArrows = ({
  step,
  index,
  arrowCount,
}: {
  step: RecipeStepType
  index: number
  arrowCount: any
}) => {
  const { setCurrentStep } = useRecipeContext()

  let arrows: any[] = []

  const stepHeight = 172

  if (step.options) {
    arrows = step.options.map((option, optionIndex) => {
      const nextDistance = parseInt(option.next as any) - index
      let styleObject: any = { bottom: `${arrowCount.current * 24}px` }
      arrowCount.current++

      if (nextDistance === 0) {
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-same"
            style={styleObject}
            title={option.text}
          >
            "{option.text}"
          </div>
        )
      }
      if (nextDistance > 1) {
        const arrowWidth = stepHeight * nextDistance
        // const arrowTop = 0 + 100 * (Math.min(nextDistance, 6) - 1)
        styleObject = { ...styleObject, width: `${arrowWidth}px`, left: '48px' }
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-forward"
            style={styleObject}
            title={option.text}
          >
            "{option.text}" {index} {'⇨'} {option.next}
          </div>
        )
      }
      if (nextDistance === 1) {
        styleObject = { ...styleObject, left: '48px', width: `${stepHeight}px` }
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-forward"
            style={styleObject}
            title={option.text}
          >
            {`"${option.text}"`}
          </div>
        )
      }
      if (nextDistance === -1) {
        styleObject = { ...styleObject, left: `-${100}px`, width: `${stepHeight}px` }

        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-backward"
            style={styleObject}
            title={option.text}
          >
            {`"${option.text}"`}
          </div>
        )
      }
      if (nextDistance < -1) {
        const arrowWidth = stepHeight * Math.abs(nextDistance)

        styleObject = { ...styleObject, width: `${arrowWidth}px`, left: `${72 - arrowWidth}px` }
        return (
          <div
            key={`${index}-${optionIndex}`}
            className="recipe-step-arrow-backward"
            style={styleObject}
            title={option.text}
          >
            {`"${option.text}"`} {index} {'⇨'} {option.next}
          </div>
        )
      }
      return null
    })
  }

  return (
    <button
      className="recipe-step-arrows"
      onClick={() => setCurrentStep(index)}
      style={{ width: `${arrowCount.current * 32}px`, height: 0, padding: 0 }}
    >
      {arrows}
    </button>
  )
}

export const RecipeOverviewStep = ({
  step,
  index,
  isCurrentStep,
  arrowCount,
}: {
  step: RecipeStepType
  index: number
  isCurrentStep: boolean
  arrowCount: any
}) => {
  const { t } = useTranslation()
  const { setCurrentStep, stepErrors, deleteStep } = useRecipeContext()

  const deleteButtonClickHandler = () => {
    if (window.confirm(t(`delete-step-confirmation`, { index }))) {
      deleteStep(index)
    }
  }

  const dragStartHandler = (e: any) => {
    e.dataTransfer.setData('dragged/index', index)
  }

  let hasError
  let errorMessage
  if (stepErrors[index]) {
    hasError = true
    errorMessage = stepErrors[index][0]
  }

  return (
    <div className={`recipe-overview-step-container ${isCurrentStep ? 'current-step' : ''} `}>
      <div
        id={`recipe-overview-step-${index}`}
        className={`recipe-overview-step ${
          !step.baseTask || step.baseTask === TaskType.HUMAN_TASK ? 'human-task' : 'automated-task'
        }`}
        onClick={() => setCurrentStep(index)}
        draggable="true"
        onDragStart={e => dragStartHandler(e)}
      >
        <div className="recipe-overview-step-index">{index}</div>
        <div className="recipe-overview-step-buttons">
          <button onClick={deleteButtonClickHandler}>X</button>
        </div>
        {step.done && <div className="recipe-step-final-step">☑</div>}
        {hasError ? (
          <div title={errorMessage} className="recipe-step-error-icon">
            ⚠
          </div>
        ) : (
          <RecipeOverviewStepIcon step={step} />
        )}

        <p>{step.message}</p>
        {index === 0 && <RecipeOverViewDropTarget index={index} />}
        <RecipeOverViewDropTarget index={index + 1} />
      </div>
      <RecpieOverViewStepArrows step={step} index={index} arrowCount={arrowCount} />
    </div>
  )
}
