(function() {
  define(['views/settings/editable_select', 'backbone'], function(EditableSelect) {
    return Backbone.View.extend({
      state: new Backbone.Model({
        expanded: false
      }),
      firstRender: true,
      initialize: function(options) {
        var dat;
        this.editableSelectViews = [];
        this.editableSelectViews.push(new EditableSelect({
          model: Parse.User.current()
        }));
        _.each(options.nonprofits, (function(_this) {
          return function(nonprofit) {
            return _this.editableSelectViews.push(new EditableSelect({
              model: nonprofit
            }));
          };
        })(this));
        dat = this;
        return _.each(this.editableSelectViews, function(editable, index) {
          return editable.on('click', function() {
            if (dat.state.get('expanded')) {
              dat.toggleExpand();
              return dat.model.set('editable', index);
            }
          });
        });
      },
      events: {
        'click .arrow': 'toggleExpand'
      },
      toggleExpand: function() {
        this.state.set('expanded', !this.state.get('expanded'));
        return this.$el.toggleClass('expanded');
      },
      render: function() {
        var $editables, dat;
        dat = this;
        $editables = this.$el.find('.editables');
        if (this.firstRender) {
          this.firstRender = false;
          return _.each(this.editableSelectViews, function(editable, index) {
            $editables.append(editable.render().$el);
            if (index === dat.model.get('editable')) {
              return editable.$el.addClass('selected');
            }
          });
        } else {
          return _.each(this.editableSelectViews, function(editable, index) {
            if (index === dat.model.get('editable')) {
              return editable.$el.addClass('selected');
            } else {
              return editable.$el.removeClass('selected');
            }
          });
        }
      }
    });
  });

}).call(this);
