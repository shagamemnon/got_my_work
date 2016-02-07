jQuery(document).ready(function() {
    $('.dashboard-container .sidebar a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        $('.dashboard-container ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('span').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });
});