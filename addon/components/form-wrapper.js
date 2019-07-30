import Ember from 'ember';
import FormSubmissionClassNameMixin from 'ember-easy-form-extensions/mixins/components/form-submission-class-name';

const { computed, on } = Ember;

export default Ember.Component.extend(
  FormSubmissionClassNameMixin, {

  /* Options */

  className: 'form',
  novalidate: true,
  autoFocus: true,

  /* Properties */

  attributeBindings: ['novalidate'],
  classNameBindings: ['className'],
  formIsSubmitted: computed.oneWay('formController.formIsSubmitted'),
  tagName: 'form',

  /* Properties */

  /* A shim to enabled use with controller and components
  moving forward */

  formController: Ember.computed(function() {
    // TODO: targetObject is deprecated as of 2.13; this is a bandaid
    const routeController = this.get('_targetObject');

    if (this.get('hasFormMixin')) {
      return this;
    } else if (routeController.get('hasFormMixin')) {
      return routeController;
    } else {
      return null;
    }
  }),

  /* Methods */

  /* Autofocus on the first input.

  TODO - move to form component
  mixin when routeable components land */

  autofocus: on('didInsertElement', function() {
    if(this.get('autoFocus')) {
      var input = this.$().find('input').first();
      if (!Ember.$(input).hasClass('datepicker')) {
        setTimeout(() => {
          input.focus();
        }, 100);
      }
    }
  }),

});
