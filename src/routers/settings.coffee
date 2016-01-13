define [
  'views/general/top_nav',
  'views/settings/editable_selector',
  'views/settings/tabs',
  'views/settings/editor',
  'backbone'
  ], ( TopNav, EditableSelector, Tabs, Editor ) ->
    Backbone.Router.extend
      NP_ROLE_NAME: /NP_[Aa][Dd][Mm][Ii][Nn]_[A-Za-z0-9]+/
      ROOT_EL: $ '.content'
      firstRenderCall: true
      firstRender: true
      state: new Backbone.Model { editable: 0, tabIndex: 0 }
      NP_Roles: []
      nonprofits: []

      initialize: ->
        @loadRoles( )
        @state.on 'change:editable', =>
          @state.set 'tabIndex', 0
          @render()

      loadRoles: ->
        query = new Parse.Query Parse.Role
        query.equalTo "users", Parse.User.current()
        dat = @
        query.find
          success: ( roles ) ->
            _.each roles, ( role ) ->
              if role.get( 'name' ).match dat.NP_ROLE_NAME
                dat.NP_Roles.push role
            if dat.NP_Roles.length > 0
              dat.fetchNonProfits()
            else
              dat.promptRender()
          error: () ->
            console.log 'fail'

      fetchNonProfits: ->
        dat = @
        _.each @NP_Roles, ( role ) ->
          roleName = role.get( 'name' )
          nonprofitId = roleName.match(/[A-Za-z0-9]+/g)[2]

          Charity = Parse.Object.extend 'Charity'
          query = new Parse.Query Charity
          query.get nonprofitId,
            success: ( charity ) ->
              dat.nonprofits.push charity
              if dat.nonprofits.length == dat.NP_Roles.length
                dat.promptRender()
            error: () ->
              console.error 'nonprofit load error'

      routes:
        'user': 'setUser'
        'nonprofit': 'setNP'
        '*default': 'setNone'

      setNone: ->
        @promptRender()

      setUser: ->
        @state.set( 'editable', 0 )
        @promptRender()

      setNP: ->
        @state.set( 'editable', 1 )
        @promptRender()

      promptRender: ->
        if @firstRenderCall
          @firstRenderCall = false
        else
          @render()

      render: ->
        if @firstRender
          @firstRender = false
          new TopNav( el: $( '.top-nav')[0] )
          @EditableSelector = new EditableSelector( el: $( '.editable-selector' ), model: @state, nonprofits: @nonprofits )
          @EditableSelector.render()
          @Tabs = new Tabs( el: $( '.tabs' ), model: @state )
          @Tabs.render()
          @Editor = new Editor( el: $( '.editor' ), model: @state )
          @Editor.render()

        else
          @EditableSelector.render()
          @Tabs.render()
          @Editor.render()
