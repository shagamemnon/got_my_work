(function() {
  define(['text!templates/settings/editor_panels/nonprofit/4.html', 'backbone'], function(template) {
    return Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(template)());
        return this;
      }
    });
  });

}).call(this);
