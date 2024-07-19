import React from 'react'
import { HeaderMenu } from './HeaderMenu'
import { useRecipeContext } from '../contexts/RecipeContext'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'

export const HeaderControls = () => {
  const { exportRecipe, stepErrors } = useRecipeContext()
  const { simulateRecipe } = useRecipeSimulatorContext()

  const stepErrorMessages = Object.keys(stepErrors).reduce((messages, messageIndex) => {
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
        disabled={stepErrorMessages.length > 0}
        title={stepErrorMessages.length > 0 ? stepErrorMessages : 'Click to download'}
        onClick={() => {
          exportRecipe()
        }}
      >
        {stepErrorMessages && <span>⚠ </span>}Download Recipe
      </button>
      <HeaderMenu />
    </span>
  )
}
