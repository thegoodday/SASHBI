%inc "/app/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_auto.sas";

%global branch FILE_KEY JOIN_KEY;
options nosource nosource2 nomprint;
%fcsautoexec(fcf_auto=1, bnk=GBBU_PKG);
options source source2 mprint;
options minoperator mindelimiter=',';


%macro download_file;
    proc sql noprint;
        connect to oracle(dbserver_max_bytes=1 dbclient_max_bytes=1 db_length_semantics_byte=no
                                    &segKCDBConnOpts authdomain="&SegKcAuthDomain");
        create table work.&branch._fsb_file_manager as
        select *
        from connection to oracle(
            SELECT * /* FILE_KEY, JOIN_KEY, FILE_NAME_ORG, FILE_NAME, FILE_PATH  */
            FROM _FSB_FILE_MANAGER
            WHERE 1=1
                AND BK_CD = &nrbquote('&branch')
                AND FILE_KEY = &FILE_KEY
                AND JOIN_KEY = &JOIN_KEY
        );
        disconnect from oracle;
    quit;
data _null_;
	set work.&branch._fsb_file_manager;
	ext = scan(FILE_NAME, -1, '.');
	abs_file_path=cat(trim(file_path),'/',file_name);
	file_rc = fileexist(abs_file_path);
	put file_rc=;

	if ext eq 'zip'				then conttype = 'application/zip';
	else if ext eq 'pdf'  	 then conttype = 'application/pdf';
	else if ext eq 'xls'  	 then conttype = 'application/vnd.ms-excel';
	else if ext eq 'xlsx'    then conttype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
	else if ext eq 'doc'  	then conttype = 'application/msword';
	else if ext eq 'docx'  then conttype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
	else if ext eq 'ppt'  	 then conttype = 'application/ms-powerpoint';
	else if ext eq 'pptx'    then contype = 'application/vnd.openxmlforamts-officedocument.presentationml.presentation';
	else if ext eq 'txt'  	   then conttype = 'text/plain';
	else if ext eq 'hwp'  	then conttype = 'application/x-hwp';

	isIE=index(symget("_HTUA"), 'Trident');

	call symput('file_path',strip(file_path));
	call symput('file_name',strip(file_name));
	call symput('file_name_org',strip(file_name_org));
	call symput('_content_type',strip(conttype));
	call symput('file_exist', file_rc);
	call symput('isIE', isIE);
run;

%if &file_exist > 0 %then %do;
	filename tfile ="&file_path./&file_name.";
	%let rv = &sysfunc(stpsrv_header(Content-type, &_content_type.));
	%if &isIE > 0 %then %do;
		%let rc=&sysfunc(appsrv_header(Content-disposition, %str(attachment; filename="&file_name_org")));
	%end;
	%let rc=&sysfunc(appsrv_header(Content-Transfer-Encoding, %str(binary)));


		data _null_;
			length data $1;
			infile tfile recfm=n;
			file _webout recfm=n;
			input data $char1. @@;
			put data $char1. @@;
		run;
	%end;
	%else %do;
		data work.status;
			if &msg eq "" then msg="The external file &file_name_org does not exist.";
			else msg= &msg;
		run;

		proc json out=_webout pretty nosastags;
			export work.status;
		run;
	%end;
%mend;
%download_file;

		options obs=max no&syntaxcheck;
	%put NOTE: &=syscc;
	 	data _null_;
			file _webout;
			rc = stpsrvset('program error',0);
		%if &syscc > 4 %then %do;
		put rc=;
		%end;
		 run;
		 %let syscc=0;
			