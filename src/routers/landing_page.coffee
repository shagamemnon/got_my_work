define [
  'views/landing_page/main',
  'famous/core/FamousEngine',
  'backbone'
  ], ( LandingPageView, FamousEngine ) ->
    Backbone.Router.extend
      initialize: ->
        FamousEngine.init()
        @landingPage = new LandingPageView( el: $('.content')[0] )
        @landingPage.render()

      routes:
        'contact': 'contact'

      contact: ->
        @landingPage.pageNavigate('cents-contact')
