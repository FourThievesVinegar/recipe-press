import React, { useState } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'

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
      />
      <button
        onClick={() => {
          createStep(message)
        }}
      >
        Add Step
      </button>
    </div>
  )
}
