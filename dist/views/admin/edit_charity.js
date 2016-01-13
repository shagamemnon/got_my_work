(function() {
  define(['text!templates/admin/edit_charity.html', 'parse', 'backbone'], function(template) {
    return Backbone.View.extend({
      name: 'Charity Editor',
      className: 'admin-edit-charity',
      tagName: 'main',
      mode: new Backbone.Model,
      initialize: function() {
        var dat;
        dat = this;
        return this.model.on('change:charities', function() {
          if (!!dat.charity_id) {
            dat.edit(dat.charity_id);
          }
          return dat.render();
        });
      },
      events: {
        'submit form': 'submit',
        'click .js-delete-charity': 'deleteCharity'
      },
      setModelAttributes: function() {
        this.charity.set('name', $('input[name="charity[name]"]').val());
        return this.charity.set('logo', $('input[name="charity[logo]"]').val());
      },
      submit: function(e) {
        var dat, isNewCharity;
        e.preventDefault();
        isNewCharity = !this.charity.id;
        this.setModelAttributes();
        dat = this;
        window.loader.start();
        return this.charity.save(null, {
          success: function(charity) {
            console.log('New object created with objectId: ' + charity.id);
            if (isNewCharity) {
              dat.model.get('charities').push(charity);
              Backbone.history.navigate('charities/' + charity.id + '/edit');
              dat.render();
            } else {
              dat.model.trigger('change:charities');
            }
            return window.loader.end();
          },
          error: function(charity, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
            return window.loader.end();
          }
        });
      },
      deleteCharity: function() {
        var dat;
        if (confirm("Are you sure you want to DELETE")) {
          if (!this.charity.id) {
            return console.error('@deleteCharity requires @charity.id');
          } else {
            window.loader.start();
            dat = this;
            return this.charity.destroy({
              success: function(charity) {
                var charity_index;
                console.log('Successfully deleted Object with id ' + charity.id);
                charity_index = null;
                _.each(dat.model.get('charities'), function(saved_charity, index) {
                  if (saved_charity.id === charity.id) {
                    return charity_index = index;
                  }
                });
                dat.model.get('charities').splice(charity_index, 1);
                Backbone.history.navigate('#/');
                return window.loader.end();
              },
              error: function(charity, error) {
                console.error("Error: " + error.code + " " + error.message);
                return window.loader.end();
              }
            });
          }
        }
      },
      initCharity: function() {
        var Charity;
        if (!this.newCharity) {
          Charity = Parse.Object.extend("Charity");
          this.newCharity = new Charity();
          this.newCharity.setACL(this.model.get('modelACL'));
        }
        return this.charity = this.newCharity;
      },
      edit: function(id) {
        var dat;
        this.charity_id = id;
        if (id === null) {
          return this.initCharity();
        } else {
          dat = this;
          return _.each(this.model.get('charities'), function(charity) {
            if (charity.id === id) {
              return dat.charity = charity;
            }
          });
        }
      },
      render: function() {
        if (!!this.charity) {
          if (!this.charity.id) {
            this.initCharity();
          }
          this.$el.html(_.template(template)({
            charity: this.charity
          }));
        }
        return this;
      }
    });
  });

}).call(this);
