(function() {
  define(['backbone'], function() {
    return Backbone.View.extend({
      events: {
        'click .menu-icon': 'toggleExpand'
      },
      toggleExpand: function() {
        return this.$el.toggleClass('expand');
      }
    });
  });

}).call(this);
