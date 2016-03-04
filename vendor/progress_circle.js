$(document).ready(function() {

    if($('.adminTablesCount').parent('.salesManagerBody'))
    $('.targetsCount').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);
    });

    var freelancersCount = 0;
    $('.freelancersCount').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);
        freelancersCount=number;

    });

    var companiesCount = 0;
    $('.companiesCount').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);
        companiesCount=number;

    });

    var projectsCount = 0;
    $('.projectsCount').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);
        projectsCount=number;

    });

    $('.container').each(function(index,value){
        var item = $(value);
        var progress = 0;
        if(item.text().indexOf("Enroll") == 0){
            progress = freelancersCount;
        }else{
            progress = projectsCount
        }
        var leftForSeccess = item.attr('name') - progress;
        var needForSeccess = item.attr('name');
        item.highcharts({
            chart: {
                plotBackgroundColor: 0,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: progress + '/' + needForSeccess,
                align: 'center',
                verticalAlign: 'middle',
                y: 0
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        distance: -12,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 270,
                    center: ['50%', '50%']
                }
            },
            series: [{
                type: 'pie',
                innerSize: '80%',
                size: '110%',
                data: [
                    {y:progress, name: 'Completed on', color: "blue"},
                    {y:needForSeccess-progress, name: 'Left',  color:'grey'}
                ]
            }]
        });
    });

    $('.highcharts-button').each(function(index,item){
        $(item).css('display', 'none');
    });
    $('.highcharts-background').each(function(index,item){
        $(item).css('fill', 'none');
    });
    $('text').each(function (index, item) {
        if ($(item).text() == 'Highcharts.com') $(item).css('display', 'none');
    });

});



