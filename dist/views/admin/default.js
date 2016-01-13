(function() {
  define(['text!templates/admin/default_admin.html', 'parse', 'backbone'], function(template) {
    return Backbone.View.extend({
      name: 'Admin Panel',
      className: 'admin-default',
      tagName: 'main',
      initialize: function(options) {
        var dat;
        dat = this;
        this.model.on('change:charities', function() {
          return dat.render();
        });
        return this.model.on('change:projects', function() {
          return dat.render();
        });
      },
      events: {
        'click .js-edit-charity': 'editCharity',
        'click .js-edit-project': 'editProject'
      },
      editCharity: function() {
        var charity_id;
        charity_id = this.$el.find('select[name="charity[id]"]').val();
        return Backbone.history.navigate('#/charities/' + charity_id + '/edit');
      },
      editProject: function() {
        var project_id;
        project_id = this.$el.find('select[name="project[id]"]').val();
        return Backbone.history.navigate('#/projects/' + project_id + '/edit');
      },
      render: function() {
        this.$el.html(_.template(template)({
          charities: this.model.get('charities'),
          projects: this.model.get('projects')
        }));
        return this;
      }
    });
  });

}).call(this);
