options validvarname=any;

data work.target;
	set &libname..&memname;
run;


%macro genCSS_WIDTH(libname=, memname=);
	%global col_width col_css;
	%let libname = %upcase(&libname);
	%let memname = %upcase(&memname);
	data work.cont;
		set 
			sashelp.vcolumn(
				where=(
					libname = "&libname" 
					and memname = "&memname"
				)
			) 
		;
		if type eq 'num' then css='r';
		else css='l';
		width = int(length * 10);
		keep css width;
	run;

	proc sql noprint;
		select css into:col_css separated by ' '
		from work.cont;
		select width into:col_width separated by ' '
		from work.cont;
	quit;

	%put NOTE: &=col_css;
	%put NOTE: &=col_width;
%mend genCSS_WIDTH;
%genCSS_WIDTH(libname=work, memname=target);

%json4Slick(
	tableName=work.target,
	width	=%str(&col_width), 
	css		=%str(&col_css),
	sort	=%str(1 0 1 1 1 
					1 1 1 1 1 
					1 1 1 1 1 
					1 1 1 1 1 
				),
	resize	=%str(1 0 1 1 1 
					1 1 1 1 1 
					1 1 1 1 1 
					1 1 1 1 1 
				),
	enableCellNavigation=true, 
	enableColumnReorder=false, 
	multiColumnSort=false,
	forceFitColumns=true,
	chkbox=false
);
/*

	css		=%str(l l l l c
					l l c l l
					l l l l l
					l l l l l
				),
*/
