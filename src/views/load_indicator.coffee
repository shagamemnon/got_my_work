define [ 'backbone' ], ->
  LoaderView = Backbone.View.extend
    initialize: ->
      loadDiv = $ '.load-indicator'

      if loadDiv.length == 0
        loadDiv = $ '<div class="load-indicator">'
        $( 'body' ).prepend loadDiv

      @$el = loadDiv

    start: ->
      @$el.removeClass 'full-load fade-out'
      @$el.addClass 'third-load'

    end: ->
      @$el.addClass 'full-load fade-out'
      @$el.removeClass 'third-load'

  window.loader = new LoaderView( )
