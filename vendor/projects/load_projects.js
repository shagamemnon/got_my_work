$(document).ready(function(){
  $("#load-more").click(function(){
    $('.project-listing').css("background-image", "url('https://s3.amazonaws.com/igotmywork/projects/loading.gif')");
    $('.project-listing').css({'opacity': '0.1'});
    setTimeout(function(){
        $('.project-listing').fadeIn(500).css({"background-image": "none"});
    }, 1000);
    setTimeout(function(){
        $('.project-listing').fadeIn(500).css('opacity', '1');
    },1100);
});
});