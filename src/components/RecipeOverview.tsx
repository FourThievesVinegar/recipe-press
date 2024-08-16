import React, { useRef } from 'react'
import { NewRecipeForm } from './NewRecipeForm'
import { RecipeOverviewStep } from './RecipeOverviewStep'
import { useRecipeContext } from '../contexts/RecipeContext'

import './RecipeOverview.css'
import { Trans, useTranslation } from 'react-i18next'

export const RecipeOverview = () => {
  const { t } = useTranslation()
  const { recipes, currentRecipe, currentStep, embedded } = useRecipeContext()

  const arrowCount = useRef(0)
  arrowCount.current = 0

  if (!embedded && recipes.length === 0) {
    return <NewRecipeForm />
  }

  return (
    <section className="recipe-overview">
      <h2>{t('recipe-steps')}</h2>
      <div className="recipe-overview-steps">
        {recipes[currentRecipe]?.steps?.length < 1 ? (
          <p className="recipe-overview-no-steps">
            <Trans i18nKey={'recipe-has-no-steps'}></Trans>
          </p>
        ) : null}
        {recipes[currentRecipe]?.steps?.map((step, index) => {
          return (
            <RecipeOverviewStep
              step={step}
              index={index}
              isCurrentStep={currentStep === index}
              arrowCount={arrowCount}
              key={index + step.message}
            />
          )
        })}
      </div>
      <div className="recipe-overview-controls"></div>
    </section>
  )
}
