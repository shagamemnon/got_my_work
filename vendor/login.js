jQuery(document).ready(function() {
    $('.signup-header').on("click", "button", function(){
        var block = $('.signup-header'),
            form = block.find('.signup.user form'),
			error = block.find('.error-message');
        form.find('input').removeClass('error');
		error.text("");
        form.find('input').each(function(){
            var self = $(this);
            if (self.val().length == 0 && self.attr('name') != '_gotcha')
                self.addClass('error');
        });

        if ( ! block.find('.visible').hasClass('passed') ) {
			if ( block.find('.visible').find('.error').length == 0 ) {
				block.find("img").attr("src", "https://s3.amazonaws.com/igotmywork/signup/dots_two.png");
				block.find('.visible').hide().addClass('passed');
				block.find('.hidden').show();
			} else
				error.text("Fields can't be empty");
        } else {
            if ( form.find('.error').length == 0 && form.find('[name="pass"]').val() == form.find('[name="confirm"]').val())
                $.ajax({
                    method: "POST",
                    url: form.attr('action'),
                    dataType: "json",
                    data: form.serializeArray()
                }).done(function (ans) {
                    console.log(ans);
                    if (ans.error)
                        error.text(ans.error);
					else
						window.location = "/";
                });
            else if ( form.find('.error').length == 0 && form.find('[name="pass"]').val() != form.find('[name="confirm"]').val() ) {
                error.text("Password doesn't match");
                block.find('.hidden input').addClass('error');
            }
			else
				error.text("Fields can't be empty");
        }
    });
});
