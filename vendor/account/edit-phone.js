$(document).ready(function(){
  $("#edit-phone").click(function(){
  	$("#input-phone input").attr("autofocus");
  	$('#input-phone').css('border-bottom','1px dotted #555');
    $('#input-phone img').css('display','inline');
    $('#input-phone input').css('background-image','none');
  });
});