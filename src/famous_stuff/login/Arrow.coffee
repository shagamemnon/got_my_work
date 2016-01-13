define [
  'famous/dom-renderables/DOMElement',
  'famous/core/Node'
  ], ( DOMElement, Node ) ->
    Arrow = (options) ->
        Node.call( @ )

        @.el = new DOMElement(@)
        @el.setProperty('color', 'white')
        @el.addClass( 'demo-arrow')
        @direction = options.direction
        @el.setProperty('zIndex', '3')

        @el.setProperty('background-repeat', 'no-repeat')
        @el.setProperty('background-size', 'cover')

        if ( @direction == 1 )
            # >
          @el.setProperty('backgroundImage', 'url( https://s3.amazonaws.com/mycents/photos/landing_page/ios_demo/next.png )');
        else
            # <
          @.el.setProperty('backgroundImage', 'url( https://s3.amazonaws.com/mycents/photos/landing_page/ios_demo/back.png )');

        # Listen to the click event
        @addUIEvent('click');


    Arrow.prototype = Object.create(Node.prototype);
    Arrow.prototype.constructor = Arrow;

    return Arrow
