$(document).ready(function(){
	var save = $('#input-location')
  	$("#save-location").click(function(){
  	$('#input-location').css({'background-color':'transparent', 'border-bottom':'none'});
    save.find('input').css({'display':'inline', "background-image":"url('https://s3.amazonaws.com/igotmywork/user_profile/pencil.png')"});
    save.find('#close-location').css('display','none');
    save.find('#save-location').css('display','none');
  });
});