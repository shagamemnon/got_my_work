define [
  'famous/core/FamousEngine',
  'famous_stuff/landing_page/Arrow',
  'famous_stuff/landing_page/Pager',
  'famous/components/Camera'
  ], ( FamousEngine, Arrow, Pager, Camera ) ->

    Carousel = (selector, data) ->
        @context = FamousEngine.createScene(selector)
        @root = @context.addChild()

        # add camera for perspective
        new Camera(@root).setDepth(1000)

        # Keep reference to the page data, which is
        # the images we'll display in our carousel
        @pageData = data.pageData

        @arrows = {
            back: @root.addChild(new Arrow({ direction: -1 })),
            next: @root.addChild(new Arrow({ direction:  1 }))
        }

        @pager = new Pager(@root.addChild(), { pageData: @pageData, carousel: @ })

        _positionComponents.call(@)

        @currentIndex = 1
        _bindEvents.call(@)

    _positionComponents = ->
        @arrows.back.setSizeMode(1,1)
        @arrows.back.setAbsoluteSize(75, 75)
        @arrows.back.setPosition(0, 5, 3)
        @arrows.back.setAlign(.25, .5, 0)
        @arrows.back.setMountPoint(0, .5, 0)

        @arrows.next.setSizeMode(1,1)
        @arrows.next.setAbsoluteSize(75, 75)
        @arrows.next.setPosition(0, 5, 3)
        @arrows.next.setAlign(.75, .5, 0)
        @arrows.next.setMountPoint(1, .5, 0)

        @pager.node.setAlign(.5, .5, 0)
        @pager.node.setMountPoint(.5, .5, 0)

    _bindEvents = ->
        @root.addComponent({
            onReceive: (e, payload) =>
                # Verify the event as being 'click' and the appropriate 'Node'
                isArrowClicked = (e == 'click') &&
                                     (payload.node.constructor == Arrow)
                if isArrowClicked
                    direction = payload.node.direction
                    amount = payload.node.amount
                    amount = amount || 1

                    oldIndex = @currentIndex

                    i = oldIndex + (direction * amount)
                    min = 0
                    max = 2

                    newIndex = if i > max then max else if  i < min then min else i

                    if @currentIndex != newIndex
                        @currentIndex = newIndex
                        @pager.pageChange(oldIndex, @currentIndex)
        })

    return Carousel
