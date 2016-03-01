import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['for'],
  className: 'label',
  classNameBindings: ['className'],
  for: null,
  text: null,
  tagName: 'label',
});
