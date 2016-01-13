(function() {
  define(['views/admin/default', 'views/admin/manage', 'views/admin/edit_charity', 'views/admin/edit_project', 'backbone'], function(DefaultAdminView, ManageAdminView, EditCharityView, EditProjectView) {
    return Backbone.Router.extend({
      views: {},
      models: new Backbone.Model,
      initialize: function(options) {
        $('head').append($('<link rel="stylesheet", href="dist/css/main.css">'));
        this.mapAdmins(options.admins);
        this.queryCharities();
        return this.queryProjects();
      },
      mapAdmins: function(adminModels) {
        var adminUsers, modelACL;
        adminUsers = _.map(adminModels, function(admin) {
          return admin.get('user');
        });
        this.models.set('admins', adminUsers);
        modelACL = new Parse.ACL;
        modelACL.setPublicReadAccess(true);
        _.each(adminUsers, function(admin) {
          return modelACL.setWriteAccess(admin, true);
        });
        return this.models.set('modelACL', modelACL);
      },
      queryCharities: function() {
        var Charity, dat, query;
        dat = this;
        Charity = Parse.Object.extend('Charity');
        query = new Parse.Query(Charity);
        return query.find({
          success: function(charities) {
            return dat.models.set('charities', charities);
          },
          error: function(error) {
            return alert("Error: " + error.code + " " + error.message);
          }
        });
      },
      queryProjects: function() {
        var Project, dat, query;
        dat = this;
        Project = Parse.Object.extend('Project');
        query = new Parse.Query(Project);
        return query.find({
          success: function(projects) {
            dat.models.set('projects', projects);
            return window.projects = projects;
          },
          error: function(error) {
            return console.error("Error: " + error.code + " " + error.message);
          }
        });
      },
      routes: {
        'manage': 'manageAdmins',
        'charities/new': 'editCharity',
        'charities/:id/edit': 'editCharity',
        'projects/new': 'editProject',
        'projects/:id/edit': 'editProject',
        '*default': 'default'
      },
      setView: function(name, View) {
        var dat, _base;
        (_base = this.views)[name] || (_base[name] = new View({
          model: this.models
        }));
        this.views[name].render();
        $('.content').html(this.views[name].$el);
        dat = this;
        _.each(this.views, function(value, key) {
          if (key !== name) {
            return dat.views[key].undelegateEvents();
          }
        });
        this.views[name].delegateEvents();
        return $('title').html(this.views[name].name);
      },
      "default": function() {
        return this.setView('default', DefaultAdminView);
      },
      editCharity: function(id) {
        this.setView('editCharity', EditCharityView);
        this.views['editCharity'].edit(id);
        return this.views['editCharity'].render();
      },
      editProject: function(id) {
        this.setView('editProject', EditProjectView);
        this.views['editProject'].edit(id);
        return this.views['editProject'].render();
      },
      manageAdmins: function() {
        return this.setView('manageAdmins', ManageAdminView);
      }
    });
  });

}).call(this);
