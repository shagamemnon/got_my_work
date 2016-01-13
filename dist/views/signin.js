(function() {
  define(['parse', 'backbone'], function() {
    return Backbone.View.extend({
      initialize: function() {
        return console.log('init signin');
      },
      events: {
        'click .js-facebook-signin': 'facebookSigin',
        'submit .js-signup': 'signUp'
      },
      facebookSigin: function() {
        console.log('facebook');
        return Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            return window.location = '/';
          },
          error: function(user, error) {
            return alert("Error: " + error.code + " " + error.message);
          }
        });
      },
      signUp: function(e) {
        var email, firstname, password, user;
        e.preventDefault();
        firstname = $('.js-signup input[name="first-name"]').val();
        email = $('.js-signup input[name="email"]').val();
        password = $('.js-signup input[name="password"]').val();
        user = new Parse.User();
        user.set("username", firstname);
        user.set("email", email);
        user.set("password", password);
        return user.signUp(null, {
          success: function(user) {
            return window.location = '/';
          },
          error: function(user, error) {
            return alert("Error: " + error.code + " " + error.message);
          }
        });
      }
    });
  });

}).call(this);
