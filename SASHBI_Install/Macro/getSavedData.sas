
%macro getSavedData(cont_table=);
    options validvarname=any;
    %let work_path = %sysfunc(pathname(work));
    %let work_path = /tmp;
    libname _save "&save_path";
    *libname _save "/fssas/saswork/SAS_work/asdfasdfasdf";
    *libname tmp '/tmp';

    %do ii=1 %to &_webin_file_count;
        %if &ii eq 1 %then %let mm=;
        %else %let mm = &ii;
        filename newfile "&work_path./&&_webin_filename&mm." encoding=utf8;
        data _null_;
            length data $1;
            infile &&_webin_fileref&mm. recfm=n;
            file newfile recfm=n;
            input data $char1. @@;
            put data $char1. @@;
        run;

        %if %upcase(&_webin_fileext) eq JSON %then %do;
            %let outTable = %scan(&&_webin_filename&mm., 1);
            libname injson json fileref=newfile;
            /*
            proc datasets lib=injson;
            quit;
            proc copy inlib=injson outlib=work;
            run;

            proc datasets lib=work nolist;
                change
                    alldata = all_&outTable.
                    root = root_&outTable.
                ;
            run; quit;
            proc copy inlib=work outlib=tmp;
            run;
            */
            data work.&outTable.;
                set injson.root;
                drop ordinal_root id;
            run;
        %end;
    %end;

%mend getSavedData;

%macro renameDS(dsname=);
    %let dsid = %sysfunc(open(&dsname));
    %if &dsid %then %do;
        %do %while(%sysfunc(fetch(&dsid)) eq 0);
            %let varName = %trim(%sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,name)))));
            %let newVar = %sysfunc(getvarN(&dsid, %sysfunc(varnum(&dsid, varnum))));
            %let newVarname = %sysfunc(putn(&newVar, z3.));
            "&varName."n = var&newVarname.
        %end;
        %let rc = %sysfunc(close(&dsid));
    %end;
%mend;

%*renameDS(dsname=tmp.table_content);

%macro labelDS(dsname=);
    %let dsid = %sysfunc(open(&dsname));
    %if &dsid %then %do;
        %do %while(%sysfunc(fetch(&dsid)) eq 0);
            %let varName = %trim(%sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,name)))));
            %let newVar = %sysfunc(getvarN(&dsid, %sysfunc(varnum(&dsid, varnum))));
            %let newVarname = %sysfunc(putn(&newVar, z3.));
            %let newVarname = %trim(%sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,name)))));
            %if &varName eq %then %let varName = &newVarname;
            label &newVarname. = "&varName" ;
        %end;
        %let rc = %sysfunc(close(&dsid));
    %end;

%mend;
%*labelDS(dsname=tmp.table_content);

%macro renameDS4(dsname=);
    %let dsid = %sysfunc(open(&dsname));
    %if &dsid %then %do;
        %do %while(%sysfunc(fetch(&dsid)) eq 0);
            %let varName = %trim(%sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,name)))));
            %let newVar = %sysfunc(getvarN(&dsid, %sysfunc(varnum(&dsid, varnum))));
            %let newVarname = %sysfunc(putn(&newVar, z3.));
            var&newVarname. = "&varName"n
        %end;
        %let rc = %sysfunc(close(&dsid));
    %end;
%mend;

%macro lengthDS(dsname=);
    %let dsid = %sysfunc(open(&dsname));
    %if &dsid %then %do;
        %do %while(%sysfunc(fetch(&dsid)) eq 0);
            %let varName = %trim(%sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,name)))));
            %let varLength = %sysfunc(getvarN(&dsid,%sysfunc(varnum(&dsid,length))));
            %let newVar = %sysfunc(getvarN(&dsid, %sysfunc(varnum(&dsid, varnum))));
            %let newVarname = %sysfunc(putn(&newVar, z3.));
            var&newVarname. $&varLength.
        %end;
        %let rc = %sysfunc(close(&dsid));
    %end;
%mend;

%macro saveUploadFiles(base_dir);
    options validvarname=any;
    /*
    %let work_path = %sysfunc(pathname(work));
    %let work_path = /tmp;
    libname _save "&save_path";
    */
    %do ii=1 %to &_webin_file_count;
        %if &ii eq 1 %then %let mm=;
        %else %let mm=&ii;
        filename newfile "&base_dir./&&_webin_filename&mm.";
        data _null_;
                length data $1;
                infile &&_webin_fileref&mm. recfm=n ;
                file newFile recfm=n;
                input data $char1. @@;
                put data $char1. @@;
        run;
    %end;
%mend saveUploadFiles;