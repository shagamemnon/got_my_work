(function() {
  define(['famous/dom-renderables/DOMElement', 'famous/physics/PhysicsEngine', 'famous/core/FamousEngine', 'famous/physics/index', 'famous/math/index'], function(DOMElement, PhysicsEngine, FamousEngine, physics, math) {
    var Box, Pager, Quaternion, RotationalDrag, RotationalSpring, Spring, Vec3, _createPages;
    Box = physics.Box;
    Spring = physics.Spring;
    RotationalSpring = physics.RotationalSpring;
    RotationalDrag = physics.RotationalDrag;
    Quaternion = math.Quaternion;
    Vec3 = math.Vec3;
    Pager = function(node, options) {
      var resizeComponent;
      this.node = node;
      this.carousel = options.carousel;
      this.currentIndex = 1;
      this.pageWidth = 0;
      resizeComponent = {
        onSizeChange: (function(_this) {
          return function(x, y, z) {
            return _this.defineWidth(x);
          };
        })(this)
      };
      this.node.addComponent(resizeComponent);
      this.simulation = new PhysicsEngine();
      FamousEngine.requestUpdate(this);
      this.pages = _createPages.call(this, node, options.pageData);
      return this;
    };
    _createPages = function(root, pageData) {
      var anchor, box, el, i, imageNode, pages, quaternion, rotationalSpring, spring, _i;
      pages = [];
      for (i = _i = 0; _i < 3; i = ++_i) {
        imageNode = root.addChild();
        imageNode.setSizeMode(1, 1, 1);
        imageNode.setAbsoluteSize(360, 640, 0);
        imageNode.setAlign(0.5, 0.5);
        imageNode.setMountPoint(0.5, 0.5);
        imageNode.setOrigin(0.5, 0.5);
        el = imageNode.el = new DOMElement(imageNode);
        el.addClass('cents-image-node');
        el.setProperty('backgroundImage', 'url(' + pageData[i] + ')');
        el.setProperty('background-repeat', 'no-repeat');
        el.setProperty('background-size', 'cover');
        el.setContent('<div class="dropshadow-glass"></div>');
        box = new Box({
          mass: 100,
          size: [100, 100, 100]
        });
        anchor = i === 1 ? new Vec3(0, 0, 1) : new Vec3(0.22, 0, 0.85);
        if (i === 0) {
          anchor = new Vec3(-0.22, 0, 0.85);
        }
        spring = new Spring(null, box, {
          period: 0.6,
          dampingRatio: 0.8,
          anchor: anchor
        });
        quaternion = new Quaternion();
        rotationalSpring = new RotationalSpring(null, box, {
          period: 1,
          dampingRatio: 0.2,
          anchor: quaternion
        });
        this.simulation.add(box, spring, rotationalSpring);
        pages.push({
          node: imageNode,
          el: el,
          box: box,
          spring: spring,
          quaternion: quaternion,
          rotationalSpring: rotationalSpring,
          anchor: anchor
        });
      }
      return pages;
    };
    Pager.prototype.defineWidth = function(width) {
      return this.pageWidth = width;
    };
    Pager.prototype.onUpdate = function(time) {
      var i, p, page, physicsTransform, r, scale_x, scale_y, special_z, _i, _ref;
      this.simulation.update(time);
      page;
      physicsTransform;
      p;
      r;
      for (i = _i = 0, _ref = this.pages.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        page = this.pages[i];
        physicsTransform = this.simulation.getTransform(page.box);
        p = physicsTransform.position;
        r = physicsTransform.rotation;
        if (i === this.currentIndex) {
          page.node.el.addClass('dropshadow');
        } else {
          page.node.el.removeClass('dropshadow');
        }
        special_z;
        if (i === this.currentIndex) {
          special_z = 2;
        } else {
          if ((this.currentIndex === 0 && i === 2) || (this.currentIndex === 2 && i === 0)) {
            special_z = 0;
          } else {
            special_z = 1;
          }
        }
        page.node.setPosition(p[0] * this.pageWidth, 0, special_z);
        scale_x = p[2] * 360;
        scale_y = p[2] * 640;
        page.node.setAbsoluteSize(scale_x, scale_y, 0);
        page.node.setRotation(r[0], r[1], r[2], r[3]);
      }
      return FamousEngine.requestUpdateOnNextTick(this);
    };
    Pager.prototype.pageChange = function(oldIndex, newIndex) {
      if (newIndex === 0) {
        this.carousel.arrows.back.el.addClass('hidden');
      } else if (newIndex === 2) {
        this.carousel.arrows.next.el.addClass('hidden');
      } else {
        this.carousel.arrows.back.el.removeClass('hidden');
        this.carousel.arrows.next.el.removeClass('hidden');
      }
      if (oldIndex < newIndex) {
        this.pages[oldIndex].anchor.set(-0.22, 0, 0.85);
        this.pages[newIndex].anchor.set(0, 0, 1);
      } else {
        this.pages[oldIndex].anchor.set(0.22, 0, 0.85);
        this.pages[newIndex].anchor.set(0, 0, 1);
      }
      return this.currentIndex = newIndex;
    };
    return Pager;
  });

}).call(this);
