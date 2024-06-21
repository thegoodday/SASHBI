
%let pg_conn = server='pt05.apac.sas.com' port=9432 database=postgres dbmax_text=32767 user='dbmsowner' pass='{sas002}D1E03644158675A559943D24381A85A0';

proc sql noprint;
    connect to postgres(server='pt05.apac.sas.com' port=9432 database=postgres dbmax_text=32767 
							user='dbmsowner' pass='{sas002}D1E03644158675A559943D24381A85A0');	
	create table work.board_mst as 
	select * from connection to postgres(
		WITH RECURSIVE bd_list(article_id, parent_id, article_title, article_content, reg_user, attachment_id, view_cnt, reg_dt, last_update_dt, level, path, cycle) AS(
		   SELECT bd.article_id, bd.parent_id, bd.article_title, bd.article_content, bd.reg_user, bd.attachment_id, bd.view_cnt, bd.reg_dt, bd.last_update_dt, 
				0, ARRAY[bd.article_id], false
		   FROM public.board_mst bd
		   WHERE bd.parent_id = 0
		   
		   UNION ALL
		   
		   SELECT bd.article_id, bd.parent_id, bd.article_title, bd.article_content, bd.reg_user, bd.attachment_id, bd.view_cnt, bd.reg_dt, bd.last_update_dt, 
				level + 1, path || bd.article_id, bd.article_id = ANY(path)
		   FROM public.board_mst bd, bd_list dr
		   WHERE bd.parent_id = dr.article_id
		       AND NOT CYCLE
		)
		SELECT article_id, parent_id, article_title, reg_user, attachment_id, view_cnt, level, path, reg_dt, last_update_dt, article_content
				
		FROM bd_list
		ORDER BY path		   
    );
    disconnect from postgres;
quit;
data work.board;
	length chkbox $1 article_title $32760;
	set work.board_mst;
	chkbox=0;
	label
		article_id = 'ID'
		article_title = '제목'
		reg_user = '게시자'
		view_cnt = '조회수'
		reg_dt = '등록일'
		last_update_dt = '수정일'
	;
	format reg_dt last_update_dt datetime20.;
	*put article_content=;
run; 



%json4Slick(
	tableName=work.board,
	columns	=%str(
		chkbox article_id article_title reg_user view_cnt reg_dt last_update_dt
	),
	width	=%str(60 60 1000 100 100 120 120), 
	css		=%str(c c l c c c c c),
	sort	=%str(1 1 1 1 1 1 1 1 1 1 1 1 1),
	resize	=%str(1 1 1 1 1 1 1 1 1 1 1 0 0),
	editor  = %str(
                     &edmy &edmy &edmy &edmy &etxt
                     &esyn &etxt &etxt &etxt &etxt 
                     &esyn &esyn &etxt &etxt &etxt 
                     &etxt &etxt
	),
	formatter = %str(
                     &ftxt &ftxt &ftxt &ftxt &ftxt
                     &ftxt &ftxt &ftxt &ftxt &ftxt
                     &ftxt &ftxt &ftxt &ftxt &ftxt
    ),
    autoEdit= false,
    editable= false,
	enableCellNavigation=true, 
	enableColumnReorder=false, 
	multiColumnSort=true,
	forceFitColumns=true,
	chkbox=true
);
