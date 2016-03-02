jQuery(document).ready(function() {
    $('section .header a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
        $('.calendar' + currentAttrValue).show().siblings().hide();
        $(this).parent('table').addClass('this-month').siblings().removeClass('this-month');
        e.preventDefault();
    });
});