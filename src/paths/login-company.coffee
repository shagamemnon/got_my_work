define ['views/signin', ], (SiginView) ->
  if Parse.User.current
    return window.location = '/'
  new SiginView( el: $('.registration-page')[0] )
