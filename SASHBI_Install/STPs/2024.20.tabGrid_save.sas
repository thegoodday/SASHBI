%macro webout;
    %getSavedData();
    
    proc datasets lib=work;
    run;quit;

    
    proc json out=_webout;
        write values Sysjobid "&sysjobid";
        write values Result "&sysrc";
        write values Msg "&syserrortext";

        %if %sysfunc(exist(work.prdsale)) %then %do;
            write values "prdsale Data";
            write open array;
                export work.prdsale / nosastags fmtnumeric fmtcharacter fmtdatetime;
            write close;
        %end;
        %if %sysfunc(exist(work.Prdsal2)) %then %do;
            write values "prdsale2 Data";
            write open array;
                export work.Prdsal2 / nosastags fmtnumeric fmtcharacter fmtdatetime;
            write close;
        %end;
        %if %sysfunc(exist(work.class)) %then %do;
            write values "class Data";
            write open array;
                export work.class / nosastags fmtnumeric fmtcharacter fmtdatetime;
            write close;
        %end;
        %if %sysfunc(exist(work.air)) %then %do;
            write values "air Data";
            write open array;
                export work.air / nosastags fmtnumeric fmtcharacter fmtdatetime;
            write close;
        %end;
    run;
%mend;
%webout;
