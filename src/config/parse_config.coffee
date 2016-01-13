define ['config/api_keys', 'parse'], ( api_keys ) ->
  Parse.initialize( api_keys.parse_appId, api_keys.parse_JSKey )
