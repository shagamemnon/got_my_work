(function() {
  define(['config/api_keys', 'parse'], function(api_keys) {
    return Parse.initialize(api_keys.parse_appId, api_keys.parse_JSKey);
  });

}).call(this);
