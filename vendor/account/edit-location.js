$(document).ready(function(){
  $("#edit-location").click(function(){
  	$("#input-location input").attr("autofocus");
  	$('#input-location').css('border-bottom','1px dotted #555');
    $('#input-location img').css('display','inline');
    $('#input-location input').css('background-image','none');
  });
});