(function() {
  define(['views/general/top_nav'], function(TopNavView) {
    return new TopNavView({
      el: $('.top-nav')[0]
    });
  });

}).call(this);
