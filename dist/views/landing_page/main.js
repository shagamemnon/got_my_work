(function() {
  define(['views/general/top_nav', 'views/landing_page/animation_slider', 'famous_stuff/landing_page/Carousel', 'config/landing_page/carousel_image_data', 'famous/core/Node', 'helpers/serialize', 'backbone'], function(TopNavView, AnimationSlider, Carousel, imageData, Node) {
    return Backbone.View.extend({
      animationSliders: [],
      initialize: function() {
        var $window, dat;
        dat = this;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTablet = /iPad/i.test(navigator.userAgent);
        new TopNavView({
          el: $('.top-nav')[0]
        });
        this.donation_interface = new DonationInterfaceView({
          el: this.$el.find('#donation-interface')
        });
        $('.step-container').each(function(index, stepContainer) {
          return dat.animationSliders.push(new AnimationSlider({
            el: stepContainer
          }));
        });
        $window = $(window);
        return $window.scroll(function(e) {
          var bottomWindowPositionY;
          bottomWindowPositionY = $window.scrollTop() + $window.innerHeight();
          return _.each(dat.animationSliders, function(slider) {
            return slider.checkScroll(bottomWindowPositionY);
          });
        });
      },
      events: {
        'click .js-page-scroll': 'pageScroll',
        'submit .evaluate-form': 'submitEvalution',
        'focus textarea': 'focusTextarea',
        'blur textarea': 'unfocusTextarea',
        'click .textarea-border': 'typeTextarea',
        'submit .contact-form': 'submitContact'
      },
      openNewWindow: function(e) {
        e.preventDefault();
        return window.open($(e.target).closest('a').attr('href'));
      },
      pageScroll: function(e) {
        var navigateId;
        navigateId = $(e.target).data('navigate');
        return this.pageNavigate(navigateId);
      },
      pageNavigate: function(navigateId) {
        var top;
        if (window.innerWidth > 650) {
          top = $("#" + navigateId).offset().top;
        } else {
          top = $("#" + navigateId).offset().top - 60;
        }
        return $('html, body').animate({
          scrollTop: top
        }, 1000);
      },
      focusTextarea: function() {
        return this.$el.find('.textarea-border').addClass('focus');
      },
      unfocusTextarea: function() {
        return this.$el.find('.textarea-border').removeClass('focus');
      },
      typeTextarea: function(e) {
        var $target;
        $target = $(e.target);
        if ($target.closest('textarea').length === 0 && $target.closest('input[type="submit"]').length === 0) {
          return $('textarea').focus();
        }
      },
      submitEvalution: function(e) {
        var dat, params;
        e.preventDefault();
        params = $(e.target).serializeObject();
        dat = this;
        return $.ajax({
          type: 'POST',
          url: '/',
          data: params,
          success: function() {
            alert('email sent');
            return e.target.reset();
          }
        });
      },
      submitContact: function(e) {
        var dat, params;
        e.preventDefault();
        params = $(e.target).serializeObject();
        dat = this;
        return $.ajax({
          type: 'POST',
          url: '/',
          data: params,
          success: function() {
            alert('email sent');
            return e.target.reset();
          }
        });
      },
      render: function() {
        this.setHeaderSize();
        return this;
      }
    });
  });

}).call(this);
