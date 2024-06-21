
%macro webout;
libname _save "&save_path.";

ods html file=_webout (no_top_matter no_bottom_matter);
	DATA _save.PRDSALE;
		SET sashelp.PRDSALE;
		OBS=_N_;
		format ACTUAL PREDICT comma10.;
	RUN;	
	TITLE H=20 "&COUNTRY / &PRODTYPE / &PRODUCT";
	TITLE H=6 "COUNTRY : &COUNTRY_TXT PRODTYPE : &PRODTYPE_TXT PRODUCT : &PRODUCT_TXT";
	TITLE2 J=R "&DATE";
	PROC PRINT DATA=_save.PRDSALE(OBS=100) NOOBS LABEL ;
		VAR OBS			/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX BACKGROUNDCOLOR=#EDF2F9} style(header)={TEXTALIGN=CENTER width=50px};
		VAR YEAR		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=50px};
		VAR QUARTER		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=100px};
		VAR COUNTRY		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR REGION		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR DIVISION	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR PRODTYPE	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR PRODUCT		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR ACTUAL		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR PREDICT		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};

		VAR QUARTER		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=100px};
		VAR COUNTRY		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR REGION		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR DIVISION	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR PRODTYPE	/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR PRODUCT		/style(data)={TEXTALIGN=CENTER CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR ACTUAL		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};
		VAR PREDICT		/style(data)={TEXTALIGN=RIGHT  CELLPADDING=5PX } style(header)={TEXTALIGN=CENTER width=120px};		
	RUN;
ods html close;
*dd;
%mend webout;
%webout;
