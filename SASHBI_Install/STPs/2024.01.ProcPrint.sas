proc options group=languagecontrol;
run;
%macro webout;
	libname _save "&save_path.";
	%if "&param1" ne "ExcelDown" %then %do;
		ods html file=_webout (no_top_matter no_bottom_matter);
			DATA _save.PRDSALE;
				SET sashelp.class;
			RUN;	
			TITLE H=6 "COUNTRY : &COUNTRY_TXT PRODTYPE : &PRODTYPE_TXT PRODUCT : &PRODUCT_TXT";
			TITLE2 J=R %SYSFUNC(TODAY(),YYMMDD10.);	
			PROC PRINT DATA=_save.PRDSALE(OBS=max) NOOBS LABEL ;
			RUN;
		ods html close;
	%end;
	%else %if "&param1" eq "ExcelDown" %then %do;
		%*inc "/fssas/sasv94/SASHBI/Macro/kortsc/template_kbalm3.sas";

		ods escapechar="^";
		options urlencoding=utf8;
		ods excel file=_webout
			/* style=kbalm2 */
			options(
				sheet_interval="none"
				sheet_name="Report"
				embedded_titles="yes"
				frozen_headers="5"
				absolute_column_width="15,15,15,15,15,15,15,15,15,15,"
			)
		;

			PROC PRINT DATA=_save.PRDSALE(OBS=max) NOOBS LABEL ;
			RUN;
		ods excel close;
	%end;

%ExcelDown:

%exit:
%mend webout;
%webout;


		/*
		VAR OBS				/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX width=30px BACKGROUNDCOLOR=#EDF2F9} style(header)={TEXTALIGN=CENTER width=30px};
		VAR COUNTRY		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER width=100px};
		VAR REGION		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER width=100px};
		VAR DIVISION	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER WIDTH=100PX};
		VAR PRODTYPE	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER WIDTH=100PX};
		VAR PRODUCT		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER WIDTH=100PX};
		VAR ACTUAL		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER WIDTH=100PX};
		VAR PREDICT		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX width=200px} style(header)={TEXTALIGN=CENTER WIDTH=100PX};
		*/
