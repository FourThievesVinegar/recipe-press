import React from 'react'
import { useRecipeSimulatorContext } from '../contexts/RecipeSimulatorContext'

import './RecipeSimulator.css'
import { RecipeOverviewStepIcon } from './RecipeOverviewStep'
import { useTranslation } from 'react-i18next'

export const RecipeSimulator = () => {
  const { t } = useTranslation()
  const {
    automatedStepLength,
    cancelSimulation,
    goToStep,
    isSimulating,
    setAutomatedStepLength,
    simulationStep,
    simulationStepIndex,
    startSimulation,
  } = useRecipeSimulatorContext()

  return (
    isSimulating && (
      <section className="recipe-simulator">
        <div className="recipe-simulator-backdrop" onClick={() => cancelSimulation()} />
        <div className="recipe-simulator-container">
          <div className="recipe-simulator-controls">
            <button onClick={() => startSimulation()}>{t('simulation-restart')}</button>
            <p>{t('simulation-step', { simulationStepIndex })}</p>
            <div className="recipe-simulator-controls-item">
              <label htmlFor="automated-step-length">{t('simulation-step-length')}</label>
              <input
                type="number"
                onChange={e => {
                  setAutomatedStepLength(Number(e.target.value))
                }}
                value={automatedStepLength}
                min="0"
              />
            </div>
            <button onClick={() => cancelSimulation()}>{t('close-simulation')}</button>
          </div>
          <div className="recipe-simulator-window">
            {simulationStep ? (
              <>
                <h3>{simulationStep.message}</h3>
                {simulationStep.options?.map(option => (
                  <button
                    key={option.text}
                    className="recipe-simulator-option-button"
                    onClick={() => goToStep(option.next)}
                  >
                    {option.text}
                  </button>
                ))}
                <RecipeOverviewStepIcon step={simulationStep} />
                <p>Type: {simulationStep.baseTask}</p>
                {simulationStep.parameters && (
                  <ul className="recipe-simulator-parameters">
                    {Object.keys(simulationStep.parameters).map(paramKey => (
                      <li key={paramKey}>
                        {paramKey}: {simulationStep.parameters[paramKey]}
                      </li>
                    ))}
                  </ul>
                )}
                {simulationStep.andStir && <p>{t('simulation-and-stir')}</p>}
                {simulationStep.done && <p>{t('simulation-complete')}</p>}
              </>
            ) : (
              <p>{t('no-simulation-step')}</p>
            )}
          </div>
        </div>
      </section>
    )
  )
}
