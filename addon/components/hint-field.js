import Ember from 'ember';

export default Ember.Component.extend({
  className: ['hint'],
  classNameBindings: ['className'],
  tagName: 'span',
  text: null,
});
