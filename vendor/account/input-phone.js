$(document).ready(function(){
  $("#open-location").click(function(){
		 $("#input-location input").attr("autofocus");
		 $('#input-location').animate({'opacity':'1'}, 300, 'linear');
     $('#input-location').css('display','block');
     $('#input-location input').css('background-image','none');
     $("#input-location input").attr("autofocus");
  });

  $('#close-location').click(function(){
  	 $(this).closest('form').find("input[name=location]").val("");
     $('#input-location').animate({'opacity':'0'},50,'linear', function(){
     $('#input-location').css('display','none');
     $("#input-location input").attr("autofocus");
   });
  });
});