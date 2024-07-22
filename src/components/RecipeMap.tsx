import React from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { TaskType } from '../constants'
import './RecipeMap.css'

export const RecipeMap = () => {
  const { recipes, currentRecipe, currentStep, setCurrentStep } = useRecipeContext()

  return (
    <section className="recipe-map">
      <div className="recipe-map-controls">
        <button
          onClick={() => {
            setCurrentStep(-1)
          }}
        >
          New Step
        </button>
      </div>
      <ul>
        {recipes[currentRecipe]?.steps?.map((step, index) => {
          return (
            <RecipeMapItem
              step={step}
              index={index}
              isCurrentStep={currentStep === index}
              setCurrentStep={setCurrentStep}
              key={index + step.message}
            />
          )
        })}
      </ul>
    </section>
  )
}

const RecipeMapItem = ({ step, index, isCurrentStep, setCurrentStep }: any) => (
  <li
    className={`recipe-map-item ${isCurrentStep ? 'current-step' : ''} ${
      !step.baseTask || step.baseTask === TaskType.HUMAN_TASK ? 'human-task' : 'automated-task'
    }`}
    onClick={() => {
      setCurrentStep(index)
      document
        .getElementById(`recipe-overview-step-${index}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }}
  >
    {index}
  </li>
)
