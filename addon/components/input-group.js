import defaultFor from '../utils/default-for';
import Ember from 'ember';
import humanize from '../utils/humanize';

const { computed, observer, on, run, typeOf } = Ember;

export default Ember.Component.extend({

  /* Options */

  classNames: ['input-wrapper'],
  className: 'input-wrapper',
  hint: null,
  pathToInputPartials: 'form-inputs',
  property: null,
  newlyValidDuration: 3000,

  /* Input attributes */

  collection: null,
  content: null,
  optionValuePath: 'content',
  optionLabelPath: 'content',
  selection: null,
  multiple: null,
  name: computed.oneWay('property'),
  placeholder: null,
  prompt: null,
  disabled: false,

  /* Properties */

  attributeBindings: ['dataTest:data-test'],
  bindingForValue: null, // Avoid xBinding naming convention
  classNameBindings: ['validityClass'],
  formControls: null,
  isInvalid: computed.not('isValid'),
  isNewlyValid: false,
  isValid: true,
  modelPath: computed.oneWay('formControls.modelPath'),
  registerAction: 'registerInputGroup',
  showError: false,
  unregisterAction: 'unregisterInputGroup',
  value: null,

  dataTest: computed('property', function() {
    const property = this.get('property');
    const dasherizedProperty = Ember.String.dasherize(property);

    return `input-wrapper-for-${dasherizedProperty}`;
  }),

  formController: computed(function() {
    const hasFormController = this.nearestWithProperty('formController');

    return hasFormController.get('formController');
  }),

  inputId: computed(function() {
    return this.get('elementId') + '-input';
  }),

  inputPartial: computed('type', function() {
    const { pathToInputPartials, type } = this.getProperties(
      [ 'pathToInputPartials', 'type' ]
    );

    /* Remove leading and trailing slashes for consistency */

    const dir = pathToInputPartials.replace(/^\/|\/$/g, '');

    if (!!Ember.getOwner(this).lookup(`template:${dir}/${type}`)) {
      return `${dir}/${type}`;
    } else {
      return `${dir}/default`;
    }
  }),

  isInputWrapper: computed(function() {
    return true;
  }).readOnly(),

  label: computed('property', function() {
    const property = defaultFor(this.get('property'), '');

    return humanize(property);
  }),

  propertyWithModel: computed('property', 'modelPath', function() {
    const { modelPath, property } = this.getProperties(
      [ 'modelPath', 'property' ]
    );

    if (modelPath) {
      return `${modelPath}.${property}`;
    } else {
      return property;
    }
  }),

  type: computed('content', 'property', 'value', function() {
    const property = this.get('property');

    let type = 'text';

    if (this.get('content')) {
      type = 'select';
    } else if (property.match(/password/)) {
      type = 'password';
    } else if (property.match(/email/)) {
      type = 'email';
    } else if (property.match(/url/)) {
      type = 'url';
    } else if (property.match(/color/)) {
      type = 'color';
    } else if (property.match(/^tel/) || property.match(/^phone/)) {
      type = 'tel';
    } else if (property.match(/search/)) {
      type = 'search';
    } else {
      const value = this.get('value');

      if (typeOf(value) === 'number') {
        type = 'number';
      } else if (typeOf(value) === 'date') {
        type = 'date';
      } else if (typeOf(value) === 'boolean') {
        type = 'checkbox';
      }
    }

    return type;
  }),

  validityClass: computed('isValid',
    function() {
      const className = this.get('className');

      let modifier;

      if (this.get('isValid')) {
        modifier = 'valid';
      } else {
        modifier = 'error';
      }
      return `${className}-${modifier}`;
    }
  ),

  focusOut: function() {
    this.send('showError');
    return true;
  },

  /* Actions */

  actions: {

    //Issue from here: https://github.com/sir-dunxalot/ember-easy-form-extensions/issues/41
    showError: function showError() {
      if (!this.get('isDestroying')) {
        this.set('showError', true);
      }
    },

    setGroupAsInvalid: function setGroupAsInvalid() {
      if (!this.get('isDestroying')) {
        this.set('isValid', false);
      }
    },

    setGroupAsValid: function setGroupAsValid() {
      if (!this.get('isDestroying')) {
        this.set('isValid', true);
      }
    }
  },

  /* Public methods - avoid xBinding syntax */

  listenForNewlyValid: observer('isValid', function() {
    if (this.get('isValid')) {
      this.set('isNewlyValid', true);
    }

    run.later(this, function() {
      if (!this.get('isDestroying')) {
        this.set('isNewlyValid', false);
      }
    }, this.get('newlyValidDuration'));
  }),

  setBindingForValue: on('init', function() {
    Ember.assert('You must set a property attribute on the {{input-group}} component', this.get('property'));
  }),

  setFormControls: on('init', function() {
    this.set('formControls', this.nearestWithProperty('isFormControls'));
    const propertyWithModel = this.get('propertyWithModel');
    const binding = Ember.computed.alias(`formController.${propertyWithModel}`)
    this.set('value', binding);

    this.set('bindingForValue', binding);
  }),

  /* Private methods */

  _registerWithFormController: on('init', function() {
    this.sendAction('registerAction', this);
  }),

  _unregisterWithFormController: on('willDestroyElement', function() {
    this.sendAction('unregisterAction', this);
  }),

});
