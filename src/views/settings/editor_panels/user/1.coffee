define [
  'text!templates/settings/editor_panels/user/1.html',
  'backbone'
  ], ( template ) ->
  Backbone.View.extend
    render: ->
      @$el.html _.template( template )()
      @
