(function() {
  define(['jquery'], function() {
    return $.fn.serializeObject = function() {
      var a, o;
      o = {};
      a = this.serializeArray();
      $.each(a, function() {
        if (o[this.name] !== void 0) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          return o[this.name].push(this.value || '');
        } else {
          return o[this.name] = this.value || '';
        }
      });
      return o;
    };
  });

}).call(this);
