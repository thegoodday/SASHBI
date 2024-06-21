%macro webout;
    /* filename newfile "/tmp/&_webin_filename"; */
    filename newfile "/tmp/excel.xlsx";
    data _null_;
        length data $1;
        infile &&_webin_fileref. recfm=n;
        file newfile recfm=n;
        input data $char1. @@;
        put data $char1. @@;
    run;
    options validvarname=v7;
    /* filename fname "&p_uploaded_file_name"; */
    PROC IMPORT OUT=work.excel DATAFILE="/tmp/excel.xlsx"
                DBMS=XLSX   REPLACE;
                SHEET="Sheet1";       /* Gen_oppty */
    run;

    filename cmd pipe "rm -f /tmp/excel.xlsx";
    data _null_;
        infile cmd;
        input;
        put _infile_;
    run;
    options symbolgen MLOGIC;
    %json4Slick(
        tableName=work.excel
        , multiColumnSort=true
        , editable=true
        , enableAddRow=true
        , enableCellNavigation=true
        , autoEdit=false
    );

/*

    filename cmd pipe "LANG=C;ls -al /tmp |grep '^-'";
    data work.dir;
        infile cmd truncover length=len;
        length
            _check_ $1
            perm $12
            tt 8
            owner $12
            group $12
            size 8
            mon $4
            monN 8
            day 8
            time 8
            filename $200
        ;
        _check_ = '1';
        informat time time.;
        format time time6. size comma20.;
        input perm tt owner group size mon dy time filename $varying200. len;
        monN = input(compress(mon, '월'),8.);
        if filename eq '' then filename='.';
        if per eq '합계' then delete;
        *put _infile_;
        ppp = substr(perm,1,1);
        drop tt group mon;
        label
            perm = 'Permision'
            size = 'Size'
            monN = 'Mon'
            day = 'Day'
            time = 'Time'
        ;
    run;
    proc sort data=work.dir out=work.dir2(drop=ppp);
        by descending ppp filename;
    run;
    
    proc json out=_webout;
        write values Sysjobid "&sysjobid";
        write values Result "&sysrc";
        write values Msg "&syserrortext";
        write values "Files";
        write open array;
            export work.dir2 / nosastags fmtnumeric fmtcharacter fmtdatetime;
        write close;
    run;
*/    
%mend;
%webout;
