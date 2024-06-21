%inc "C:\SASHBI\Macro\hbi_init.sas";




%MACRO GET_DATA;
	%IF &SPECIES = %THEN %DO;
		DATA WORK.IRIS;
			LENGTH SPECIES $20 SEPALLENGTH SEPALWIDTH PETALLENGTH PETALWIDTH 8;
			SET SASHELP.IRIS;
		RUN;
	%END;
	%ELSE %DO;
		DATA WORK.IRIS;
			LENGTH SPECIES $20 SEPALLENGTH SEPALWIDTH PETALLENGTH PETALWIDTH 8;
			SET SASHELP.IRIS(WHERE=(PETALLENGTH=&PETALLENGTH AND PETALWIDTH=&PETALWIDTH));
			*if _n_ eq &SPECIES;
		RUN;
	%END;

%MEND GET_DATA;
%GET_DATA;


%json4Slick(
	tableName=work.iris,
	columns	=%str(SPECIES SEPALLENGTH SEPALWIDTH PETALLENGTH PETALWIDTH),
	width	=%str(120 120 120 120 120 90 90 90 90 120 120), 
	css		=%str(l r r r r r r r),
	sort	=%str(1 1 1 1 1 1 1 1 1 1 1),
	resize	=%str(1 1 1 1 1 1 1 1 1 0 0),
	enableCellNavigation=true, 
	enableColumnReorder=false, 
	multiColumnSort=true
);
/*
*/
