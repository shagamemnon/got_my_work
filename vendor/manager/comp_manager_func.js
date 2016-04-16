$(document).ready(function () {

    var tableNumber = 1;
    var tablesCount = ['companyPorjectsTableBody'];
    rowSort();

    function rowSort(){
        tablesCount.forEach( function(tableClass, tablesCount) {
            var number = 0;
            if($('.table-fill').children().hasClass(tableClass)){
                $('.table-fill').children("."+tableClass).children('.compManagerTablesCount').each( function(i) {
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

    $('.ajax_confirm_project_completing').on('click', function () {
        var result = $(this).attr("data");
        var projectId = {developerId : result};
        $.ajax({
            url: "/company-manager",
            method: "put",
            data: JSON.stringify(projectId),
            contentType : 'application/json',
            success: (data) => {
                $(this).hide();
                $('#complete').text('Delivering');
            },
            error: (data) => {
            }
        })
    });
});