(function() {
  define([], function() {
    if (!!window.location.host.match('localhost')) {
      return {
        parse_appId: "isu8vhkTR6gKAPHk8wajNmZ9E2Y67BqKVtDnSeor",
        parse_JSKey: "2zvNMtmrlKG7u3zsqiPsrnF53Ay24hQkPyUcqdK7"
      };
    } else {
      return {
        parse_appId: "ZowTKUYLhAaotnClMdlMrrPnG0xiQVHPWnHWuAf3",
        parse_JSKey: "n3U6xyK4bcJ1O9WPDh1rcADiY7C84UeRyebo0969"
      };
    }
  });

}).call(this);
