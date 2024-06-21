document.onkeydown = eventKeydown;
var cols,rows,isDraggedBetweenCells=!1,isMouseDown=!1,mouseDownCell,selectedRowspan,selectedColspan;
var $curCell;
function isInt(a){return/^\d+$/.test(a)}
Array.indexOf||(Array.prototype.indexOf=function(a){for(var e=0;e<this.length;e++)if(this[e]==a)return e;return-1});
function RemoveSelection(){window.getSelection?window.getSelection().removeAllRanges():document.selection.createRange&&(document.selection.createRange(),document.selection.empty())}
function getCellRows(a){return getCellValue(a,"r")}
function getCellOffset(a){return getCellValue(a,"o")}
function getCellCols(a){return getCellValue(a,"c")}
function getCellValue(a,e){
	var b=$(a).attr("class"),b=b.split(" ");
	allClassesLength=b.length;
	for(var c=0;c<allClassesLength;c++)
		b[c].charAt(0)===e?b[c]=parseInt(b[c].substr(1,b[c].length-1),10):(b.splice(c,1),allClassesLength--,c--);
	return b
}
function exportHTML(){
	$("th").addClass("c");
	$("th").addClass("m");
	$("th").addClass("header");
	var a=$("#tableWrap tbody").clone(),
	a=a.html(),
	//a=a.toLowerCase(),
	a=a.replace(/<div contenteditable="true">/gi,""),
	a=a.replace(/<div contenteditable=true>/gi,""),
	a=a.replace(/&nbsp;/gi,""),
	a=a.replace(/<\/div>/gi,""),
	a=a.replace(/\s\s\s/gi," "),
	a=a.replace(/\s\s/gi," "),
	a=a.replace(/<th\s>/gi,"<th>"),
	a=a.replace(/<tr>\s<th/gi,"<tr><th"),
	a=a.replace(/> <\/th>/gi,"></th>"),
	a=a.replace(/<\/th>\s</gi,"</th><"),
	a=a.replace(/<tr>/gi,"\n    <tr>\n"),
	a=a.replace(/<\/tr>/gi,"\n    </tr>"),
	a=a.replace(/d><th/gi,"d>\n<th"),
	a=a.replace(/<th/gi,"        <th"),
	a=a.replace(/<th>\s/gi,"<th>"),
	a=a.replace(/\s>\s/gi,">"),
	a=a.replace(/" >/gi,'">');
	$("#export").val("<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>"+a+"\n</table>");
	console.log("exportHTML");
}

function reindexTable(){
	rows=$("#rows").val();
	cols=$("#cols").val();
	for(var a=[],e=[],b=0;b<cols;b++)
		a[b]="c"+b;
	for(b=0;b<rows;b++)e[b]=a.slice();
	for(var a=$("tr"),c,g,f,i,b=0;b<rows;b++){
		c=a.eq(b).children();g=c.size();
		for(var j=colOffset=0;j<g;j++){
			c.eq(j).removeClass();
			f=parseInt(c.eq(j).attr("colspan"),10);
			i=parseInt(c.eq(j).attr("rowspan"),10);
			void 0==c.eq(j).attr("colspan")&&(f=1);
			void 0==c.eq(j).attr("rowspan")&&(i=1);
			for(var h=0;h<i;h++)
				for(var o=0;o<f;o++){
					for(var k=0;""===e[b+h][o+colOffset+k];)
						k++;c.eq(j).addClass(e[b+h][o+colOffset+k]+" r"+(b+h));e[b+h].splice(o+k+colOffset,1,"")
				}
			colOffset+=f
		}
	}
}
$(function(){
	if ($("#tableWrap").html().length > 10) {
		cols=0;
		$("#tableWrap tr:first").find("th").each(function(index){
			colspan=$(this).attr("colspan");
			if(!isNaN(parseInt($(this).attr("colspan")))){
				cols=eval(parseInt(cols)+parseInt($(this).attr("colspan")));
			} else {
				cols=eval(parseInt(cols)+1);
			}	
		});
		$("#cols").val(cols);
		rows=$("#tableWrap tr").length;
		$("#rows").val(rows);
		$("#tableWrap th").each(function( index ){
			var valText=$(this).html();
			valText="<div contenteditable='true'>"+valText+"</div>";
			$(this).html(valText);
		});
		$("#export").val($("#tableWrap").html());
		exportHTML();
	}

	$("#generate").on("click",function(){
		cols=parseInt($("#cols").val(),10);
		rows=parseInt($("#rows").val(),10);
		if(isInt(cols))if(isInt(rows)){
			$("#tableWrap").empty().append("<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>");
			for(var a=1;a<=rows;a++){
				$("table").append("<tr></tr>");
				$generatedRow=$("tr").eq(a-1);
				for(var e=1;e<=cols;e++)
					$generatedRow.append("<th class='c"+(e-1)+" r"+(a-1)+"' colspan='1' rowspan='1'><div contenteditable='true'>&nbsp;</div></th>")
			}
			exportHTML();
		} else alert("Invalid row input");
		else alert("Invalid column input")
	});
	//$("#generate").trigger("click")
});
function selectCells(a,e){
	for(var b=getCellCols(a),c=getCellRows(a),g=getCellCols(e),f=getCellRows(e),i=b.length,j=c.length,h=g.length,o=f.length,k=100,l=0,m=100,n=0,d=0;d<i;d++)
		b[d]<k&&(k=b[d]),b[d]>l&&(l=b[d]);
	for(d=0;d<h;d++)g[d]<k&&(k=g[d]),g[d]>l&&(l=g[d]);
	for(d=0;d<j;d++)c[d]<m&&(m=c[d]),c[d]>n&&(n=c[d]);
	for(d=0;d<o;d++)f[d]<m&&(m=f[d]),f[d]>n&&(n=f[d]);
	for(d=m;d<=n;d++)
		for(c=k;c<=l;c++)
			$(".c"+c).filter(".r"+d).addClass("s");
			do{
				b=!1;
				f=$(".s");
				i=f.size();
				g=[];
				c=[];
				for(d=0;d<i;d++)
					g=g.concat(getCellCols(f.eq(d))),
					c=c.concat(getCellRows(f.eq(d)));
				d=Math.max.apply(Math,g);
				g=Math.min.apply(Math,g);
				f=Math.max.apply(Math,c);
				c=Math.min.apply(Math,c);
				d>l&&(l=d,b=!0);
				g<k&&(k=g,b=!0);
				f>n&&(n=f,b=!0);
				c<m&&(m=c,b=!0);
				if(b)for(d=m;d<=n;d++)for(c=k;c<=l;c++)$(".c"+c).filter(".r"+d).addClass("s");
				else selectedColspan=l-k+1,selectedRowspan=n-m+1
			}
			while(b)
}
$(function(){
	$("th").live("mousedown",function(a){
		1===a.which&&(RemoveSelection(),isMouseDown=!0,mouseDownCell=this)
	});
	$("th").live("mousemove",function(){
		isMouseDown&&mouseDownCell!=this&&(isDraggedBetweenCells=!0,RemoveSelection(),$(".s").removeClass("s"),selectCells(mouseDownCell,this))}
	);
	$(document).on("mouseup",function(){
		isMouseDown&&(isMouseDown=!1,mouseDownCell=void 0,isDraggedBetweenCells=!1)}
	);
	$("#tableWrap").on("mousedown",function(a){1===a.which&&$(".s").removeClass("s")})
	$("#tableWrap").keypress(function(event){
	})
});
function getLowestCol(a){a=getCellCols(a);return Math.min.apply(Math,a)}
function optimiseColspan(){
	var a,e,b=$("tr"),c=b.size(),g,f,i,j,h=[];
	for(a=0;a<cols;a++)h[a]=a+1;
	for(e=0;e<c;e++){
		g=b.eq(e).children();
		f=g.size();
		for(a=0;a<f;a++)
			i=getLowestCol(g.eq(a)),
			j=void 0==g.eq(a).attr("colspan")?1:parseInt(g.eq(a).attr("colspan"),10),-1!==h.indexOf(i+j)&&h.splice(h.indexOf(i+j),1);if(1>h.length)break
	}
	cols-=h.length;
	for(a=0;a<h.length;a++){
		b=".c"+(h[a]-1);
		$classArray=$(b);
		$classArrayL=$classArray.size();
		for(c=0;c<$classArrayL;c++)b=parseInt($classArray.eq(c).attr("colspan"),10),$classArray.eq(c).attr("colspan",b-1)
	}
}
function optimiseRowspan(){
	for(var a=$("tr:empty"),e=a.length,b,c,g,f,i=0;i<e;i++){
		b=$("tr").index(a.eq(i));
		b=$(".r"+b);c=b.length;
		for(f=0;f<c;f++)g=b.eq(f).attr("rowspan")-1,b.eq(f).attr("rowspan",g)
	}
	rows-=$("tr:empty").size();$("tr:empty").remove()
}
function mergeCells(){
	for(var a=$(".s"),e=a.length,b="",c=0;c<e;c++)
		b+=" "+a.eq(c).attr("class");
	b=b.replace(/s/gi,"");
	selectedColspan===cols&&(rows=rows-selectedRowspan+1,selectedRowspan=1);
	a.eq(0).before("<th class='"+b+"' colspan='"+selectedColspan+"' rowspan='"+selectedRowspan+"'><div contenteditable='true'>&nbsp;</div></th>");
	a.remove();
	selectedColspan===cols&&$("tr:empty").remove();
	reindexTable();
	optimiseRowspan();
	optimiseColspan();
	reindexTable();
	exportHTML();	
}
$(function(){$("#merge").on("click",function(){mergeCells();renewRowCol();})});
$(function(){$("div").live("blur",function(){exportHTML()});
$("th").live("click",function(){$(this).children("div").focus();$curCell=$(this);})});
$(function(){$("#getHeader").on("click",function(){getHeader();})});	
$(function(){$("#addRow").on("click",function(){addRow();})});	
$(function(){$("#addCol").on("click",function(){addColumn();})});	
$(function(){$("#csplit").on("click",function(){cellColSplit();})});	
$(function(){$("#rsplit").on("click",function(){cellRowSplit();})});	
function getHeader(){
	if ($("#import").val().length < 10 ) {
		alert("입수할 내용에 문제가 있습니다. \n확인하시고 다시 하시기 바랍니다.");
		return;
	}
	$("#dvDummy").html("");
	$("#dvDummy").html($("#import").val());
	
	$("#dvDummy th").each(function(){
		var curVal=$(this).html();
		$(this).html("<div contenteditable='true'>"+curVal+"</div>");
	})
	var cols=0;
	$("#dvDummy tr:first").find("th").each(function(index){
		colspan=$(this).attr("colspan");
		if(!isNaN(parseInt($(this).attr("colspan")))){
			cols=eval(parseInt(cols)+parseInt($(this).attr("colspan")));
		} else {
			cols=eval(parseInt(cols)+1);
		}
	});
	console.log(cols);
	$("#cols").val(cols);
	rows=$("#dvDummy tr").length;
	$("#rows").val(rows);

	$("#tableWrap").html($("#dvDummy").html());
	reindexTable();
	exportHTML();
	$("#dvDummy").html("");	//exportHTML();
}
function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    var mseconds = currentTime.getTime()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM " + mseconds
    } else {
        str += "AM " + mseconds
    }
    return str;
}
function addRow(){
	$("#dvDummy").html($("#export").val());
	$("#dvDummy tbody").append("<tr></tr>");
	for(var ii=0;ii<$("#cols").val();ii++){
		$("#dvDummy tr:last").append("<th></th>");
	}
	$("#dvDummy th").each(function(){
		var curVal=$(this).html();
		$(this).html("<div contenteditable='true'>"+curVal+"</div>");
	})
	
	$("#tableWrap").html($("#dvDummy").html());
	$("#rows").val(eval(parseInt($("#rows").val())+1));
	renewRowCol();
	reindexTable();
	exportHTML();
	$("#dvDummy").html("");	//exportHTML();
}
function addColumn(){
	$("#dvDummy").html($("#export").val());
	$("#dvDummy tr").each(function(index){
		$(this).append("<th></th>");
	})
	$("#dvDummy th").each(function(){
		var curVal=$(this).html();
		$(this).html("<div contenteditable='true'>"+curVal+"</div>");
	})
	
	$("#tableWrap").html($("#dvDummy").html());
	$("#cols").val(eval(parseInt($("#cols").val())+1));
	renewRowCol();
	reindexTable();
	exportHTML();
	$("#dvDummy").html("");	//exportHTML();	
}
function cellColSplit(){
	var colspan=eval($curCell.attr("colSpan")-1);
	if (colspan < 1) colspan=1;
	$curCell.attr("colSpan",colspan);
	$curCell.after("<th><div contenteditable='true'> </div></th>");
	renewRowCol();
	reindexTable();
	exportHTML();
}
function cellRowSplit(){
	var rowspan=eval($curCell.attr("rowSpan")-1);
	if(rowspan < 1) rowspan=1;
	$curCell.attr("rowSpan",rowspan);
	//$curCell.after("<th><div contenteditable='true'> </div></th>");
	renewRowCol();
	reindexTable();
	exportHTML();
}
function renewRowCol(){
	var cols=0;
	$("#tableWrap tr:first").find("th").each(function(index){
		colspan=$(this).attr("colspan");
		if(!isNaN(parseInt($(this).attr("colspan")))){
			cols=eval(parseInt(cols)+parseInt($(this).attr("colspan")));
		} else {
			cols=eval(parseInt(cols)+1);
		}
	});
	$("#cols").val(cols);
	rows=$("#tableWrap tr").length;
	$("#rows").val(rows);
}
function eventKeydown() {
	if (event.keyCode == 46)  {
		mergeCells();
		renewRowCol();
	}
}