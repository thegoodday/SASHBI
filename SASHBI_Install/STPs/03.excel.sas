%macro webout;
    %let file_name=class;*alldata;
    %let _content_type=application/sas;

    data _null_;
        file_path=pathname('WORK');
        call symput('file_path', strip(file_path));
    run;
    %put NOTE: &=file_path;
    
    filename excl "&file_path./excel.xlsx";

    data _null_;
        length data $1;
        infile &_WEBIN_FILEREF recfm=n;
        file excl recfm=n;
        input data $char1. @@;
        put data $char1. @@;
    run;

    libname ex xlsx "&file_path./excel.xlsx";

    data work.class;
        set ex.prdsale;
    run;

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
/*
proc export data=sashelp.class dbms=xlsx outfile="c:\temp\class.xlsx" replace;
run;

proc import datafile='c:\temp\prdsale.xlsx' dbms=xlsx out=work.prdsale replace;
run;

Proc import out=prdsale Datafile="c:\temp\prdsale.xlsx" DBMS=excel replace ;
    sheet="prdsale";
Run;

proc import out=class datafile="c:\temp\prdsale.xlsx" dbms=excel replace ;
    sheet="class";
run;

libname excl xlsx "c:\temp\prdsale.xlsx";
proc datasets lib=excl;
run; quit;

*/