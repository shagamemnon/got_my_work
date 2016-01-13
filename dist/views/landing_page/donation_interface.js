(function() {
  define(['backbone'], function() {
    return Backbone.View.extend({
      initialize: function() {
        return this.interfacePreviews = this.$el.find('.interface-previews');
      },
      events: {
        'click .preview': 'swapPreview'
      },
      swapPreview: function(e) {
        var focus;
        focus = $(e.target).closest('.preview').data('focus');
        this.interfacePreviews.removeClass('focus-1 focus-2 focus-3');
        return this.interfacePreviews.addClass('focus-' + focus);
      }
    });
  });

}).call(this);
