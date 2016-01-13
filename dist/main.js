(function() {
  require(['config/require_config'], function() {
    return require(['config/api_keys', 'config/parse_config', 'jquery'], function(api_keys) {
      var rel_path;
      window.$ = $;
      rel_path = 'paths/' + window.location.pathname.replace(/\d+/g, ':id').replace(/^\//g, '').replace(/\/$/g, '').replace(/\?.*$/g, '');
      if (rel_path === 'paths/') {
        rel_path = 'paths/login';
      }
      return require([rel_path]);
    });
  });

}).call(this);
