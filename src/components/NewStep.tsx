import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { TaskType } from '../constants'
import { useTranslation } from 'react-i18next'

export const NewStep = () => {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  const { createStep } = useRecipeContext()

  return (
    <div className="new-step recipe-step">
      <h2>{t('new-recipe-step')}</h2>
      <label htmlFor="message">{t('User Message')}</label>
      <textarea
        name="message"
        value={message}
        onChange={e => {
          setMessage(e.target.value)
        }}
        placeholder={t('recipe-step-message-explaination')}
      />
      <button
        onClick={() => {
          createStep(message, TaskType.HUMAN_TASK)
        }}
      >
        {t('add-step')}
      </button>
    </div>
  )
}
