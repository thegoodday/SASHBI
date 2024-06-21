%macro webout;
    %let file_name=target;
    %let _content_type=application/sas;

    proc sql;
        create table work.&file_name as 
        select * 
        from sashelp.prdsale 
        where 1=1
        %if "&country" ne "" %then %do;
            and COUNTRY="&country" 
        %end;
        %if "&region" ne "" %then %do;
            and REGION="&region" 
        %end;
        %if "&division" ne "" %then %do;
            and DIVISION="&division" 
        %end;
        ;
    quit;

    /*
    %stpbegin;
    proc print data=work.target;
    run;
    %stpend;
     */
    data _null_;
        file_path=pathname('WORK');
        call symput('file_path', strip(file_path));
    run;
    %put NOTE: &=file_path;

    filename tfile "&file_path./&file_name..sas7bdat";
    %let rc=%sysfunc(stpsrv_header(Content-type, &_content_type.));
    %let rc=%sysfunc(appsrv_header(Content-Transfer-Encoding, %str(binary)));
    %let rc=%sysfunc(appsrv_header(Content-disposition,
        %str(attachment; filename="&file_name..sas7bdat")));

    data _null_;
        length data $1;
        infile tfile recfm=n;
        file _webout recfm=n;
        input data $char1. @@;
        put data $char1. @@;
    run;
%mend;
%webout;
