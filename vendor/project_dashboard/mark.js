$(document).ready(function(){
	$(".dashboard").click(function(){
	$("#inactive").css({'background-color': '#0297FD', 'font-size': '0px'});
	$('#alert').css("visibility", "visible").delay(2000).fadeOut();
	 });
});