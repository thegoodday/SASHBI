
var columns = [
  {id: "title", name: "title", field: "title", width: 220, cssClass: "cell-title",formatter: TaskNameFormatter, editor: Slick.Editors.Text},
  {id: "_FREQ_", name: "_FREQ_", field: "_FREQ_", width: 120, cssClass: "r"},
  {id: "ACTUAL", name: "ACTUAL", field: "ACTUAL", width: 120, cssClass: "r"},
  {id: "PREDICT", name: "PREDICT", field: "PREDICT", width: 120, cssClass: "r"}
];
var options = {
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true,
  asyncEditorLoading: false
};


function myFilter(item) {
  if (item.parent != null) {
    var parent = data[item.parent];
	ii=0;
    while (parent) {
      if (parent._collapsed || (parent["percentComplete"] < percentCompleteThreshold) || (searchString != "" && parent["title"].indexOf(searchString) == -1)) {
        return false;
      }
	  ii++;	
      parent = data[parent.parent];
	  if (ii>220)  parent=0;
    }
  }
  return true;
}

function percentCompleteSort(a, b) {
  return a["percentComplete"] - b["percentComplete"];
}

$(function () {
  // prepare the data
  //var data=eval("(" + $sasResHTML + ")");
  data=eval( $sasResHTML );
  console.log("Data: \n " + JSON.stringify(data));

  // initialize the model
  dataView = new Slick.Data.DataView({ inlineFilters: true });
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilter(myFilter);
  dataView.endUpdate();


  // initialize the grid
  grid = new Slick.Grid("#sasGrid", dataView, columns, options);

  grid.onCellChange.subscribe(function (e, args) {
    dataView.updateItem(args.item.id, args.item);
  });

  grid.onAddNewRow.subscribe(function (e, args) {
    var item = {
      "id": "new_" + (Math.round(Math.random() * 10000)),
      "indent": 0,
      "title": "New task",
      "duration": "1 day",
      "percentComplete": 0,
      "start": "01/01/2009",
      "finish": "01/01/2009",
      "effortDriven": false};
    $.extend(item, args.item);
    dataView.addItem(item);
  });

  grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass("toggle")) {
      var item = dataView.getItem(args.row);
      if (item) {
        if (!item._collapsed) {
          item._collapsed = true;
        } else {
          item._collapsed = false;
        }

        dataView.updateItem(item.id, item);
      }
      e.stopImmediatePropagation();
    }
  });


  // wire up model events to drive the grid
  dataView.onRowCountChanged.subscribe(function (e, args) {
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe(function (e, args) {
    grid.invalidateRows(args.rows);
    grid.render();
  });


  var h_runfilters = null;

})
