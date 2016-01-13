(function() {
  define(['views/general/top_nav', 'views/settings/editable_selector', 'views/settings/tabs', 'views/settings/editor', 'backbone'], function(TopNav, EditableSelector, Tabs, Editor) {
    return Backbone.Router.extend({
      NP_ROLE_NAME: /NP_[Aa][Dd][Mm][Ii][Nn]_[A-Za-z0-9]+/,
      ROOT_EL: $('.content'),
      firstRenderCall: true,
      firstRender: true,
      state: new Backbone.Model({
        editable: 0,
        tabIndex: 0
      }),
      NP_Roles: [],
      nonprofits: [],
      initialize: function() {
        this.loadRoles();
        return this.state.on('change:editable', (function(_this) {
          return function() {
            _this.state.set('tabIndex', 0);
            return _this.render();
          };
        })(this));
      },
      loadRoles: function() {
        var dat, query;
        query = new Parse.Query(Parse.Role);
        query.equalTo("users", Parse.User.current());
        dat = this;
        return query.find({
          success: function(roles) {
            _.each(roles, function(role) {
              if (role.get('name').match(dat.NP_ROLE_NAME)) {
                return dat.NP_Roles.push(role);
              }
            });
            if (dat.NP_Roles.length > 0) {
              return dat.fetchNonProfits();
            } else {
              return dat.promptRender();
            }
          },
          error: function() {
            return console.log('fail');
          }
        });
      },
      fetchNonProfits: function() {
        var dat;
        dat = this;
        return _.each(this.NP_Roles, function(role) {
          var Charity, nonprofitId, query, roleName;
          roleName = role.get('name');
          nonprofitId = roleName.match(/[A-Za-z0-9]+/g)[2];
          Charity = Parse.Object.extend('Charity');
          query = new Parse.Query(Charity);
          return query.get(nonprofitId, {
            success: function(charity) {
              dat.nonprofits.push(charity);
              if (dat.nonprofits.length === dat.NP_Roles.length) {
                return dat.promptRender();
              }
            },
            error: function() {
              return console.error('nonprofit load error');
            }
          });
        });
      },
      routes: {
        'user': 'setUser',
        'nonprofit': 'setNP',
        '*default': 'setNone'
      },
      setNone: function() {
        return this.promptRender();
      },
      setUser: function() {
        this.state.set('editable', 0);
        return this.promptRender();
      },
      setNP: function() {
        this.state.set('editable', 1);
        return this.promptRender();
      },
      promptRender: function() {
        if (this.firstRenderCall) {
          return this.firstRenderCall = false;
        } else {
          return this.render();
        }
      },
      render: function() {
        if (this.firstRender) {
          this.firstRender = false;
          new TopNav({
            el: $('.top-nav')[0]
          });
          this.EditableSelector = new EditableSelector({
            el: $('.editable-selector'),
            model: this.state,
            nonprofits: this.nonprofits
          });
          this.EditableSelector.render();
          this.Tabs = new Tabs({
            el: $('.tabs'),
            model: this.state
          });
          this.Tabs.render();
          this.Editor = new Editor({
            el: $('.editor'),
            model: this.state
          });
          return this.Editor.render();
        } else {
          this.EditableSelector.render();
          this.Tabs.render();
          return this.Editor.render();
        }
      }
    });
  });

}).call(this);
