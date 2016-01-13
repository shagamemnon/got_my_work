define ['routers/admin', 'backbone'], ( AdminRouter ) ->
  unless Parse.User.current
    return window.location = '/'
  else
    Admin = Parse.Object.extend('Admin')
    query = new Parse.Query(Admin)
    query.find
      success: ( admins ) ->
        accessGranted = false
        current_user = Parse.User.current( )
        _.each admins, ( admin ) ->
          if admin.get( 'user' ).id == current_user.id && !accessGranted
            accessGranted = true
            new AdminRouter( admins: admins )
            Backbone.history.start( )

        unless accessGranted
          throw 'Admin Access Only'

      error: (error) ->
        console.log("Error: " + error.code + " " + error.message);
