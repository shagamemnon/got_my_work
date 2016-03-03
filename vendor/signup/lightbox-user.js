$(document).ready(function(){
  $("#open-user").click(function(){
     $('#overlay-user, #info-user').animate({'opacity':'0.7'}, 300, 'linear');
     $('#info-user').animate({'opacity':'1.00'},300,'linear');
     $('#overlay-user, #info-user').css('visibility','visible');
     $('#info-user').css({'left':(($(document).width()/2)-($('#info-user').width()/2))});
     $('#info-user').css({'top':(($(document).height()/2)-($('#info-user').height()/2)-50)});
     $('footer').css('display','none');
  });

  $('#close-user').click(function(){
     $('#overlay-user, #info-user').animate({'opacity':'0'},300,'linear', function(){
     $('#overlay-user, #info-user').css('visibility','hidden');
     $('footer').css('display','block');
   });
  });
});