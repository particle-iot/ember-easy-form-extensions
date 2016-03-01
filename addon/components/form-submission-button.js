import Ember from 'ember';
import layout from '../templates/components/form-submission-button';

const { computed } = Ember;

export default Ember.Component.extend({

  /* Options */

  action: null,
  className: 'button',
  disabled: false,
  text: null,
  type: 'button',
  layout: layout,

  /* Properties */

  attributeBindings: ['dataTest:data-test', 'disabled', 'type'],
  classNameBindings: ['className'],
  tagName: 'button',

  dataTest: computed('action', function() {
    const action = this.get('action') || '';
    const dasherizedAction = Ember.String.dasherize(action);

    return `button-for-${dasherizedAction}`;
  }),

  /* Methods */

  click: function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.sendAction();
  },
});
