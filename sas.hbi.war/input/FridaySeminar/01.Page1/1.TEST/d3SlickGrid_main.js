var grid;
var data = [];

var sasJsonRes=eval($sasResHTML)[0];

var columns =[];
columns=sasJsonRes["ColumInfo"];
var options=sasJsonRes["Options"][0];

$(function () {
	var data = [];
	data = sasJsonRes["SASResult"];
	
	grid = new Slick.Grid("#sasGrid", data, columns, options);
	grid.setSelectionModel(new Slick.CellSelectionModel());

	grid.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  grid.invalidateRow(data.length);
	  data.push(item);
	  grid.updateRowCount();
	  grid.render();
	});
});


