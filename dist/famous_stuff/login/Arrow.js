(function() {
  define(['famous/dom-renderables/DOMElement', 'famous/core/Node'], function(DOMElement, Node) {
    var Arrow;
    Arrow = function(options) {
      Node.call(this);
      this.el = new DOMElement(this);
      this.el.setProperty('color', 'white');
      this.el.addClass('demo-arrow');
      this.direction = options.direction;
      this.el.setProperty('zIndex', '3');
      this.el.setProperty('background-repeat', 'no-repeat');
      this.el.setProperty('background-size', 'cover');
      if (this.direction === 1) {
        this.el.setProperty('backgroundImage', 'url( https://s3.amazonaws.com/mycents/photos/landing_page/ios_demo/next.png )');
      } else {
        this.el.setProperty('backgroundImage', 'url( https://s3.amazonaws.com/mycents/photos/landing_page/ios_demo/back.png )');
      }
      return this.addUIEvent('click');
    };
    Arrow.prototype = Object.create(Node.prototype);
    Arrow.prototype.constructor = Arrow;
    return Arrow;
  });

}).call(this);
