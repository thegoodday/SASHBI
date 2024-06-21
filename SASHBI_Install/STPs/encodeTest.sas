
proc options group=languagecontrol ; run;
/*
*/
%let ARTICLE_CONTENT=%ED%95%9C%EA%B8%80%20%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EC%BB%A8%ED%85%90%EC%B8%A0;
%let ARTICLE_TITLE=%ED%95%9C%EA%B8%80%20%ED%85%8C%EC%8A%A4%ED%8A%B8%20%ED%83%80%EC%9D%B4%ED%8B%80;

options URLENCODING=utf8;

    data work.article;
        length
/*            bk_cd $2*/
            board_id article_id parent_id 8
            article_title $10000
            article_content $30000
            reg_user $20
            reg_dt
            attachment_id
            view_cnt
            last_update_dt 8
        ;
/*        bk_cd = "&branch";*/
        article_title = urldecode("&article_title");
        article_content = urldecode(symget("article_content"));
        output;
    run;


	
    proc json out=_webout pretty nosastags;
        export work.article;
    run;
