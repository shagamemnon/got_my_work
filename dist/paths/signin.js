(function() {
  define(['views/signin'], function(SiginView) {
    if (Parse.User.current) {
      return window.location = '/settings';
    }
    return new SiginView({
      el: $('.registration-page')[0]
    });
  });

}).call(this);
