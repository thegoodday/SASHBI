function setSlickGrid(data) {
    console.log('data', data);

    var colInfo = Object.keys(data[0]);
    //colInfo = Object.keys(data[0]).map((item) => item);
    //var colInfo = JSON.parse(JSON.stringify(keys));
    console.log(colInfo);


    var classVar = colInfo[0];              //'PRODUCT';
    //var analVars = colInfo.shift();         //['actual', 'predict']
    var analVars = new Array();
    for ( ii=1; ii<colInfo.length;ii++){
        analVars.push(colInfo[ii]);
    }
    console.log("classVar", classVar);
    console.log("analVars", analVars);

    var multiBarChartData = new Array();
    for (ii in analVars){
        var analVar = analVars[ii];
        var analArr = new Object();
        analArr.key = analVars[ii];
        var dataArr = new Array();
        for (jj in data){
            row = new Object();
            row.y = data[jj][analVar];
            row.x = data[jj][classVar];
            row.series = ii;
            row.key = analVar;
            dataArr.push(row);
        }
        analArr.values = dataArr;
        multiBarChartData[ii] = analArr;
    }
    console.log("multiBarChartData", multiBarChartData);
    displayMultiBarChart(multiBarChartData);
}
function displayMultiBarChart(multiBarChartData){
    var chart;
    nv.addGraph(function() {
        chart = nv.models.multiBarChart()
            .barColor(d3.scale.category20().range())
            .duration(300)
            .margin({bottom: 100, left: 70})
          //  .rotateLabels(45)
            .groupSpacing(0.1)
        ;

        chart.reduceXTicks(false).staggerLabels(true);

        chart.xAxis
            .axisLabel("Product")
            .axisLabelDistance(35)
            .showMaxMin(false)
           // .tickFormat(d3.format(',.6f'))
        ;

        chart.yAxis
            //.axisLabel("Change in Furry Cat Population")
            .axisLabelDistance(-5)
            .tickFormat(d3.format(',.01f'))
        ;

        chart.dispatch.on('renderEnd', function(){
            nv.log('Render Complete');
        });

        d3.select('#nvChart svg')
            .datum(multiBarChartData)
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });
        chart.state.dispatch.on('change', function(state){
            nv.log('state', JSON.stringify(state));
        });

        return chart;
    });
}