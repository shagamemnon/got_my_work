(function() {
  define(['routers/settings', 'backbone'], function(SettingsRouter) {
    new SettingsRouter;
    return Backbone.history.start();
  });

}).call(this);
