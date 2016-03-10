$(document).ready(function(){
  $("#open-alt").click(function(){
     $('#overlay-alt, #info-alt').animate({'opacity':'0.7'}, 300, 'linear');
     $('#info-alt').animate({'opacity':'1.00'},300,'linear');
     $('#overlay-alt, #info-alt').css('visibility','visible');
     $('#info-alt').css({'left':(($(document).width()/2)-($('#info-alt').width()/2))});
     $('#info-alt').css({'top':(($(document).height()/2)-($('#info-alt').height()/2)-50)});
     $('footer').css('display','none');
  });

  $('#close-alt').click(function(){
     $('#overlay-alt, #info-alt').animate({'opacity':'0'},300,'linear', function(){
     $('#overlay-alt, #info-alt').css('visibility','hidden');
     $('footer').css('display','block');
   });
  });
});