libname savea "&_savepath";
data _null_;
	rc = stpsrv_header('Content-type', 'application/vnd.ms-excel');
	rc = stpsrv_header('Content-disposition','attachment; filename="excel.xls"');
	rc = stpsrv_header('Pragma', 'nocache');
run;
proc sql;
	create table work.session_table as
	select distinct memname, memlabel
	from sashelp.vtable
	where upcase(libname) = 'SAVEA'
		and substr(upcase(memname),1,6) eq '_SAVE_'
	order by 1
	;
quit;

ods tagsets.excelxp file=_webout style=HTMLBlue 
		options(
			sheet_interval="none"
			sheet_name="Report"
			embedded_titles="yes"
			frozen_rowHeaders="yes"
			frozen_headers="yes"
		);
	TITLE "";
	
	%macro prtTable(memname,label);
		title "&label";
		proc print data=save.&memname label;
		run; 
	%mend;
	data _null_;
		set work.session_table;
		call execute('%prtTable('||memname||','||memlabel||');');
	run;


ods tagsets.excelxp  close;
