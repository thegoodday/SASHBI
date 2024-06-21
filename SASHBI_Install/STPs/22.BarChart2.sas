%inc "C:\SASHBI\Macro\hbi_init.sas";


%LET CLASS_VARS	=COUNTRY ;
%LET ANAL_VARS	=ACTUAL ;

PROC SUMMARY DATA=HBIDEMO.PRDSALE(WHERE=(PRODUCT="&PRODUCT.")) MISSING NWAY;
	CLASS &CLASS_VARS;
	VAR 	&ANAL_VARS;
	OUTPUT OUT=WORK.TEMP SUM=;
RUN;
PROC SORT DATA=WORK.TEMP; BY &CLASS_VARS;
PROC TRANSPOSE DATA=WORK.TEMP OUT=WORK.TEMP_TRAN;
	VAR &ANAL_VARS;
	BY 	&CLASS_VARS;
RUN;
PROC SORT DATA=WORK.TEMP_TRAN NODUPKEY OUT=UNIQ_CLASS;
	BY &CLASS_VARS _NAME_;
RUN;

DATA WORK.GRAPH;
	SET WORK.TEMP_TRAN;
	y=COL1/1;
	x=&CLASS_VARS;
	anal_var="&ANAL_VARS";
	KEEP &CLASS_VARS _NAME_ x y anal_var;
RUN;	


%JSON4BAR(
	DATA						=WORK.GRAPH,
	CLASS_INFO			=WORK.UNIQ_CLASS,
	CLASS_VAR_NAME1	=&CLASS_VARS,
	CLASS_VAR_NAME2	=_NAME_,
	CLASS_VAR_LABEL	=_LABEL_
);
                       