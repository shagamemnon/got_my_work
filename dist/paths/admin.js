(function() {
  define(['routers/admin', 'backbone'], function(AdminRouter) {
    var Admin, query;
    if (!Parse.User.current) {
      return window.location = '/';
    } else {
      Admin = Parse.Object.extend('Admin');
      query = new Parse.Query(Admin);
      return query.find({
        success: function(admins) {
          var accessGranted, current_user;
          accessGranted = false;
          current_user = Parse.User.current();
          _.each(admins, function(admin) {
            if (admin.get('user').id === current_user.id && !accessGranted) {
              accessGranted = true;
              new AdminRouter({
                admins: admins
              });
              return Backbone.history.start();
            }
          });
          if (!accessGranted) {
            throw 'Admin Access Only';
          }
        },
        error: function(error) {
          return console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  });

}).call(this);
