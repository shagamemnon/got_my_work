$(document).ready(function(){
  $("#open-skill").click(function(){
     $("#input-skill input").attr("autofocus");
     $('#input-skill').animate({'opacity':'1'}, 300, 'linear');
     $('#input-skill').css('display','block');
     $('#input-skill input').css('background-image','none');
  });

  $('#close-skill').click(function(){
    $(this).closest('form').find("input[name=skill]").val("");
    $('#input-skill').animate({'opacity':'0'},50,'linear', function(){
        $('#input-skill').css('display','none');
        $("#input-skill input").attr("autofocus");
    });
  });
});