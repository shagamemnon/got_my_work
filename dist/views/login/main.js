(function() {
  define(['views/general/top_nav', 'views/landing_page/donation_interface', 'text!templates/landing_page/loop_video.html', 'famous_stuff/landing_page/Carousel', 'config/landing_page/carousel_image_data', 'famous/core/Node', 'helpers/serialize', 'backbone'], function(TopNavView, DonationInterfaceView, LoopVideoTemplate, Carousel, imageData, Node) {
    return Backbone.View.extend({
      initialize: function() {
        var dat;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTablet = /iPad/i.test(navigator.userAgent);
        new TopNavView({
          el: $('.top-nav')[0]
        });
        this.donation_interface = new DonationInterfaceView({
          el: this.$el.find('#carousel')
        });
        dat = this;
        return $(window).resize(function() {
          return dat.setHeaderSize();
        });
      },
      events: {
        'click .press-banner a': 'openNewWindow',
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
        if (this.isTablet || !this.isMobile) {
          this.carousel = new Carousel('.ios-carousel', {
            pageData: imageData
          });
        }
        return this;
      }
    });
  });

}).call(this);
