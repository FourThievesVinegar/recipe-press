import React from 'react'
import { HeaderMenu } from './HeaderMenu'
import { useRecipeContext } from '../contexts/RecipeContext'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'
import { useTranslation } from 'react-i18next'

export const HeaderControls = () => {
  const { t } = useTranslation()
  const { exportRecipe, stepErrors } = useRecipeContext()
  const { simulateRecipe } = useRecipeSimulatorContext()

  const stepErrorMessages = Object.keys(stepErrors).reduce((messages, messageIndex) => {
    //@ts-ignore
    const message = stepErrors[messageIndex] //@ts-ignore
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
        {t('simulate-recipe')}
      </button>
      <button
        disabled={stepErrorMessages.length > 0}
        title={stepErrorMessages.length > 0 ? stepErrorMessages : t('download-recipe-tooltip')}
        onClick={() => {
          exportRecipe()
        }}
      >
        {stepErrorMessages && <span>⚠ </span>}
        {t('download-recipe')}
      </button>
      <HeaderMenu />
    </span>
  )
}
