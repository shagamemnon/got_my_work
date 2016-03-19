jQuery(document).ready(function() {
    $('.signup-header input').on('blur', function () {
        var that = $(this);
        if (that.val() != '')
            that.removeClass('error');
    });
    function errorBlockClear(form){
        var error = form.find('.error-message');
        error.empty();
    }
    function errorShow(form, message, code){
        if ( code == 202 ) {
            form.find('[name="email"]').addClass("error");
            //form.find('.passed').show();
            message = message.replace("username", "email");
        }
        var error = form.find('.error-message');
        error.text(message);
        $("body,html").animate({"scrollTop":error.offset().top - 10});
    }
    function sendAjax(url, data, redirect, form){
        $.ajax({
            method: "POST",
            url: url,
            dataType: "json",
            data: data, //form.serializeArray(),
            success: function(ans) {
                window.location = redirect;
            },
            error: function(ans) {
                //if ( ans.responseJSON.code == 209 ) { /* Parse session error */
                //    //localStorage.clear();
                //    //sendAjax(url, data, redirect, form);
                //} else
                errorShow(form, ans.responseJSON.error, ans.responseJSON.code);
            }
        });
    }
    $('.signup-header').on("click", "button", function(){
        var block = $(this).parents('.signup'),
            form = block.find('form'),
            error = form.find('.error-message');
            //form = block.find('.signup.user form'),

        form.find('input').removeClass('error');
        errorBlockClear(form);
        form.find('input').each(function(){
            var self = $(this);
            if (self.val().length == 0 && self.attr('name') != '_gotcha')
                self.addClass('error');
        });
        if ( block.find('.error').length == 0 ) {
            if (form.find('[name="password"]').val() == form.find('[name="confirm"]').val()) {
                if (block.hasClass('company'))
                    payment(form, function (res) {
                        if (res)
                            sendAjax(form.attr('action'), form.serializeArray(), "/company", form);
                    });
                else
                    sendAjax(form.attr('action'), form.serializeArray(), "/profile", form);
            } else if (form.find('[name="password"]').val() != form.find('[name="confirm"]').val())
                errorShow(form, "Password doesn't match");
                //block.find('.hidden input').addClass('error');
            else
                errorShow(form, "Fields can't be empty");
        } else
            errorShow(form, "Fields can't be empty");
    });
});
