(function() {
  define(['views/settings/editor_panels/user/0', 'views/settings/editor_panels/user/1', 'views/settings/editor_panels/user/2', 'views/settings/editor_panels/user/3', 'views/settings/editor_panels/user/4', 'views/settings/editor_panels/user/5', 'views/settings/editor_panels/nonprofit/0', 'views/settings/editor_panels/nonprofit/1', 'views/settings/editor_panels/nonprofit/2', 'views/settings/editor_panels/nonprofit/3', 'views/settings/editor_panels/nonprofit/4', 'views/settings/editor_panels/nonprofit/5', 'backbone'], function(UPanel0, UPanel1, UPanel2, UPanel3, UPanel4, UPanel5, NPPanel0, NPPanel1, NPPanel2, NPPanel3, NPPanel4, NPPanel5) {
    return Backbone.View.extend({
      initialize: function() {
        var dat, nonprofitPanels, userPanels;
        dat = this;
        userPanels = [new UPanel0, new UPanel1, new UPanel2, new UPanel3, new UPanel4, new UPanel5];
        nonprofitPanels = [new NPPanel0, new NPPanel1, new NPPanel2, new NPPanel3, new NPPanel4, new NPPanel5];
        this.panels = [userPanels, nonprofitPanels];
        return this.model.on('change', function() {
          return dat.render();
        });
      },
      render: function() {
        this.$el.html(this.panels[this.model.get('editable')][this.model.get('tabIndex')].render().$el);
        return this;
      }
    });
  });

}).call(this);
