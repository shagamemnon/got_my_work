define [ 'parse', 'backbone' ], ->
  Backbone.View.extend
    initialize: ->
      console.log 'init signin'

    events:
      'click .js-facebook-signin': 'facebookSigin'
      'submit .js-signup': 'signUp'

    facebookSigin: ->
      console.log 'facebook'
      Parse.FacebookUtils.logIn( null,
        success: (user) ->
          window.location = '/'
        error: (user, error) ->
          alert("Error: " + error.code + " " + error.message)
      )

    signUp: (e) ->
      e.preventDefault( )

      firstname = $('.js-signup input[name="first-name"]').val( )
      email = $('.js-signup input[name="email"]').val( )
      password = $('.js-signup input[name="password"]').val( )

      user = new Parse.User()

      user.set("username", firstname );
      user.set("email", email);
      user.set("password", password);

      user.signUp( null,
        success: ( user ) ->
          window.location = '/'
        error: ( user, error ) ->
          alert("Error: " + error.code + " " + error.message)
      )

