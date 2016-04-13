$(document).ready(function () {

    var tableNumber = 1;
    var tablesCount = ['developersForPorjectsTableBody'];
    rowSort();

    function rowSort(){
        tablesCount.forEach( function(tableClass, tablesCount) {
            var number = 0;
            if($('.table-fill').children().hasClass(tableClass)){
                $('.table-fill').children("."+tableClass).children('.projManagerTablesCount').each( function(i) {
                    number = i + 1;
                    $(this).find('td:first').text(number);
                });

            }
        });
    }

    $(".sortTable").each(function (index, item) {
        $("#sortTable"+tableNumber).tablesorter({
        });
        $("#sortTable"+tableNumber).paging({limit:2});
        tableNumber++;
    });

    $(".tabs li").on('click', function(){
        var index = $(this).index();
        $('.tab').removeClass('active');
        $('.tab:eq('+index+')').addClass('active');
    });

    $('.ajax_signup_developer_to_project').on('click', function () {
        var result = $(this).attr("data").split(" ");
        var developerId = {developerBody : {developerId: result[0]}, projectId: result[1]};
        $.ajax({
            url: "/project-manager",
            method: "put",
            data: JSON.stringify(developerId),
            contentType : 'application/json',
            success: (data) => {
                var id = $(this).attr("data");
                $('[data="' + id + '"]').parents('tr').remove();
                rowSort();
            },
            error: (data) => {
            }
        })
    });
});

