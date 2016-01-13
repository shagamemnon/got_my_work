(function() {
  define(['text!templates/settings/editable_select.html', 'backbone'], function(template) {
    return Backbone.View.extend({
      className: 'editable',
      initialize: function(options) {
        if (!this.model) {
          console.error('selector created without model');
          return this.error = true;
        }
      },
      events: {
        'click': 'triggerClick'
      },
      triggerClick: function() {
        return this.trigger('click');
      },
      render: function() {
        var renderAttrs;
        if (this.error) {
          return this;
        }
        if (this.model.className === "_User") {
          renderAttrs = {
            avatar: this.model.get('avatar'),
            displayName: this.model.get('username')
          };
        } else {
          renderAttrs = {
            avatar: this.model.get('logo'),
            displayName: this.model.get('name')
          };
        }
        this.$el.html(_.template(template)(renderAttrs));
        return this;
      }
    });
  });

}).call(this);
