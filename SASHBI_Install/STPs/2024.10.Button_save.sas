%macro webout;
    %getSavedData();
    
    proc json out=_webout;
        write values Sysjobid "&sysjobid";
        write values Result "&sysrc";
        write values Msg "&syserrortext";
        write values "Saved Data";
        write open array;
            export work.sgGrid / nosastags fmtnumeric fmtcharacter fmtdatetime;
        write close;
    run;
%mend;
%webout;
