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
            operation: $("#operation").val(),
            period: $("#period").val(),
            units: $("#units").val(),
            ids:[]
        };

        $(".check_SManager").each(function(ind, item){
            var that = $(item);
            if (that.prop("checked")) targets.ids.push(that.val());
            if(targets.ids.length == 0){
                $("#salesManagerUnselectBeforeAddTarget").show().css({color:"red"});
            }
            else $("#salesManagerUnselectBeforeAddTarget").hide();
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

    $('.ajax_signup_manager').on('click', () => {
        function randString(n)
        {
            if(!n)
            {
                n = 5;
            }
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for(var i=0; i < n; i++)
            {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        if($("#manager_type").val() != null){
            var managerData = {
                ManagerType:$("#manager_type").val(),
                ManagerToken:randString(7)
            };
           }
        else $("#managerTypeUnselect").show().css({color:"red"});

        $.ajax({
            url: "/admin/manager_signup",
            method: "put",
            data: JSON.stringify(managerData),
            contentType : 'application/json',
            success: (data) => {
                window.location.href = '/admin/manager_signup/' + managerData.ManagerType + "?qs1=" + managerData.ManagerToken;
            },
            error: (data) => {
            }
        })
    });

    $('.ajax_delete_sales_manager').on('click', () => {
        var ids = [];
        $("input[class=check_SManager]").each( (ind, item) => {
            var that = $(item);
            if (that.prop("checked")) ids.push(that.val());

            if(ids.length == 0){
                $("#salesManagerUnselectBeforeDelete").show().css({color:"red"});
            }
            else $("#salesManagerUnselectBeforeDelete").hide();
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
            if(ids.length == 0){
                $("#targetUnselect").show().css({color:"red"});
            }
            else $("#targetUnselect").hide();
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
        var targets = {Status: status, ids:[]};

        $("input[class=check_Target]").each( (ind, item) => {
            var that = $(item);
            if (that.prop("checked")) {
                targets.ids.push(that.val());
            }
            if(targets.ids.length == 0){
                $("#targetUnselect").show().css({color:"red"});
            }
            else $("#targetUnselect").hide();
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

    $('.check_target_type').on('change', () => {
        var status = document.getElementById("target").value;
        if(status == "Ensure") $("#operationInput").show();
        else $("#operationInput").hide();
    });
});