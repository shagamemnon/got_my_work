define ['jquery'], ->
  $.fn.serializeObject = ->
    o = {}
    a = @serializeArray()
    $.each a, ->
      if o[@name] != undefined
        if !o[@name].push
          o[@name] = [o[@name]];

        o[@name].push(@value || '')
      else
        o[@name] = @value || ''
    return o
