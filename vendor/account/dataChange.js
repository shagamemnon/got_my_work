$(document).ready(function(){
    function sendData(data){
        $.ajax({
            type: "POST",
            url: "/profile",
            data: data,
            success: function(result){
                console.log(result);
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
        name == "location" ? sendData({adress: $('#edit-'+name).val()}) : sendData({skill: $('#edit-'+name).val()});
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
});