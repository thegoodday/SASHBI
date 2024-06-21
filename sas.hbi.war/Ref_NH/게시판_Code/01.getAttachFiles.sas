%inc "/../hbi_auto.sas";

%global branch board_id article_id ischk msg;

options nosource nosource2 noprint;
options source source2 oprint;
options minoperater mindelimiter=',';

%macro makeData;
    %let branch = &bk_cd;
    proc sql noprint;
        connect to oracle();
        create table work.file_list as
        select * from connection to oralce(
            select bk_cd file_key, join_key, file_name_org, file_name, file_path
            from fsb_file_manager
            where 1=1
              and bk_cd = %nrbquote('&branch')
              and join_key = &article_id
            order by create_date
        );
        disconnect from oracle;
    quit;

    proc datasets lib-work nodetails;
        modify file_list;
            label
                bk_cd   = 'BK_CD'
                file_key= 'FILE_KEY'
                join_key= 'JOIN_KEY'
                file_name_org = 'File Name'
                file_name = 'File Name'
                file_path = 'File Path'
            ;
    quit;

            
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

    %if "&from" eq "new" %then %do;
        %json4Slick(
            tableName = work.file_list,
            columns = %str(BK_CD FILE_NAME_ORG),
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
            columns = %str(FILE_NAME_ORG) FILE_PATH,
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
    %makeData;
%mend makeData;