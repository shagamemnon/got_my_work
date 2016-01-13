(function() {
  define(['famous/core/FamousEngine', 'famous_stuff/landing_page/Arrow', 'famous_stuff/landing_page/Pager', 'famous/components/Camera'], function(FamousEngine, Arrow, Pager, Camera) {
    var Carousel, _bindEvents, _positionComponents;
    Carousel = function(selector, data) {
      this.context = FamousEngine.createScene(selector);
      this.root = this.context.addChild();
      new Camera(this.root).setDepth(1000);
      this.pageData = data.pageData;
      this.arrows = {
        back: this.root.addChild(new Arrow({
          direction: -1
        })),
        next: this.root.addChild(new Arrow({
          direction: 1
        }))
      };
      this.pager = new Pager(this.root.addChild(), {
        pageData: this.pageData,
        carousel: this
      });
      _positionComponents.call(this);
      this.currentIndex = 1;
      return _bindEvents.call(this);
    };
    _positionComponents = function() {
      this.arrows.back.setSizeMode(1, 1);
      this.arrows.back.setAbsoluteSize(75, 75);
      this.arrows.back.setPosition(0, 5, 3);
      this.arrows.back.setAlign(.25, .5, 0);
      this.arrows.back.setMountPoint(0, .5, 0);
      this.arrows.next.setSizeMode(1, 1);
      this.arrows.next.setAbsoluteSize(75, 75);
      this.arrows.next.setPosition(0, 5, 3);
      this.arrows.next.setAlign(.75, .5, 0);
      this.arrows.next.setMountPoint(1, .5, 0);
      this.pager.node.setAlign(.5, .5, 0);
      return this.pager.node.setMountPoint(.5, .5, 0);
    };
    _bindEvents = function() {
      return this.root.addComponent({
        onReceive: (function(_this) {
          return function(e, payload) {
            var amount, direction, i, isArrowClicked, max, min, newIndex, oldIndex;
            isArrowClicked = (e === 'click') && (payload.node.constructor === Arrow);
            if (isArrowClicked) {
              direction = payload.node.direction;
              amount = payload.node.amount;
              amount = amount || 1;
              oldIndex = _this.currentIndex;
              i = oldIndex + (direction * amount);
              min = 0;
              max = 2;
              newIndex = i > max ? max : i < min ? min : i;
              if (_this.currentIndex !== newIndex) {
                _this.currentIndex = newIndex;
                return _this.pager.pageChange(oldIndex, _this.currentIndex);
              }
            }
          };
        })(this)
      });
    };
    return Carousel;
  });

}).call(this);
