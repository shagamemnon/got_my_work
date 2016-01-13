(function() {
  define(['text!templates/settings/tabs_nonprofit.html', 'text!templates/settings/tabs_user.html', 'backbone'], function(NonProfitTemplate, UserTemplate) {
    return Backbone.View.extend({
      initialize: function() {
        var dat;
        this.$nonprofitTabs = _.template(NonProfitTemplate)();
        this.$userTabs = _.template(UserTemplate)();
        dat = this;
        return this.model.on('change:editable', function() {
          return dat.render();
        });
      },
      events: {
        'click .tab': 'changeTabIndex'
      },
      changeTabIndex: function(e) {
        return this.model.set('tabIndex', $(e.target).data('id'));
      },
      render: function() {
        if (this.model.get('editable') === 0) {
          this.$el.html(this.$userTabs);
        } else {
          this.$el.html(this.$nonprofitTabs);
        }
        return this;
      }
    });
  });

}).call(this);
