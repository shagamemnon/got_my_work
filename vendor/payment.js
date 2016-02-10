Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

$(document).ready(function() {
    var $form = $('#payment-form'),
        card = $form.find('[name="payment-card"]'),
        cvc = $form.find('[name="cvv"]'),
        exp = $form.find('[name="expiration"]'),
        name = $form.find('[name="cardHolder"]'),
        errorBlock = $form.find('.error-message.payment');
    $form.find('input').on('blur', function(){
        var that = $(this);
        if ( that.val() != '' )
            that.removeClass('error');
    });
    function stripeResponseHandler(status, response) {
        if (response.error) {
            var error = response.error;
            // Show the errors on the form
            switch (error.param){
                case 'number':
                    card.addClass('error');
                    errorBlock.text(error.message);
                    break;
                case 'exp_year':
                    exp.addClass('error');
                    errorBlock.text(error.message);
                    break;
                case 'cvc':
                    cvc.addClass('error');
                    errorBlock.text(error.message);
                    break;
            }
            $form.find('.payment-errors').text(response.error.message);
            $form.find('button').prop('disabled', false);
        } else {
            // response contains id and card, which contains additional card details
            var token = response.id;
            // Insert the token into the form so it gets submitted to the server
            $form.append($('<input type="hidden" name="stripeToken" />').val(token));
            // and submit
            $form.get(0).submit();
        }
    }
    $('.submit-button').on('click', 'button', function () {
        errorBlock.empty();
        $('.error').removeClass('error');

        if ( card.val() == '' )
            card.addClass('error');
        if ( cvc.val() == '')
            cvc.addClass('error');
        if ( exp.val() == '' )
            exp.addClass('error');
        if ( name.val() == '' )
            name.addClass('error');

        if ( $form.find('.error').length == 0 )

            Stripe.card.createToken({
                number: card.val(),
                cvc: cvc.val(),
                exp: exp.val()
            }, stripeResponseHandler);
        else
            errorBlock.text("Fields shouldn't be empty");
    });
});