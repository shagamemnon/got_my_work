$(document).ready(function(){
	var save = $('#input-skill')
  	$("#save-skill").click(function(){
  	$('#input-skill').css({'background-color':'transparent', 'border-bottom':'none'});
    save.find('input').css({'display':'inline', "background-image":"url('https://s3.amazonaws.com/igotmywork/user_profile/pencil.png')"});
    save.find('#close-skill').css('display','none');
    save.find('#save-skill').css('display','none');
  });
});