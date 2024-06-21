%global board_id article_id ischk msg;

options nosource nosource2 nomprint;
options source source2 mprint;
options minoperator mindelimiter=',';

%macro makeData;
    proc sql noprint;
        connect to postgres(&pg_conn);
        create table work.file_list as
        select * from connection to postgres(
            select *
            from file_stg
            where 1=1
              and join_key = &article_id
            order by reg_dt
        );
        disconnect from postgres;
    quit;

    proc datasets lib=work nodetails noprint;
        modify file_list;
            label
                file_key= 'FILE_KEY'
                join_key= 'JOIN_KEY'
                file_name_org = 'File Name'
                file_name = 'File Name'
                file_path = 'File Path'
            ;
    quit;

           

    %if "&from" eq "new" %then %do;
        %json4Slick(
            tableName = work.file_list,
            columns = %str(file_name_org),
            width = %str(400 100 60 60 100
                        100 100 100 100 100
            ),
            css = %str(l l c c c
                        c c c c c
            ),
            sort = %str(1 1 1 1 1
                        1 1 1 1 1
            ),
            enableCellNavigation = true,
            enableColumnReorder = false,
            enableAddRow = false,
            multiColumnSort = false,
            autoEdit = false,
            editable = true,
            chkbox = true,
            forceFitColumns = true
        );
    %end;
    %else %do;
        %json4Slick(
            tableName = work.file_list,
            columns = %str(file_name_org file_path),
            width = %str(400 100 60 60 100
                        100 100 100 100 100
            ),
            css = %str(l l c c c
                        c c c c c
            ),
            sort = %str(1 1 1 1 1
                        1 1 1 1 1
            ),
            enableCellNavigation = true,
            enableColumnReorder = false,
            enableAddRow = false,
            multiColumnSort = false,
            autoEdit = false,
            editable = true,
            chkbox = true,
            forceFitColumns = true
        );
    %end;
%mend makeData;
%makeData;


%if &syscc > 4 %then %do;
    options obs=max no$syntaxcheck;
    %put NOTE: &=syscc;
    data _null_;
        file _webout;
        rc = stpsrvset('program error',0);
        msg = cat('[{"msg":"',"ERROR",'"}]');
        put msg;    
    run;
    %let syscc=0;
%end;
