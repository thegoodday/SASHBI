%inc "C:\SASHBI\Macro\hbi_init.sas";


	DATA WORK.BARCHART;
		SET SASHELP.CLASS;
		label=NAME;
		value=HEIGHT;
		KEEP label value;
	RUN;
	PROC JSON OUT=_webout PRETTY; 
		WRITE OPEN ARRAY;

			WRITE OPEN OBJECT; 
				WRITE VALUES key "Cumulative Return";
				WRITE VALUES "values";
				WRITE OPEN ARRAY;
					EXPORT WORK.BARCHART /  NOSASTAGS  ;
				WRITE CLOSE;
			WRITE CLOSE;
				
		WRITE CLOSE;
	RUN;
