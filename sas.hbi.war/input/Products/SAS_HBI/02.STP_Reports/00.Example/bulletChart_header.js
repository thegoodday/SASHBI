function setSlickGrid(data) {
    console.log('data', data);

    $("#nvChart").html("");
    displayBulletChart(data);
}
function displayBulletChart(data){
    var chart;
    nv.addGraph(function() {


        var width = 960,
        height = 80,
        margin = { top: 5, right: 40, bottom: 20, left: 120 };

        chart = nv.models.bulletChart()
                    //.width(width - margin.right - margin.left)
                    .height(height - margin.top - margin.bottom)
                    ;

        var vis = d3.select("#nvChart").selectAll("svg")   
        //var vis = d3.select("#nvChart svg")
          .data(data)
          .enter()
          .append("svg")
          .attr("class", "bullet nvd3")
          //.attr("width", width)
          .attr("height", height);

        vis.call(chart);        
        
        return chart;
    });
}
