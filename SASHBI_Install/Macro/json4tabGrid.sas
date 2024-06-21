%macro json4tabGrid(
    tabsInfo = work.tabsInfo,
    optionsInfo = work.options,
    addTables=
);
    options mprint;

    proc json out=_webout;
        write value "options";
        write open array;
            export work.options / nosastags fmtnumeric fmtcharacter fmtdatetime;
        write close;

        write value "tabsInfo";
        write open array;
            export work.tabsInfo / nosastags fmtnumeric fmtcharacter fmtdatetime;
        write close;

        write value "data";
            write open object;
    %let dsid = %sysfunc(open(&tabsInfo));
    %if &dsid %then %do;
        %do %while(%sysfunc(fetch(&dsid)) eq 0);
            %let tableID = %sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,tableID))));
            %let tableLabel = %sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,tableLabel))));
            %put NOTE: &=tableID;
            %put NOTE: &=tableLabel;
                write value "&tableID";
                write open array;
                    export work.&tableID / nosastags fmtnumeric fmtcharacter fmtdatetime;
                write close;
        %end;
        %let rc = %sysfunc(close(&dsid));
    %end;
            write close;

            write value "tab_content";
                write open object;
        %let dsid = %sysfunc(open(&tabsInfo));
        %if &dsid %then %do;
            %do %while(%sysfunc(fetch(&dsid)) eq 0);
                %let tableID = %sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,tableID))));
                %let tableLabel = %sysfunc(getvarC(&dsid,%sysfunc(varnum(&dsid,tableLabel))));
                %put NOTE: &=tableID;
                %put NOTE: &=tableLabel;
                    write value "&tableID";
                    write open array;
                        export work.content_&tableID. / nosastags fmtnumeric fmtcharacter fmtdatetime;
                    write close;
            %end;
            %let rc = %sysfunc(close(&dsid));
        %end;
                write close;

        %if "&addTables" ne "" %then %do;
            %let iter=%eval(%sysfunc(countc(&addTables, %str(,))) + 1);
            %do ii=1 %to &iter;
                %let tableInfo = %scan(&addTables, &ii, %str(,));
                %let tblLabel = %scan(&tableInfo, 1, %str(:));
                %let tblName = %scan(&tableInfo, 2, %str(:));
                write value "&tblLabel";
                write open array;
                    export &tblName / nosastags fmtnumeric fmtcharacter fmtdatetime;
                write close;
            %end;
        %end;

    run;
%mend json4tabGrid;
