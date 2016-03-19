function getFile(){
 document.getElementById("upfile").click();
}
//function sub(obj){
//  var file = obj.value;
//  var fileName = file.split("\\");
//  document.getElementById("uploadimgbtn").innerHTML = fileName[fileName.length-1];
//  document.myForm.submit();
//  event.preventDefault();
//}

function previewFile() {
  var preview = document.getElementById('avatar');
  var file    = document.querySelector('input[name=avatar]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
    $.ajax({
      method: "POST",
      dataType: "json",
      url: "/profile",
      data: {avatar: reader.result}
    }).done(function (ans) {
      console.log(ans);
    });
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}
$(document).ready(function() {
  $('[name="avatar"]').on('change', function () {
    previewFile();
  $('img#avatar').css('visibility', 'visible')
  });
});