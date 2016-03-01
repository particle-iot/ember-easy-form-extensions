import Ember from 'ember';
import softAssert from '../utils/observers/soft-assert';

const { computed } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['legend'],
  className: 'controls',
  classNameBindings: ['className'],
  legend: null,
  modelPath: 'model',
  tagName: '',
  checkForLegend: softAssert('legend'),

  isFormControls: computed(function() {
    return true;
  }).readOnly(),

});
