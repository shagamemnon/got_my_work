define [
  'text!templates/settings/editable_select.html',
  'backbone'
  ], ( template ) ->
  Backbone.View.extend
    className: 'editable'

    initialize: ( options ) ->
      unless @model
        console.error 'selector created without model'
        @error = true

    events:
      'click': 'triggerClick'

    triggerClick: ->
      @trigger 'click'

    render: ->
      if @error
        return @

      if @model.className == "_User"
        renderAttrs = {
          avatar: @model.get( 'avatar' ),
          displayName: @model.get( 'username' )
        }
      else
        renderAttrs = {
          avatar: @model.get( 'logo' ),
          displayName: @model.get( 'name' )
        }

      @$el.html _.template( template )( renderAttrs )
      @
