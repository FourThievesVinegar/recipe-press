import React from 'react'
import { HeaderMenu } from './HeaderMenu'
import { useRecipeContext } from '../contexts/RecipeContext'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'

export const HeaderControls = () => {
  const { exportRecipe, stepErrors } = useRecipeContext()
  const { simulateRecipe } = useRecipeSimulatorContext()

  const stepErrorsMessages = Object.keys(stepErrors).reduce((messages, messageIndex) => {
    const message = stepErrors[messageIndex]
      ? `Step ${messageIndex}: ${stepErrors[messageIndex]}`
      : null
    if (message) {
      return messages.length ? messages + ' | ' + message : message
    }
    return messages
  }, '')

  return (
    <span className="header-controls">
      <button
        onClick={() => {
          simulateRecipe()
        }}
      >
        Run it!
      </button>
      <button
        disabled={stepErrorsMessages.length > 0}
        title={stepErrorsMessages.length > 0 ? stepErrorsMessages : 'Click to download'}
        onClick={() => {
          exportRecipe()
        }}
      >
        Download Recipe
      </button>
      <HeaderMenu />
    </span>
  )
}
