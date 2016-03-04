$(document).ready(function() {

     var tablesCount = ['salesManagerTableBody', 'freelancerTableBody', 'companyTableBody', 'projectTableBody', 'targetTableBody'];
     tablesCount.forEach( function(tableClass, tablesCount) {
         var number = 0;
         if($('.table-fill').children().hasClass(tableClass)){
             $('.table-fill').children("."+tableClass).children('.adminTablesCount').each( function(i) {
                 number = i + 1;
                 $(this).find('td:first').text(number);
             });

         }
    });

    var tableNumber = 1;
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

    $('#cancel_AllSManagers').on('click', function() {
        $('.check_SManager').each( function()  {
            $(this).prop('checked', false);
        });
    });

    $('#check_AllSManagers').on('click',  function() {
        $('.check_SManager').each(  function() {
            $(this).prop('checked', true);
        });
    });

    $('#cancel_AllTargets').on('click', function() {
        $('.check_Target').each( function() {
            $(this).prop('checked', false);
        });
    });

    $('#check_AllTargets').on('click', function() {
        $('.check_Target').each( function() {
            $(this).prop('checked', true);
        });
    });

    $('.ajax_create_target').on('click', function(){

        var targets = {
                target: $("#target").val(),
                amount: $("#amount").val(),
                type: $("#type").val(),
                period: $("#period").val(),
                units: $("#units").val(),
                ids:[]
        };

        $(".check_SManager").each(function(ind, item){
            var that = $(item);
            if (that.prop("checked"))
                targets.ids.push(that.val());
        });

        $.ajax({
            url: "/admin",
            method: "post",
            data: JSON.stringify(targets),
            contentType : 'application/json',
            success: (data) => {
                window.location.reload(true);
            },
            error: (data) => {
            }
        });
    });

    $('.ajax_delete_sales_manager').on('click', () => {
        var ids = [];
        $("input[class=check_SManager]").each( (ind, item) => {
            var that = $(item);
            if (that.prop("checked")) {
                ids.push(that.val());
            }
        });
        $.ajax({
            url: "/admin",
            method: "delete",
            data: JSON.stringify(ids),
            contentType : 'application/json',
            success: (data) => {
                var deleteSManager =  ids;
                deleteSManager.forEach( (id,deleteSManager) => {
                    $('[name=' +id + ']').parents('tr').remove();
                });
                window.location.reload(true)
            },
            error: (data) => {
            }
        })
    });


    $('.ajax_delete_target').on('click', () => {
        var ids = [];
        $("input[class=check_Target]").each( (ind, item) => {
            var that = $(item);
            if (that.prop("checked")) {
                ids.push(that.val());
            }
        });
        $.ajax({
            url: "/admin/target",
            method: "delete",
            data: JSON.stringify(ids),
            contentType : 'application/json',
            success: (data) => {
                var deleteTarget =  ids;
                deleteTarget.forEach( (id ,deleteTarget) => {
                    $('[name=' +id + ']').parents('tr').remove();
                });
            },
            error: (data) => {
            }
        })
    });

    $('.ajax_update_status').on('change', () => {
        var status = document.getElementById("change").value;
        var targets = {status: status, ids:[]};
        $("input[class=check_Target]").each( (ind, item) => {
            var that = $(item);
            if (that.prop("checked")) {
                targets.ids.push(that.val());
            }
        });
        $.ajax({
            url: "/admin/target",
            method: "put",
            data: JSON.stringify(targets),
            contentType : 'application/json',
            success: (data) => {
                var changeStatus =  targets.ids;
                changeStatus.forEach( (id ,changeStatus) => {
                    $('[name=' +id + ']').parents('tr').find('td:eq(5)').text(status);
                });
                $("#change").find('option:eq(0)').attr('selected','selected');
            },
            error: (data) => {
            }
        })
    });

    $('.ajax_update_status').on('select', () => {
        var status = document.getElementById("change").value;
        var targets = {status: status, ids:[]};
        $("input[class=check_Target]").each( (ind, item) => {
            var that = $(item);
            if (that.prop("checked")) {
                targets.ids.push(that.val());
            }
        });
        $.ajax({
            url: "/admin/target",
            method: "put",
            data: JSON.stringify(targets),
            contentType : 'application/json',
            success: (data) => {
                var changeStatus =  targets.ids;
                changeStatus.forEach( (id ,changeStatus) => {
                    $('[name=' +id + ']').parents('tr').find('td:eq(5)').text(status);
                });
                $("#change").find('option:eq(0)').attr('selected','selected')
            },
            error: (data) => {
            }
        })
    });
});