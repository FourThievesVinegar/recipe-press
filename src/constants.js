export const recipeStepBaseTasks = [
  { label: 'Human Task', value: 'noTask' },
  { label: 'Cool', value: 'cool' },
  { label: 'Heat', value: 'heat' },
  { label: 'Maintain Cooling', value: 'maintainCool' },
  { label: 'Maintain Heat', value: 'maintainHeat' },
  { label: 'Pump', value: 'pump' },
  { label: 'Stir', value: 'stir' },
]

export const baseStepParameters = {
  noTask: [],
  cool: ['temp'],
  heat: ['temp'],
  maintainCool: ['temp', 'time', 'tolerance'],
  maintainHeat: ['temp', 'time', 'tolerance'],
  pump: ['pump', 'volume'],
  stir: ['time'],
}
