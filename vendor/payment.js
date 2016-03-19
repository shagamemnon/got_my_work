Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

function payment($form, result) {
    var //$form = $('#payment-form'),
        card = $form.find('[name="payment-card"]'),
        cvc = $form.find('[name="cvv"]'),
        exp = $form.find('[name="expiration"]'),
        name = $form.find('[name="cardHolder"]'),
        token = $form.find('[name="stripeToken"]'),
        answer = token.length != 0 && token.val() != '' ? true : false;
        //errorBlock = $form.find('.error-message.payment');

    function errorBlockClear(form){
        var error = form.find('.error-message');
        error.empty();
    }
    function errorShow(form, message){
        var error = form.find('.error-message');
        error.text(message);
        $("body,html").animate({"scrollTop":error.offset().top - 10});
    }
    function stripeResponseHandler(status, response) {
        if (response.error) {
            var error = response.error;
            // Show the errors on the form
            switch (error.param) {
                case 'number':
                    card.addClass('error');
                    errorShow($form, error.message);
                    break;
                case 'exp_year':
                    exp.addClass('error');
                    errorShow($form, error.message);
                    break;
                case 'cvc':
                    cvc.addClass('error');
                    errorShow($form, error.message);
                    break;
            }
            errorShow($form, response.error.message);
        } else {
            $form.append($('<input type="hidden" name="stripeToken" />').val(response.id));
            if(result)
                result(true);
        }
    }
    function paymentCheck() {
        //errorBlockClear($form);
        $('.error').removeClass('error');

        card.val() == '' ? card.addClass('error') : card.removeClass('error');
        if (cvc.val() == '')
            cvc.addClass('error');
        if (exp.val() == '')
            exp.addClass('error');
        if (name.val() == '')
            name.addClass('error');

        if ($form.find('.error').length == 0) {

            Stripe.card.createToken({
                number: card.val(),
                cvc: cvc.val(),
                exp: exp.val()
            }, stripeResponseHandler);
        } else
            errorShow($form, "Fields shouldn't be empty");
    }
    if ( !answer )
        paymentCheck();

    if(result)
        result(answer)
}