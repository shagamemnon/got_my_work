$(document).ready(function(){
  $("#edit-skill").click(function(){
  	$("#input-skill input").attr("autofocus");
  	$('#input-skill').css('border-bottom','1px dotted #555');
    $('#input-skill img').css('display','inline');
    $('#input-skill input').css('background-image','none');
  });
});