-- bk_cd $2
-- board_id 
-- article_id 8
-- article_title $10000
-- article_content $30000
-- reg_user $20
-- reg_dt
-- attachment_id
-- view_cnt
-- last_update_dt 8
-- Table: public.board_mst
-- DROP TABLE IF EXISTS public.board_mst;
CREATE TABLE
    IF NOT EXISTS public.board_mst (
        board_id integer NOT NULL,
        article_id integer NOT NULL DEFAULT nextval ('board_seq'::regclass),
        parent_id integer,
        article_title character varying(200) COLLATE pg_catalog."default",
        article_content character varying(200000) COLLATE pg_catalog."default",
        reg_user character varying(20) COLLATE pg_catalog."default",
        attachment_id integer,
        view_cnt integer,
        reg_dt timestamp without time zone,
        last_update_dt timestamp without time zone,
        CONSTRAINT pk_board_mst1 PRIMARY KEY (article_id)
    ) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.board_mst OWNER to dbmsowner;

-- bk_cd, file_key, join_key, file_name, file_name_org, file_path, create_date
-- Table: public.file_mst
-- DROP TABLE IF EXISTS public.file_mst;
CREATE TABLE
    IF NOT EXISTS public.file_mst (
        file_key integer NOT NULL DEFAULT nextval ('board_seq'::regclass),
        join_key integer,
        file_name character varying COLLATE pg_catalog."default",
        file_name_org character varying COLLATE pg_catalog."default",
        file_path character varying COLLATE pg_catalog."default",
        reg_dt timestamp without time zone,
        last_update_dt timestamp without time zone,
        CONSTRAINT pk_file_mst PRIMARY KEY (file_key)
    ) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.file_mst OWNER to dbmsowner;


WITH RECURSIVE dept_record(dept_sn, parent_sn, dept_name, dept_ctn, level, path, cycle) AS(
   SELECT d.dept_sn, d.parent_sn, d.dept_name, d.dept_ctn, 0, ARRAY[d.dept_sn], false
   FROM dept d
   WHERE d.parent_sn IS NULL
   
   UNION ALL
   
   SELECT d.dept_sn, d.parent_sn, d.dept_name, d.dept_ctn, level + 1, path || d.dept_sn, d.dept_sn = ANY(path)
   FROM dept d, dept_record dr
   WHERE d.parent_sn = dr.dept_sn
   AND NOT CYCLE
)
SELECT dept_sn, parent_sn, dept_name, dept_ctn, level, path 
FROM dept_record
ORDER BY path