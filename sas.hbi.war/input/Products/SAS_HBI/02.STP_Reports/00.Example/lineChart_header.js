function setSlickGrid(data) {
    console.log('data', data);

    var colInfo = Object.keys(data[0]);
    //colInfo = Object.keys(data[0]).map((item) => item);
    //var colInfo = JSON.parse(JSON.stringify(keys));
    console.log(colInfo);

    var colorArr = ["#ff7f0e","#2ca02c","#2222ff","#667711","#EF9CFB"]
    var classVar = colInfo[0];              //'PRODUCT';
    //var analVars = colInfo.shift();         //['actual', 'predict']
    var analVars = new Array();
    for ( ii=1; ii<colInfo.length;ii++){
        analVars.push(colInfo[ii]);
    }
    console.log("classVar", classVar);
    console.log("analVars", analVars);

    /*
    area: true
    classed: "dashed"
    color:"#2ca02c"
    disabled:true
    key: "Cosine Wave"
    seriesIndex:1
    */
    var multiLineChartData = new Array();
    for (ii in analVars){
        var analVar = analVars[ii];
        var analArr = new Object();
        //analArr.area = false;
        //analArr.classed = "dashed";
        analArr.color = colorArr[ii];
        //analArr.disabled = false;
        analArr.key = analVars[ii];
        analArr.seriesIndex = parseInt(ii);
        var dataArr = new Array();
        // {x: 0, y: 0.5, series: 1}
        for (jj in data){
            row = new Object();
            //row.x = data[jj][classVar];
            row.x = new Date(data[jj][classVar] + 'T00:00:00');
            row.y = data[jj][analVar];
            row.series = ii;
            //row.key = analVar;
            dataArr.push(row);
        }
        analArr.values = dataArr;
        multiLineChartData[ii] = analArr;
    }
    console.log("multiLineChartData", multiLineChartData);
    displayMultiLineChart(multiLineChartData);
}
var chart;

function displayMultiLineChart(multiLineChartData){
    nv.addGraph(function() {
        chart = nv.models.lineChart()
            .options({
                //duration: 300,
                //useInteractiveGuideline: true
            })
            .color(d3.scale.category10().range())
            //.interpolate("basis") 
            .showLegend(true)
            .showYAxis(true) 
            .showXAxis(true)
        ;

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel("Products")
            .tickFormat(function(d) { 
                var kk = new Date(d);
                console.log("d==============", d, kk);
                //return d3.time.format('%y')(new Date(d.date)); 
                return d3.time.format('%Y-%m')(kk); 
            })
            //.tickFormat(function(d) { return d3.time.format('%y%m%d')(new Date(d + "T00:00:00")); })
            //.tickFormat(d3.format('d'))
            //.staggerLabels(true)
        ;

        /*
        chart.yAxis
            .axisLabel('Voltage (v)')
            .tickFormat(function(d) { 
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            })
        ;
        */

        //data = sinAndCos();
        console.log('data',multiLineChartData);

        d3.select('#nvChart svg')
        //d3.select('#nvChart').append('svg')
            .datum(multiLineChartData)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}