(function() {
  define(['backbone'], function() {
    var LoaderView;
    LoaderView = Backbone.View.extend({
      initialize: function() {
        var loadDiv;
        loadDiv = $('.load-indicator');
        if (loadDiv.length === 0) {
          loadDiv = $('<div class="load-indicator">');
          $('body').prepend(loadDiv);
        }
        return this.$el = loadDiv;
      },
      start: function() {
        this.$el.removeClass('full-load fade-out');
        return this.$el.addClass('third-load');
      },
      end: function() {
        this.$el.addClass('full-load fade-out');
        return this.$el.removeClass('third-load');
      }
    });
    return window.loader = new LoaderView();
  });

}).call(this);
