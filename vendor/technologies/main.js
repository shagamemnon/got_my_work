$(document).ready(function() {
    $("#add").on("click", function () {
        var technologies = [],
            rows = $('table tr');
        rows.each(function(ind, row){
            if(ind != 0)
                technologies.push($(row).text());
            if (ind == rows.length-1)
                $.ajax({
                    type: "POST",
                    url: "/technologies",
                    data: {technology:$('[name="technology"]').val()},
                    success: function (answer) {
                        $('table').append('<tr><td>'+$('[name="technology"]').val()+'</td></tr>');
                        console.log(answer);
                    },
                    dataType: "json"
                });
        });

    });
});