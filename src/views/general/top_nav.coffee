define [
  'backbone'
  ], ->
  Backbone.View.extend
    events:
      'click .menu-icon': 'toggleExpand'

    toggleExpand: ->
      @$el.toggleClass 'expand'
