$(document).ready(function(){
    var id = "",
        search = {};
    $("#request").on("click", function(){
        var that = $(this);
        $.ajax({
            type: "PUT",
            url: "/projectRequyest",
            data: {id: id},
            success: function(answer){
                console.log(answer);
                if(answer.result == "ok") {
                    that.css({
                        'background-image': "url('https://s3.amazonaws.com/igotmywork/projects/loading.gif')",
                        'font-size': '0px',
                        'background-color': '#ddd'});
                    setTimeout(function(){
                        that.fadeIn(500).css({'border':'2px solid #ddd', 'background-color': 'white', 'opacity': '0.8', "background-image": "url('https://s3.amazonaws.com/igotmywork/projects/request_success.png')"});
                    }, 1000);
                    setTimeout(function(){
                        that.fadeIn(800).css('opacity', '0.5');
                    },2000);
                } else
                    $('#info .error').text(answer.error);
            },
            dataType: "json"
        });
    });
    $('.project_index .content a').on('click', function(e){
        e.preventDefault();
        $('#request').attr('style', '');
        $('#info .error').text('');
        var self = $(this);
        self.attr('id', 'open');
        id = self.data('id');
        $('#info .project-listing').html(self.html());
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

    function send(search){
        $.ajax({
             type: "POST",
             url: "/projectSearch",
             data: {filters: JSON.stringify(search)},
             success: function(answer){
                 console.log(answer);
                 $('div.content').empty();
                 (answer.object).forEach(function(item){
                     var skills = "";
                     item['skills'].forEach(function(skill){
                        skills += '<span>' + skill + '</span>';
                     });
                     $('div.content').append(
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
                 });
             },
            dataType: "json"
         });
    }

    function check(){
        search = {};
        $('.sidebar input:checked').each(function(ind, item){
            var name = $(item).attr('name').replace('[]','');
            if(!search[name])
                search[name] = [];
            search[name].push($(item).val())
        });

        $('.search-bar select').each(function(ind, item){
            var name = $(item).attr('name');
            if($(item).val() != null) {
                if (!search[name])
                    search[name] = [];
                search[name].push($(item).val())
            }
        });
        send(search);
    }

    $('.sidebar input[type="checkbox"]').on('change', function(){
        check();
    });
    $('.search-bar select').on('change', function(){
        check();
    });
    /*$('.sidebar span').on('click', 'a', function(){
        $.ajax({
            type: "PUT",
            url: "/projectSearch",
            data: {id: id},
            success: function(answer){
                console.log(answer);
                if(answer.result == "ok") {

                } else
                    $('#info .error').text(answer.error);
            },
            dataType: "json"
        });
    })*/
});