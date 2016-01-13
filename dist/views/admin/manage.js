(function() {
  define(['text!templates/admin/manage.html', 'parse', 'backbone'], function(template) {
    return Backbone.View.extend({
      name: 'Admin Manager',
      className: 'admin-edit-admin',
      tagName: 'main',
      initialize: function() {},
      events: {
        'click .remove-admin': 'removeAdmin',
        'submit .add-admin': 'addAdmin'
      },
      render: function() {
        this.$el.html(_.template(template)());
        return this;
      }
    });
  });

}).call(this);
