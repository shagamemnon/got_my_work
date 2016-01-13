define [
  'famous/dom-renderables/DOMElement',
  'famous/physics/PhysicsEngine',
  'famous/core/FamousEngine',
  'famous/physics/index',
  'famous/math/index'
  ], ( DOMElement, PhysicsEngine, FamousEngine, physics, math ) ->

    Box = physics.Box
    Spring = physics.Spring
    RotationalSpring = physics.RotationalSpring
    RotationalDrag = physics.RotationalDrag
    Quaternion = math.Quaternion
    Vec3 = math.Vec3

    Pager = (node, options) ->
        @node = node
        @carousel = options.carousel
        @currentIndex = 1
        @pageWidth = 0

        resizeComponent = {
            onSizeChange: (x, y, z) =>
                @defineWidth(x)
        }
        @node.addComponent(resizeComponent)

        # Add a physics simulation and update @ instance
        # using regular time updates from the clock.
        @simulation = new PhysicsEngine()

        # .requestUpdate will call the .onUpdate method next frame, passing in the time stamp for that frame
        FamousEngine.requestUpdate(@)

        @pages = _createPages.call(@, node, options.pageData)
        @



    _createPages = (root, pageData) ->
        pages = []

        for i in [0...3]
            imageNode = root.addChild()

            imageNode.setSizeMode(1,1,1)
            imageNode.setAbsoluteSize(360, 640, 0)
            imageNode.setAlign(0.5, 0.5)
            imageNode.setMountPoint(0.5, 0.5)
            imageNode.setOrigin(0.5, 0.5)

            el = imageNode.el = new DOMElement(imageNode)
            el.addClass( 'cents-image-node' )
            el.setProperty('backgroundImage', 'url(' + pageData[i] + ')')
            el.setProperty('background-repeat', 'no-repeat')
            el.setProperty('background-size', 'cover')
            el.setContent( '<div class="dropshadow-glass"></div>' )

            # A `Box` body to relay simulation data back to the visual element
            box = new Box({
                mass: 100,
                size: [100,100,100]
            })

            # Place all anchors off the screen, except for the
            # anchor belonging to the first image node
            anchor = if i == 1 then new Vec3(0, 0, 1) else new Vec3(0.22, 0, 0.85)
            if i == 0
                anchor = new Vec3( -0.22, 0, 0.85 )

            # Attach the box to the anchor with a `Spring` force
            spring = new Spring(null, box, {
                period: 0.6,
                dampingRatio: 0.8,
                anchor: anchor
            })

            # Rotate the image 90deg about the y-axis,
            # except for first image node
            quaternion = new Quaternion()

            # Attach an anchor orientation to the `Box` body with a `RotationalSpring` torque
            rotationalSpring = new RotationalSpring(null, box, {
                period: 1,
                dampingRatio: 0.2,
                anchor: quaternion
            })

            # Notify the physics engine to track the box and the springs
            @simulation.add(box, spring, rotationalSpring)

            pages.push({
              node: imageNode,
              el: el,
              box: box,
              spring: spring,
              quaternion: quaternion,
              rotationalSpring: rotationalSpring,
              anchor: anchor
            })
        pages

    Pager.prototype.defineWidth = (width) ->
      @pageWidth = width

    Pager.prototype.onUpdate = (time) ->
        @simulation.update(time)

        page
        physicsTransform
        p
        r
        for i in [0...@pages.length]
            page = @pages[i]

            # Get the transform from the `Box` body
            physicsTransform = @simulation.getTransform(page.box)
            p = physicsTransform.position
            r = physicsTransform.rotation


            # Toggle dropshadow
            if  i == @currentIndex
                page.node.el.addClass( 'dropshadow' )
            else
                page.node.el.removeClass( 'dropshadow' )

            # Set the `imageNode`'s x-position to the `Box` body's x-position
            special_z
            if i == @currentIndex
               special_z = 2
            else
                if ( @currentIndex == 0 && i == 2 ) || ( @currentIndex == 2 && i == 0 )
                    special_z = 0
                else
                    special_z = 1
            page.node.setPosition(p[0] * @pageWidth, 0, special_z )

            # Set the `imageNode`'s scaling relative to z-position
            scale_x = ( p[2] * 360 )
            scale_y = ( p[2] * 640 )
            page.node.setAbsoluteSize( scale_x, scale_y, 0 )

            # Set the `imageNode`'s rotation to match the `Box` body's rotation
            page.node.setRotation(r[0], r[1], r[2], r[3])

        FamousEngine.requestUpdateOnNextTick(@)

    Pager.prototype.pageChange = (oldIndex, newIndex) ->
        # Toggle arrow opacity
        if newIndex == 0
            @carousel.arrows.back.el.addClass( 'hidden' )
        else if ( newIndex == 2 )
            @carousel.arrows.next.el.addClass( 'hidden' )
        else
            @carousel.arrows.back.el.removeClass( 'hidden' )
            @carousel.arrows.next.el.removeClass( 'hidden' )

        if oldIndex < newIndex
            @pages[oldIndex].anchor.set(-0.22, 0, 0.85)
            @pages[newIndex].anchor.set(0, 0, 1)
        else
            @pages[oldIndex].anchor.set(0.22, 0, 0.85)
            @pages[newIndex].anchor.set(0, 0, 1)
        @currentIndex = newIndex

    return Pager
