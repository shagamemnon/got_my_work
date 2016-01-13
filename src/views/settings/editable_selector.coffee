define [
  'views/settings/editable_select',
  'backbone'
  ], ( EditableSelect ) ->
  Backbone.View.extend
    state: new Backbone.Model { expanded: false }
    firstRender: true

    initialize: ( options ) ->
      @editableSelectViews = []
      @editableSelectViews.push new EditableSelect { model: Parse.User.current() }
      _.each options.nonprofits, ( nonprofit ) =>
        @editableSelectViews.push new EditableSelect { model: nonprofit }

      dat = @
      _.each @editableSelectViews, (editable, index) ->
        editable.on 'click', ->
          if dat.state.get 'expanded'
            dat.toggleExpand()
            dat.model.set 'editable', index

    events:
      'click .arrow': 'toggleExpand'

    toggleExpand: ->
      @state.set 'expanded', !@state.get( 'expanded' )
      @$el.toggleClass 'expanded'

    render: ->
      dat = @
      $editables = @$el.find '.editables'

      if @firstRender
        @firstRender = false
        _.each @editableSelectViews, ( editable, index ) ->
          $editables.append editable.render().$el
          if index == dat.model.get 'editable'
            editable.$el.addClass 'selected'

      else
        _.each @editableSelectViews, ( editable, index ) ->
          if index == dat.model.get 'editable'
            editable.$el.addClass 'selected'
          else
            editable.$el.removeClass 'selected'



