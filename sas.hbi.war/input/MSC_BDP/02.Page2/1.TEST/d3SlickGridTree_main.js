/*
{"id":2,"indent":1,"parent":1,"title":"Task_2","P_BAD1":0.93,"V_BAD1":0.93,"tprob":null,"vprob":null},
*/

var columns = [
  {id: "title", name: "Title", field: "title", width: 220, cssClass: "cell-title", formatter: TaskNameFormatter, editor: Slick.Editors.Text, validator: requiredFieldValidator},
  {id: "duration", name: "Duration", field: "duration", editor: Slick.Editors.Text},
  {id: "%", name: "% Complete", field: "percentComplete", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete},
  {id: "start", name: "Start", field: "start", minWidth: 60, editor: Slick.Editors.Date},
  {id: "finish", name: "Finish", field: "finish", minWidth: 60, editor: Slick.Editors.Date},
  {id: "effort-driven", name: "Effort Driven", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true}
];

var columns = [
  {id: "title", name: "title", field: "title", width: 220, cssClass: "cell-title",formatter: TaskNameFormatter, editor: Slick.Editors.Text},
  {id: "P_BAD1", name: "P_BAD1", field: "P_BAD1", width: 80, editor: Slick.Editors.Text},
  {id: "V_BAD1", name: "V_BAD1", field: "V_BAD1", width: 80, editor: Slick.Editors.Text},
  {id: "tprob", name: "tprob", field: "tprob", width: 80, editor: Slick.Editors.Text},
  {id: "vprob", name: "vprob", field: "vprob", width: 80, editor: Slick.Editors.Text}
];
var options = {
  editable: true,
  enableAddRow: true,
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
