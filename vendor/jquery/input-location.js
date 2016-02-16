$(document).ready(function(){
  $("#open-location").click(function(){
     $('#input-location').animate({'opacity':'1'}, 300, 'linear');
     $('#input-location').css('display','block');
  });

  $('#close-location').click(function(){
     $('#input-location').animate({'opacity':'0'},100,'linear', function(){
     $('#input-location').css('display','none');
   });
  });
});