require ['config/require_config'], ->
  require [ 'config/api_keys', 'config/parse_config', 'jquery'], ( api_keys ) ->
    window.$ = $
    rel_path = 'paths/' + window.location.pathname.replace(/\d+/g, ':id').replace(/^\//g,'').replace(/\/$/g, '').replace(/\?.*$/g, '')
    if rel_path == 'paths/'
      rel_path = 'paths/login'
    require [rel_path]
