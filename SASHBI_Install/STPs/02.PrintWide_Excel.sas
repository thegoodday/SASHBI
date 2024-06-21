%macro webout;
    libname _save "&save_path.";

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
            /* absolute_column_width="15, 25, 25, 25, 25, 25, 25, 25, 15,15,15,15,15,15,15,15,15,15" */
        )
    ;

	TITLE H=20 "&COUNTRY / &PRODTYPE / &PRODUCT";
	TITLE H=6 "COUNTRY : &COUNTRY_TXT PRODTYPE : &PRODTYPE_TXT PRODUCT : &PRODUCT_TXT";
	TITLE2 J=R "&DATE";
	PROC PRINT DATA=_save.PRDSALE(OBS=100) NOOBS LABEL ;
		VAR OBS			/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX BACKGROUNDCOLOR=#EDF2F9} style(header)={TEXTALIGN=CENTER };
		VAR YEAR		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR QUARTER		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR COUNTRY		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR REGION		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR DIVISION	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR PRODTYPE	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR PRODUCT		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR ACTUAL		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR PREDICT		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };

		VAR QUARTER		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR COUNTRY		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR REGION		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR DIVISION	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR PRODTYPE	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR PRODUCT		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR ACTUAL		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };
		VAR PREDICT		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER };		
	RUN;
    ods excel close;

%mend webout;
%webout;
