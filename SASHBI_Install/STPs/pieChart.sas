options validvarname=any;

proc sql;
	create table work.piechart as
	select product as key, 
		sum(actual) as y
	from sashelp.prdsale
	group by 1;
quit;

proc json out=_webout pretty;  
   	export work.piechart / fmtchar fmtdt  nosastags ;
run;

options set=PGCLIENTENCODING UTF8;
libname PG odbc dsn=postgres user=dbmsowner password='sask@123'  ;



data work.kk;
	set pg.hw_board_mst;
run;
