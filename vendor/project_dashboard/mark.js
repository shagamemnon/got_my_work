$(document).ready(function(){
		var url = document.URL;
		var stuff = url.split('/');
		var id = stuff[stuff.length-1];
		var checkAlert = 0;

	function send(stageRequired, stagePrev, status, prevStatus, data){
		var checkStage = stageRequired.split(' ');
		var checkPrevStage;
		if(status != "waiting"){
			checkPrevStage = stagePrev.split(' ')
		}else{
			checkPrevStage = ["active"];
		}

		if((checkStage[checkStage.length-1] == "inactive" && checkPrevStage[checkPrevStage.length-1] == "active") || (status == "delivered" && checkPrevStage[checkPrevStage.length-1] == "complete")){
			var confirmStatusChanging = confirm("Are you sure!");
			if (confirmStatusChanging == true) {
				var requestStatus = {id:id, status:status, data:data}
					$("#" + status).css({
							'background-image': "url('https://s3.amazonaws.com/igotmywork/projects/loading.gif')",
							'background-repeat': "no-repeat",
							'background-position': "center",
							'background-size' : 'contain',
							'font-size': '0',
							'background-color': '#ddd'});
				$.ajax({
					url: "/dashboard/:id",
					method: "put",
					data: JSON.stringify(requestStatus),
					contentType : 'application/json',
					success: (data) => {
						$("#" + status).attr("style","");
						if(checkAlert == 0){
							$('#alert').css("visibility", "visible").delay(2000).fadeOut();
							checkAlert++;
						}else{
							$('#alert').fadeIn();
							$('#alert').delay(2000).fadeOut();
						}

						if(status == "delivered"){
							$("#" + status).removeClass("active").addClass("complete");
						} else{
							$("#" + status).removeClass("inactive").addClass("active");
						}
						$("#" + prevStatus).removeClass("active").addClass("complete");
					},
					error: (data) => {
					}
				})
			}

		}
	}

	$('#waiting').on('click', function () {
		send($(this).attr("class"), "" , "waiting", "", {"waitingStage":"Request waiting"});
	});

	$('#running').on('click', function () {
		send($(this).attr("class"), $("#waiting").attr("class"), "running", "waiting", {"runningStage":"Request running"});
	});

	$('#testing').on('click', function () {
		send($(this).attr("class"), $("#running").attr("class"), "testing", "running", {"testingStage":"Request testing"});
	});

	$('#complete').on('click', function () {
		send($(this).attr("class"), $("#testing").attr("class"), "complete", "testing", {"completeStage":"Request completing"});
	});

	$('.deliver').on('click', function () {
		send($(this).attr("class"), $("#complete").attr("class"), "delivered", "complete", {"deliveredStage":"Deliver project"});
	});

});