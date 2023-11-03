const reviewAndSubmitForms = require('../form-data/review-and-submit')
const placeholderApplyForms = require('../form-data/placeholder-apply')
const placeholderSelectionForms = require('../form-data/placeholder-selection')

const getFormData = (forms) => {
  // find if forms already exist
  const validApplyForms = forms.filter(formGroup => formGroup.groupName === 'Apply for SFI actions')
  const validActionForms = forms.filter(formGroup => formGroup.groupName === 'Action selection')
  // add placeholders if not present
  const sfiApplyForms = validApplyForms.length === 0 ? placeholderApplyForms : [undefined]
  const actionForms = validActionForms.length === 0 ? placeholderSelectionForms : [undefined]
  // compile then remove any undefined
  return [...forms, ...actionForms, ...sfiApplyForms, ...reviewAndSubmitForms].filter(form => form !== undefined)
}

module.exports = { getFormData }
