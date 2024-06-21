%inc "C:\SASHBI\Macro\hbi_init.sas";

DATA WORK.PLOT;
	SET SASHELP.AIR;
		GRP_ID="Air";
	  X=Date*24*60*60*1000 - (365*10*24*60*60*1000) - (3*24*60*60*1000);
	  Y=air;
	  KEEP GRP_ID X Y;
RUN;



%JSON4LINE(
	DATA=WORK.PLOT,
	LINE_VAR=GRP_ID		
);
                       
