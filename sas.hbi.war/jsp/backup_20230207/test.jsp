
<!DOCTYPE HTML>





<html lang=ko>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script src="/SASHBI/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/SASHBI/scripts/jquery/ui/jquery-ui.custom.js"></script>
	<script src="/SASHBI/scripts/jquery/bitreeviewer.js"></script>

	<script src="/SASHBI/scripts/SlickGrid/lib/firebugx.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/lib/jquery.event.drag-2.2.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.autotooltips.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellcopymanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellrangedecorator.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellrangeselector.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellselectionmodel.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellexternalcopymanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.checkboxselectcolumn.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.rowmovemanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.rowselectionmodel.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/controls/slick.columnpicker.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.core.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.formatters.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.editors.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.grid.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.dataview.js"></script>
	<script src="/SASHBI/scripts/pvt/dist/pivot.js"></script>
	
	<script src="/SASHBI/scripts/d3/d3.min.js"></script>
	<script src="/SASHBI/scripts/nvd3/build/nv.d3.js"></script>
	<script src="/SASHBI/scripts/saveSvgAsPng/saveSvgAsPng.js"></script>
	
	
<!--	
	<script src="/SASHBI/scripts/canvg-master/rgbcolor.js"></script>
	<script src="/SASHBI/scripts/canvg-master/StackBlur.js"></script>
	<script src="/SASHBI/scripts/canvg-master/canvg.js"></script>
	<script src="/SASHBI/scripts/canvg-master/StackBlur.js"></script>

	<script src="/SASHBI/scripts/nvd3/lib/d3.v3.js"></script>
	<script src="/SASHBI/scripts/nvd3/nv.d3.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/tooltip.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/utils.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/interactiveLayer.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/legend.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/axis.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/scatter.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/line.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/lineChart.js"></script>	
	<script src="/SASHBI/scripts/nvd3/src/models/pie.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/pieChart.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/discreteBar.js"></script>
	<script src="/SASHBI/scripts/nvd3/src/models/discreteBarChart.js"></script>
-->	

	<!--script src="/SASHBI/jquery/js/protectCode.js"></script-->

	<link rel=stylesheet href="/SASHBI/styles/HtmlBlue.css">
	<link rel=stylesheet href="/SASHBI/styles/Portal.css" type="text/css" />
	<link rel=stylesheet href="/SASHBI/styles/custom.css" type="text/css" />

	<link rel="stylesheet" href="/SASHBI/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/start/jquery.ui.all.css">



	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/SlickGrid/slick.grid.css">
	<!--link rel="stylesheet" type="text/css" href="/SASHBI/scripts/SlickGrid/slick-default-theme.css"-->
	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/pvt/dist/pivot.css">
	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/nvd3/build/nv.d3.css">
	<!--link rel="stylesheet" type="text/css" href="/SASHBI/scripts/nvd3/src/nv.d3.css"-->

</head>
<body>
  <div style="width:600px;">
    <div id="myGrid" style="width:100%;height:500px;"></div>
  </div>	

<script>
  var grid;
  var grid2;
  var data = [];
  var data2 = [];
  
  var options = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
  };



  var undoRedoBuffer = {
      commandQueue : [],
      commandCtr : 0,

      queueAndExecuteCommand : function(editCommand) {
        this.commandQueue[this.commandCtr] = editCommand;
        this.commandCtr++;
        editCommand.execute();
      },

      undo : function() {
        if (this.commandCtr == 0)
          return;

        this.commandCtr--;
        var command = this.commandQueue[this.commandCtr];

        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
          command.undo();
        }
      },
      redo : function() {
        if (this.commandCtr >= this.commandQueue.length)
          return;
        var command = this.commandQueue[this.commandCtr];
        this.commandCtr++;
        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
          command.execute();
        }
      }
  }

  // undo shortcut
  $(document).keydown(function(e)
  {
    if (e.which == 90 && (e.ctrlKey || e.metaKey)) {    // CTRL + (shift) + Z
      if (e.shiftKey){
        undoRedoBuffer.redo();
      } else {
        undoRedoBuffer.undo();
      }
    }
  });

  var pluginOptions = {
    clipboardCommandHandler: function(editCommand){ undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer,editCommand); },
    includeHeaderWhenCopying : false
  };

  var columns = [
    {
      id: "selector",
      name: "",
      field: "num",
      width: 30
    }
  ];

  for (var i = 0; i < 26; i++) {
    columns.push({
      id: i,
      name: String.fromCharCode("A".charCodeAt(0) + i),
      field: i,
      width: 60,
      editor: Slick.Editors.Text
    });
  }
  
  columns[4] = {id: "%", name: "% Complete", field: "percentComplete", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete};
  columns[5] = {id: "start", name: "Start", field: "start", minWidth: 60, editor: Slick.Editors.Date};
 

  $(function () {
    for (var i = 0; i < 100; i++) {
      var d = (data[i] = {});
      d["num"] = i;
      for (var j = 0; j < 26; j++) {
        d[j] = j+i;
      }
      d["percentComplete"] = Math.round(Math.random() * 100);
      d["start"] = new Date(Math.round(Math.random() * 1000000000));
      d["weekCalendar"] = [true, true, true, true, true, true, true, true, true, true, false, false, false, false];
    }
    
    grid = new Slick.Grid("#myGrid", data, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());
    grid.registerPlugin(new Slick.AutoTooltips());

    // set keyboard focus on the grid
    grid.getCanvasNode().focus();

    grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
    

    grid.onAddNewRow.subscribe(function (e, args) {
      var item = args.item;
      var column = args.column;
      grid.invalidateRow(data.length);
      data.push(item);
      grid.updateRowCount();
      grid.render();
    });
    
    grid2 = new Slick.Grid("#myGrid2", data, columns, options);
    grid2.setSelectionModel(new Slick.CellSelectionModel());
    
    grid2.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
  })
</script>  
</body>
</html>
