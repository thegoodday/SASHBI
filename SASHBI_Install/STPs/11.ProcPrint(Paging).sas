%inc "/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_init.sas";

%macro getData;
	%global pagenum;
	%if &pagenum = %then %do;
		DATA _SAVE.WEBDATA (DROP=I );
			LENGTH OBS 8;
		   ARRAY A{*} A01-A20;
		   SET HBIDEMO.PRDSALE(obs=max);
		   OBS=_N_;
		   DO I=1 TO 20;
		      *A{I}=INT(RANUNI(0)*1000000);
		      A{I}=RANUNI(0)*1000000;
		   END;

			format obs comma10.; 
		   label obs = "OBS";         
		   drop year quarter month ;
			format _numeric_ comma20.;
			format actual predict comma20.6;
			format a16 comma20.1;
			format a17 comma20.2;
			format a18 comma20.3;
			format a19 comma20.4;
			format a20 comma20.5;
		
		RUN;
	%end;
%mend;
%getData;

%pager_init(memname=_SAVE.WEBDATA);

ODS HTML FILE=_WEBOUT (NO_TOP_MATTER NO_BOTTOM_MATTER);
	PROC PRINT DATA=&tablename LABEL NOOBS;
		VAR OBS			/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX BACKGROUNDCOLOR=#EDF2F9} style(header)={WIDTH=40px TEXTALIGN=CENTER};
		VAR COUNTRY		/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX  WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR REGION		/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX  WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR DIVISION	/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX  WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR PRODTYPE	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR PRODUCT		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR ACTUAL		/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX  WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR PREDICT		/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX  WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};
		VAR A01-A20		/style(data)={TEXTALIGN=RIGHT CELLPADDING=5PX  WIDTH=90PX} style(header)={WIDTH=120px TEXTALIGN=CENTER};  
	RUN;
ODS HTML CLOSE;
%pager_main;
