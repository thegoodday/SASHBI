//State,Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over

//var stpURI="/SASStoredProcess/do?_program=%2FSTPRV_Demo%2FWebApplication%2F1.TEST%2Fd3Chart&prodtype=" + $("#sltprodtype option:selected").val() + "&product=" + $("#sltproduct option:selected").val();
//var stpURI="/SASStoredProcess/do?_program=%2FSTPRV_Demo%2FWebApplication%2F1.TEST%2Fd3Chart&prodtype=가정용&product=소파";
var stpURI="/SASStoredProcess/do?_program=SBIP://METASERVER/STPRV_Demo/WebApplication/1.TEST/d3Chart(StoredProcess)&_result=STREAMFRAGMENT&product=" + $("#sltproduct option:selected").val();
//var stpURI="/SASBITreeViewer/d3/data.csv";
$("svg").remove();
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(stpURI, function(error, data) {
  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "COUNTRY"; });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.COUNTRY; }));
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 3)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Amount");

  var COUNTRY = svg.selectAll(".COUNTRY")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.COUNTRY) + ",0)"; });

  COUNTRY.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});


/*
	$output1=$("#dvRes").html();
	$("#dvOutput1").html($output1);
	$("#dvOutput2").html("");
	
	$("#dvOutput1").height(eval($(window).height()-$("#dvCondi").height()-50));
	$("#dvOutput1").width(eval($("#dvOutput1").width()+17));

	//$sasExcelHTML=$("#dvRes").html();
	resizeFrame();
	$("#progressIndicatorWIP").hide();
	$("#dvRes").hide();
	$("#dvOutput").show();

*/