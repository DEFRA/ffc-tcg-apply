const reviewAndSubmitForms = require('../form-data/review-and-submit')
const placeholderApplyForms = require('../form-data/placeholder-apply')
const placeholderSelectionForms = require('../form-data/placeholder-selection')

const getFormData = (forms) => {
  // find if forms already exist
  const validActionForms = forms.filter(formGroup => formGroup.groupName === 'Action selection')
  const validApplyForms = forms.filter(formGroup => formGroup.groupName === 'Apply for SFI actions')

  // create dynamic links for individual sfi actions
  if (validApplyForms.length > 0) {
    validApplyForms[0].availableForms.map(form => {
      const actionName = form.formCode.split('_')[1]
      form.url = `${form.url}/${actionName}`
      return form
    })
  }
  // add placeholders if not present
  const actionForms = validActionForms.length === 0 ? placeholderSelectionForms : [undefined]
  const sfiApplyForms = validApplyForms.length === 0 ? placeholderApplyForms : [undefined]
  // compile then remove any undefined
  return [...forms, ...actionForms, ...sfiApplyForms, ...reviewAndSubmitForms].filter(form => form !== undefined)
}

module.exports = { getFormData }
