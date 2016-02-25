$(document).ready(function(){
  $("#request").click(function(){
    $('button').css("background-image", "url('https://s3.amazonaws.com/igotmywork/projects/loading.gif')");
    $('button').css({'font-size': '0px','background-color': '#ddd'});
    setTimeout(function(){
        $('button').fadeIn(500).css({'border':'2px solid #ddd', 'background-color': 'white', 'opacity': '0.8', "background-image": "url('https://s3.amazonaws.com/igotmywork/projects/request_success.png')"});
    }, 1000);
    setTimeout(function(){
        $('button').fadeIn(800).css('opacity', '0.5');
    },2000);
});
});