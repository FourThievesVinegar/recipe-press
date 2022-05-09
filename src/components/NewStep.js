import React from 'react'

export const NewStep = () => {
  return (
    <div className="new-step recipe-step">
      <h2>New Recipe Step</h2>
      <label for="title">Step title</label>
      <input type="text" name="title" />
      <label for="title">Step description</label>
      <textarea name="description" />
    </div>
  )
}
