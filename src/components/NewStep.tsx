import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { TaskType } from '../constants'

export const NewStep = () => {
  const [message, setMessage] = useState('')

  const { createStep } = useRecipeContext()

  return (
    <div className="new-step recipe-step">
      <h2>New Recipe Step</h2>
      <label htmlFor="message">User Message</label>
      <textarea
        name="message"
        value={message}
        onChange={e => {
          setMessage(e.target.value)
        }}
        placeholder="The text you enter here will be shown to the user while the step is running."
      />
      <button
        onClick={() => {
          createStep(message, TaskType.HUMAN_TASK)
        }}
      >
        Add Step
      </button>
    </div>
  )
}
