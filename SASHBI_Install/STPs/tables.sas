
proc sql;
 create table tables as
 select distinct libname, memname from dictionary.tables
 where libname="&libname"
 ;
quit;



%json4Slick(
	tableName=tables,
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
