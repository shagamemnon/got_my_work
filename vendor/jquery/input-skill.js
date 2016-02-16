$(document).ready(function(){
  $("#open-skill").click(function(){
		 $('#input-skill').animate({'opacity':'1'}, 300, 'linear');
     $('#input-skill').css('display','block');
  });

  $('#close-skill').click(function(){
     $('#input-skill').animate({'opacity':'0'},100,'linear', function(){
     $('#input-skill').css('display','none');
   });
  });
});