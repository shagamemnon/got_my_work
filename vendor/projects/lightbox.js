$(document).ready(function(){
  $("#open").click(function(){
     $('#overlay, #info').animate({'opacity':'0.9'}, 300, 'linear');
     $('#info').animate({'opacity':'1.00'},300,'linear');
     $('#overlay, #info').css('visibility','visible');
     $('.dashboard-container').css('display','none');
     $('footer').css('display','none');
     $('#info').css({'left':(($(document).width()/2)-($('#info').width()/2))});
     $('#info').css({'top':(($(document).height()/2)-($('#info').height()/2)-50)});
  });

  $('#close').click(function(){
     $('#overlay, #info').animate({'opacity':'0'},300,'linear', function(){
     $('#overlay, #info').css('visibility','hidden');
     $('.dashboard-container').css('display','block');
     $('footer').css('display','block');
   });
  });
});