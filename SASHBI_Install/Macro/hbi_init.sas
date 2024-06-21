proc options group=languagecontrol;run;
options nosource nosource2 notes ps=max validvarname=any;
%macro hbi_init;
	%let stime = %sysfunc(datetime());
	/* 
	filename cmd pipe "locale";
	data _null_;
		infile cmd;
		input;
		*put _infile_;
	run; 
	*/
	libname hbidemo '/sas/sasv94m8/config/Lev2/Applications/SASHBI/Data';
	%global save_path;
	%if "&save_path" eq "" %then %let save_path = /tmp;
	libname _save "&save_path";
	*libname rpt_lib 'C:\Projects\ALMDemo\ALMResults';
	*LIBNAME srpt POSTGRES  DBCLIENT_MAX_BYTES=1  PRESERVE_TAB_NAMES=YES  PRESERVE_COL_NAMES=YES  
		DATABASE=SharedServices  SERVER="koryhh5.apac.sas.com"  PORT=9432  SCHEMA=public  
		USER=dbmsowner  PASSWORD="{SAS002}D1E03644158675A559943D24381A85A0" ;
	LIBNAME pg POSTGRES  DATABASE=postgres  PRESERVE_COL_NAMES=YES  PRESERVE_TAB_NAMES=YES  SERVER="pt05.apac.sas.com"  PORT=9432  
			USER=dbmsowner  PASSWORD="{sas002}D1E03644158675A559943D24381A85A0" dbmax_text=32767;


	option nomprint nosource nosource2;
	%global edmy etxt elxt eint eflt eclr edea echk esyn edte fint fpct ftxt fchk pg_conn;
	%let edmy=Slick.Editors.Dummy;
	%let etxt=Slick.Editors.Text;
	%let elxt=Slick.Editors.LongText;
	%let eint=Slick.Editors.Integer;
	%let eflt=Slick.Editors.Float;
	%let eclr=Slick.Editors.ColorSelect;
	%let edea=Slick.Editors.DealSelect;
	%let echk=Slick.Editors.Checkbox;
	%let esyn=Slick.Editors.YesNoSelect;
	%let edte=Slick.Editors.Date;
	%let fint=Slick.Formatters.CustomInteger;
	%let fpct=Slick.Formatters.PercentComplete;
	%let ftxt=Slick.Formatters.text;
	%let fchk=Slick.Formatters.Checkmark;

	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/macro_pager.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4Slick.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4Slick.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4tabGrid.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4SlickPS.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/getSavedData.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4PVT.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/calcParent.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4bar.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4line.sas";
	%inc "/sas/sasv94m8/config/Lev2/Applications/SASHBI/Macro/json4scatter.sas";

	%let pg_conn = server='pt05.apac.sas.com' port=9432 DATABASE=postgres dbmax_text=32767 user=dbmsowner pass='{sas002}D1E03644158675A559943D24381A85A0';

	
	%let etime = %sysfunc(datetime());
	%let el_time = %sysevalf(&etime -&stime);
	%let el_timeF = %sysfunc(putn(&el_time, time9.));
	%put NOTE: HBI Init Elapsed Time : &el_timeF. (&el_time.);
	%put NOTE: ================================================================================= &=sysjobid;
	option mprint source source2;
%mend hbi_init;
%hbi_init;
options source source2 notes;
