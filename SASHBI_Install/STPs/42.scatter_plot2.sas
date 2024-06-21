%inc "C:\SASHBI\Macro\hbi_init.sas";


DATA WORK.PLOT;
	set sashelp.iris;
	id=_n_;
	group=species;
	GROUP_NAME=species;
	shape='circle';
	size=1;
	x=petallength; 
	y=petalwidth;
	drop species sepallength sepalwidth petallength petalwidth;
RUN;

%LET CLASS_VARS_NAME	=GROUP ;
%LET CLASS_VARS_LABEL	=GROUP_NAME ;

PROC SORT DATA=WORK.PLOT NODUPKEY OUT=UNIQ_CLASS;
	BY &CLASS_VARS_NAME GROUP_NAME SHAPE;
RUN;

%JSON4SCATTER(
	DATA						=WORK.PLOT,
	CLASS_INFO			=WORK.UNIQ_CLASS,
	CLASS_VAR_NAME	=&CLASS_VARS_NAME,
	CLASS_VAR_LABEL	=&CLASS_VARS_LABEL
);
