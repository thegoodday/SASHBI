%*let libname=HBIDEMO;
proc sql;
	create table work.tableList as
	select distinct libname, memname
	from sashelp.vtable
	where libname eq "&libname"
	;
quit;



%json4Slick(
	tableName=work.tableList,
	columns	=%str(memname),
	width	=%str(90 90 90 90 90 90 90 90 90 90 120 120), 
	css		=%str(l c c l l l l l l l r r),
	sort	=%str(1 1 1 1 1 1 1 1 1 1 1 1),
	resize	=%str(1 1 1 1 1 1 1 1 1 1 0 0),
	enableCellNavigation=true, 
	enableColumnReorder=false, 
	multiColumnSort=true,
	forceFitColumns=true,
	chkbox=false
);
