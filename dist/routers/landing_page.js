(function() {
  define(['views/landing_page/main', 'famous/core/FamousEngine', 'backbone'], function(LandingPageView, FamousEngine) {
    return Backbone.Router.extend({
      initialize: function() {
        FamousEngine.init();
        this.landingPage = new LandingPageView({
          el: $('.content')[0]
        });
        return this.landingPage.render();
      },
      routes: {
        'contact': 'contact'
      },
      contact: function() {
        return this.landingPage.pageNavigate('cents-contact');
      }
    });
  });

}).call(this);
