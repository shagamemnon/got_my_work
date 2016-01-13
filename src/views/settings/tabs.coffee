define [
  'text!templates/settings/tabs_nonprofit.html',
  'text!templates/settings/tabs_user.html',
  'backbone'
  ], ( NonProfitTemplate, UserTemplate ) ->
  Backbone.View.extend
    initialize: ->
      @$nonprofitTabs = _.template( NonProfitTemplate )()
      @$userTabs = _.template( UserTemplate )()
      dat = @
      @model.on 'change:editable', ->
        dat.render()

    events:
      'click .tab': 'changeTabIndex'

    changeTabIndex: (e) ->
      @model.set 'tabIndex', $(e.target).data('id')

    render: ->
      if @model.get( 'editable' ) == 0
        @$el.html @$userTabs
      else
        @$el.html @$nonprofitTabs
      @
