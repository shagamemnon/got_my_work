(function() {
  require.config({
    paths: {
      text: '../vendor/text',
      backbone: '../node_modules/backbone/backbone',
      underscore: '../node_modules/underscore/underscore',
      jquery: '../node_modules/jquery/dist/jquery.min',
      parse: '../vendor/parse.min',
      famous: '../node_modules/famous'
    },
    shim: {
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      underscore: {
        exports: '_'
      },
      jquery: {
        exports: '$'
      },
      parse: {
        exports: 'Parse'
      }
    }
  });

}).call(this);
