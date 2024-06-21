%macro webout;
    %let file_name=class;*alldata;
    %let _content_type=application/sas;

    data _null_;
        file_path=pathname('WORK');
        call symput('file_path', strip(file_path));
    run;
    %put NOTE: &=file_path;
    filename tmp temp;

    data _null_;
        length data $1;
        infile &_WEBIN_FILEREF recfm=n;
        file tmp recfm=n;
        input data $char1. @@;
        put data $char1. @@;
    run;

    libname tmp json;

    proc copy inlib=tmp outlib=work;
    run;

    data work.class;
        set work.root;
        drop ordinal_root;
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
