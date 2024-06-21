
proc sql;
	create table work.library as
	select distinct libname
	from sashelp.vtable
	;
quit;

%json4Slick(
	tableName=work.library,
	columns	=%str(libname),
	width	=%str(90 90 90 90 90 
					90 90 90 90 90 
					120 120), 
	css		=%str(l c c l l l l l l l r r),
	sort	=%str(1 1 1 1 1 1 1 1 1 1 1 1),
	resize	=%str(1 1 1 1 1 1 1 1 1 1 0 0),
	enableCellNavigation=true, 
	enableColumnReorder=false, 
	multiColumnSort=true,
	forceFitColumns=true,
	chkbox=false
);
