(function() {
  define(['views/signin'], function(SiginView) {
    if (Parse.User.current) {
      return window.location = '/';
    }
    return new SiginView({
      el: $('.registration-page')[0]
    });
  });

}).call(this);
