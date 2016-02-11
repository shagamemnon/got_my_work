jQuery(document).ready(function() {
    $('.profile-container .sidebar a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        $('.profile-container ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('span').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });
});