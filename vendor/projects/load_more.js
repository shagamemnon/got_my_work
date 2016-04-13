$(document).ready(function(){
		var reload = $(".project-listing");
  	$("#more").click(function(){
  	reload.slice(5,7).addClass('visible');
  	});

	function render(template, map){
		for(var key in map){
			template = template.split('['+key+']').join(map[key]);
		}
		return template;
	}

	function postedDate(date) {
		var posted = new Date(date), now = Date.now(), diff = Math.abs(now-posted) / (1000*60*60*24);
		return parseInt(diff) == 1 ? parseInt(diff) + ' day' : parseInt(diff) + ' days';
	}

	$('.load-more a').on('click', function(e){
		e.preventDefault();
		var page =  parseInt($('input[name="page"]').val());

		$.ajax({
			type: "GET",
			url: '/projects',
			data: {page: page},
			success: function(answer){
				$('input[name="page"]').val(page+1);
				(answer.object).forEach(function(item) {
					var skills = "";
					item['skills'].forEach(function (skill) {
						skills += '<span>' + skill + '</span>';
					});
					$('div.content > a').last().after(
						render($('.hidden').html(), {
							id: item['objectId'],
							title: item['title'],
							createdAt: postedDate(item['createdAt']),
							paymentType: item['paymentType'],
							knowledgeLevel: item['knowledgeLevel'],
							duration: item['duration'],
							rate: item['rate'],
							description: item['description'],
							skills: skills
						})
					);
					if (answer.object.length < 8 )
						$('.load-more a').hide();
					else
						$('.load-more a').show();
				});
				console.log(answer);
			},
			dataType: "json"
		});
	});
});


