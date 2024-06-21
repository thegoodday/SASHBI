function setSlickGrid(data) {
    console.log('data', data);

    
    var colorArr = ["#ff7f0e","#2ca02c","#2222ff","#667711","#EF9CFB"]

    var pieChartData = data;
    for (ii in data){
        var rowArr = data[ii]
    }
    console.log("pieChartData", pieChartData);
    displaypieChart(pieChartData);
}
function displaypieChart(pieChartData){
    var height = 350;
    var width = 350;

    nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            .width(width)
            .height(height)
            .valueFormat(d3.format(',d'))
            //.labelFormat(d3.format(',.2f'))
            .showLabels(true)       //Display pie labels
            .labelThreshold(0.05)   // hide label if slice is < 5%
            .labelType("value")     //Configure what type of data to show in the label. Can be "key", "value" or "percent"
            .donut(true)            //Turn on Donut mode. Makes pie chart look tasty!
            .donutRatio(0.35)        //Configure how big you want the donut hole size to be.
            .showTooltipPercent(true);
            
        d3.select('#nvChart svg')
            .datum(pieChartData)
            .transition().duration(1200)
            .attr('width', width)
            .attr('height', height)
            .call(chart);

        /*
        // update chart data values randomly
        setInterval(function() {
            testdata2[0].y = Math.floor(Math.random() * 10);
            testdata2[1].y = Math.floor(Math.random() * 10);
            chart.update();
        }, 4000);
        */
        return chart;
    });
}