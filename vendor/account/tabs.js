jQuery(document).ready(function() {
    $('.profile-container .sidebar a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
        $('.profile-container ' + currentAttrValue).show().siblings().hide();
        $(this).parent('span').addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });
});