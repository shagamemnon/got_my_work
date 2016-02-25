$(document).ready(function(){
  $("#request").click(function(){
    $('#info, #info-user').css("background-image", "url('https://s3.amazonaws.com/igotmywork/projects/loading.gif')");
    $('#info, #info-user').css({'font-size': '0px'});
    setTimeout(function(){
        $('#info').fadeIn(500).css({'background-color': 'white', 'opacity': '1', "background-image": "url('https://s3.amazonaws.com/igotmywork/projects/request_success.png')"});
    }, 1000);
    setTimeout(function(){
        $('#info').fadeIn(800).css('display', 'none');
    },2000);
});
});