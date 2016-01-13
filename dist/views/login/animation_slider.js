(function() {
  define(['backbone'], function() {
    return Backbone.View.extend({
      isOffScreen: true,
      checkScroll: function(bottomWindowPositionY) {
        if (bottomWindowPositionY < (this.$el.offset().top + 300) && !this.isOffScreen) {
          this.isOffScreen = true;
          return this.$el.addClass('off-screen');
        } else if (bottomWindowPositionY >= (this.$el.offset().top + 300) && this.isOffScreen) {
          this.isOffScreen = false;
          return this.$el.removeClass('off-screen');
        }
      }
    });
  });

}).call(this);
