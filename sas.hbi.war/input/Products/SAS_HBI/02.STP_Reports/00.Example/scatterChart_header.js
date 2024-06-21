function setSlickGrid(data) {
    console.log('data', data);

    var colorArr = ["#ff7f0e","#2ca02c","#2222ff","#667711","#EF9CFB"]
    var shapes = ['thin-x', 'circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square']

    var groups = new Array();
    for (ii in data){
        groups.push(data[ii].Species);
    }
    //console.log("groups", groups);

    var groupArr = Array.from(new Set(groups));
    console.log("groupArr", groupArr);

    var scatterChartData = new Array();
    for (ii in groupArr){
        var species = groupArr[ii];
        console.log("groupArr[ii]", species);

        var group = new Object();
        group.color = colorArr[ii];
        group.key = groupArr[ii];
        var dataArr = new Array(); 
        for (jj in data){
            var ttss = data[jj][species];
            //console.log("sp in data", data[jj]);
            // x: 0.07271923762949094, y: -0.007109067142071829, size: 0.64, shape: 'thin-x', series: 1
            row = new Object();
            if (data[jj].Species == groupArr[ii]){
                row.x = data[jj].SepalWidth;
                row.y = data[jj].SepalLength;
                row.size = 1;
                row.shape = shapes[1];
                row.series = ii;
                dataArr.push(row);
            }
        }
        group.values = dataArr;
        scatterChartData[ii] = group;

    }
    console.log("scatterChartData", scatterChartData);
    displayMultiBarChart(scatterChartData);
}
function displayMultiBarChart(scatterChartData){
    nv.addGraph(function() {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .color(d3.scale.category10().range())
            .duration(300)
        ;
        chart.dispatch.on('renderEnd', function(){
            console.log('render complete');
        });

        chart.xAxis.tickFormat(d3.format('.02f'));
        chart.yAxis.tickFormat(d3.format('.02f'));

        d3.select('#nvChart svg')
            .datum(scatterChartData)
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });
        return chart;
    });
}