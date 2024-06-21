
<div id="sasGrid" style="display:none;"></div>

<script>
var dataView;
var grid;
var data = [];
var percentCompleteThreshold = 0;
var searchString = "";

function requiredFieldValidator(value) {
  if (value == null || value == undefined || !value.length) {
    return {valid: false, msg: "This is a required field"};
  } else {
    return {valid: true, msg: null};
  }
}

var TaskNameFormatter = function (row, cell, value, columnDef, dataContext) {
  value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
  var idx = dataView.getIdxById(dataContext.id);


  if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
    if (dataContext._collapsed) {
      return spacer + " <span class='toggle expand'></span>&nbsp;" + value;
    } else {
      return spacer + " <span class='toggle collapse'></span>&nbsp;" + value;
    }
  } else {
    return spacer + " <span class='toggle'></span>&nbsp;" + value;
  }
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

function setSlickGridTree(sasResData) {
	
	$("#sasGrid").show();
	$("#progressIndicatorWIP").hide();
	
	//var sasJsonRes=eval ($sasResHTML)[0];
	var sasJsonRes=sasResData[0];
	
	
	var columns =[];
	columns=sasJsonRes["ColumInfo"];
	//console.log("columns: \n" + JSON.stringify(columns));
	
	var options=sasJsonRes["Options"][0];
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=sasResData;
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path);


  // prepare the data
  //var data=eval("(" + $sasResHTML + ")");
  //data=eval( $sasResHTML );
  data = sasJsonRes["SASResult"];
  //console.log("Data: \n " + JSON.stringify(data));

  // initialize the model
  dataView = new Slick.Data.DataView({ inlineFilters: true });
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilter(myFilter);
  dataView.endUpdate();


  // initialize the grid
  grid = new Slick.Grid("#sasGrid", dataView, columns, options);
  var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options); 

  grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass("toggle")) {
      var item = dataView.getItem(args.row);
      console.log("JSON.stringify(item) : " + JSON.stringify(item));
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
  console.log("data.length: " + data.length);  
  for (var kk=0;kk < data.length; kk++){
  	var item=data[kk];
  	if (item.indent > 3) {
	  	item._collapsed = true;
	  	dataView.updateItem(item.id, item);
	  	//console.log("item: " + JSON.stringify(item));
		}
  }

}

$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-50));
$("#sasGrid").width(eval($(window).width()-11));
$(window).resize(function() {
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-50));
	$("#sasGrid").width(eval($(window).width()-11));
	$(".slick-viewport").height(eval($("#sasGrid").height()-23));
});	
</script>  
<style>
.cell-title {
  font-weight: bold;
}

.cell-effort-driven {
  text-align: center;
}

.toggle {
  height: 9px;
  width: 9px;
  display: inline-block;
}

.toggle.expand {
  background: url(/<%=contextName%>/scripts/SlickGrid/images/expand.gif) no-repeat center center;
}

.toggle.collapse {
  background: url(/<%=contextName%>/scripts/SlickGrid/images/collapse.gif) no-repeat center center;
}
</style>

