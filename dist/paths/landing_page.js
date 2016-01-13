(function() {
  define(['routers/landing_page', 'backbone'], function(LandingPageRouter) {
    new LandingPageRouter;
    return Backbone.history.start();
  });

}).call(this);
