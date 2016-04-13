$(document).ready(function(){
    var tags = [];

    function sendData(data, url, callback){
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(result){
                $('#info .container').css('background-image', 'none');
                $('#info .container .project-listing').css('opacity', '1');
                if (callback)
                    callback(result);
            },
            dataType: "json"
        });
    }
    function inputChange(name){
        $('#open-' + name +' >:first-child').text($('#edit-'+name).val());
        $('#input-'+name).css({'background-color':'transparent', 'border-bottom':'none'});
        $('#edit-'+name).css({'display':'inline', "background-image":"url('https://s3.amazonaws.com/igotmywork/user_profile/pencil.png')"});
        $('#close-'+name+', #save-'+name).css('display','none');
        $('#input-'+name).animate({'opacity':'0'},50,'linear', function(){
            $('#input-'+name).css('display','none');
            $('#edit-'+name).attr("autofocus");
        });
        name == "location" ? sendData({adress: $('#edit-'+name).val()}, "/profile") : sendData({skill: $('#edit-'+name).val()}, "/profile");
    }
    $('[id^="save"]').on('click', function(){
        var name = $(this).attr("id").split('-').pop();
        inputChange(name);
    });
    $('[id^="edit"]').on({
        click: function() {
            var that = $(this),
                name = that.attr("name");

            that.attr("autofocus");
            $('#input-'+name).css('border-bottom', '1px dotted #555');
            $('#input-'+name).find("img").css('display', 'inline');
        }, blur: function(){
            var name = $(this).attr("name");
            inputChange(name);
        }
    });

    $('[id^="open"]').on('click', function(){
        var name = $(this).attr("id").split('-').pop();
        $('#input-'+name).animate({'opacity':'1'}, 300, 'linear');
        $('#input-'+name).css('display','block');
        $('#edit-'+name).css('background-image','none').attr("autofocus");
    });

    $('[id^="close"]').on('mousedown', function(){
        var name = $(this).attr("id").split('-').pop();
        $('#edit-'+name).val("");
        inputChange(name);
    });

    function tagsPlaceholder(){
        if($('#projectTags li').length != 0)
            $('.tagsPlaceholder').text('');
        else
            $('.tagsPlaceholder').text('Drop tags Here...');
    }

    function tag(){
        $('#projectTags li').each(function(index, item){
            tags.push($(item).text().trim());
        });
        $('input[name="skills"]').val($.unique(tags).join());
        $('#tagsList').empty();
        $(languages).each(function(index, item){
            $('#tagsList').append('<li>'+item+'<span></span></li>');
        });
    }

    $( "#projectTags, #tagsList" ).sortable({
        connectWith: "#projectTags",
        change: function( event, ui ) {
            tagsPlaceholder();
        }
    }).disableSelection();

    $('#tagsList').on('dblclick', 'li', function(){
        var li = $(this);
        $('#projectTags').append(li);
        tagsPlaceholder();
        //tag('add', li);
    });

    $('#projectTags').on('click', 'li span', function(){
        var li = $(this).parent('li');
        $('#tagsList').append(li);
        //tag('remove', li);
        tagsPlaceholder();
    });

    $("#project-save").on('click', function(){
        tag();
        $('#info .container').css('background-image', 'url("https://s3.amazonaws.com/igotmywork/projects/loading.gif")');
        $('#info .container .project-listing').css('opacity', '0.5');
        sendData($("#payment-form").serialize(), "/projects", function(result){
            if(result == "ok") {
                $("#payment-form")[0].reset();
                $('#projectTags').empty();
                $('.tagsPlaceholder').text('Drop tags Here...');
                $("#close").click();
            } else
                $(".error-message").text(result);
        });
    });
});