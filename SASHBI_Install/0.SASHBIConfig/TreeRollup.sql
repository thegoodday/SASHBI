-- Sequence: seq_fmt

-- DROP SEQUENCE seq_fmt;

CREATE SEQUENCE seq_fmt
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 126
  CACHE 1
  CYCLE;
ALTER TABLE seq_fmt
  OWNER TO "ALMConf";




-- Sequence: seq_rpt

-- DROP SEQUENCE seq_rpt;

CREATE SEQUENCE seq_rpt
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 3
  CACHE 1
  CYCLE;
ALTER TABLE seq_rpt
  OWNER TO "ALMConf";



-- Sequence: seq_rpt_grp

-- DROP SEQUENCE seq_rpt_grp;

CREATE SEQUENCE seq_rpt_grp
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 3
  CACHE 1
  CYCLE;
ALTER TABLE seq_rpt_grp
  OWNER TO "ALMConf";




-- Table: "COL_INFO_LST"

-- DROP TABLE "COL_INFO_LST";

CREATE TABLE "COL_INFO_LST"
(
  "LIBNAME" character varying(8),
  "DATA_NAME" character varying(32),
  "COL_NO" integer,
  "COL_NAME" character varying(32),
  "COL_DESC" character varying(200),
  "COL_ATTR" character varying(1),
  "COL_TYPE" character varying(1),
  "FMT_NAME" character varying(32),
  "IS_ACCOUNT" character varying(1)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "COL_INFO_LST"
  OWNER TO "ALMConf";




-- Table: "COL_INFO_MST"

-- DROP TABLE "COL_INFO_MST";

CREATE TABLE "COL_INFO_MST"
(
  "ACCT_GROUP" character varying(4),
  "TREE_TYPE" character varying(50),
  "SUB_TYPE" character varying(3),
  "DATA_GROUP" character varying(100),
  "LIBNAME" character varying(8),
  "DATA_NAME" character varying(32),
  "DATA_DESC" character varying(100),
  "RPT_GRP_ID" character varying(9),
  "USERID" character varying(20),
  "LASTUPDATE" timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "COL_INFO_MST"
  OWNER TO "ALMConf";




-- Table: "CUST_FMT_LST"

-- DROP TABLE "CUST_FMT_LST";

CREATE TABLE "CUST_FMT_LST"
(
  "FMT_NAME" character varying(32),
  "FMT_LABEL" character varying(50),
  "START" character varying(100),
  "END" character varying(100),
  "LABEL" character varying(200),
  "HLO" character varying(1),
  "TYPE" character varying(1),
  "USE_YN" character varying(1),
  "USERID" character varying(20),
  "LASTUPDATE" timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_FMT_LST"
  OWNER TO "ALMConf";





-- Table: "CUST_FMT_MST"

-- DROP TABLE "CUST_FMT_MST";

CREATE TABLE "CUST_FMT_MST"
(
  "FMT_NAME" character varying(32),
  "FMT_LABEL" character varying(50),
  "FMT_TYPE" character varying(1),
  "LIBNAME" character varying(8),
  "DATA_NAME" character varying(32),
  "COL_NAME" character varying(32),
  "USERID" character varying(20),
  "LASTUPDATE" timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_FMT_MST"
  OWNER TO "ALMConf";






-- Table: "CUST_TREE_ROLLUP_JSON"

-- DROP TABLE "CUST_TREE_ROLLUP_JSON";

CREATE TABLE "CUST_TREE_ROLLUP_JSON"
(
  "TREE_ID" character varying(10),
  "TYPE" character varying(2),
  "JSON_TEXT" text
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_TREE_ROLLUP_JSON"
  OWNER TO "ALMConf";






-- Table: "CUST_TREE_ROLLUP_LST"

-- DROP TABLE "CUST_TREE_ROLLUP_LST";

CREATE TABLE "CUST_TREE_ROLLUP_LST"
(
  "TREE_ID" character varying(10),
  "ID" character varying(20),
  "PID" character varying(20),
  "COL_NAME" character varying(32),
  "FMT_NAME" character varying(32),
  "CODE" character varying(20)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_TREE_ROLLUP_LST"
  OWNER TO "ALMConf";






-- Table: "CUST_TREE_ROLLUP_MS"

-- DROP TABLE "CUST_TREE_ROLLUP_MS";

CREATE TABLE "CUST_TREE_ROLLUP_MS"
(
  "TREE_ID" character varying(10),
  "ID" character varying(10),
  "PID" character varying(10),
  "COL_NAME" character varying(32),
  "COL_LABEL" character varying(50),
  "FMT_NAME" character varying(32)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_TREE_ROLLUP_MS"
  OWNER TO "ALMConf";





-- Table: "CUST_TREE_ROLLUP_MSF"

-- DROP TABLE "CUST_TREE_ROLLUP_MSF";

CREATE TABLE "CUST_TREE_ROLLUP_MSF"
(
  "TREE_ID" character varying(10), -- Tree ID
  "TYPE" character varying(2), -- Type
  "COL_NAME" character varying(32), -- Column Name
  "FMT_NAME" character varying(50), -- Format Name
  "VALUE" character varying(50) -- FORMATED VALUE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_TREE_ROLLUP_MSF"
  OWNER TO "ALMConf";
COMMENT ON TABLE "CUST_TREE_ROLLUP_MSF"
  IS '사용자 Tree Rollup Detail Table';
COMMENT ON COLUMN "CUST_TREE_ROLLUP_MSF"."TREE_ID" IS 'Tree ID';
COMMENT ON COLUMN "CUST_TREE_ROLLUP_MSF"."TYPE" IS 'Type';
COMMENT ON COLUMN "CUST_TREE_ROLLUP_MSF"."COL_NAME" IS 'Column Name';
COMMENT ON COLUMN "CUST_TREE_ROLLUP_MSF"."FMT_NAME" IS 'Format Name';
COMMENT ON COLUMN "CUST_TREE_ROLLUP_MSF"."VALUE" IS 'FORMATED VALUE';






-- Table: "CUST_TREE_ROLLUP_MST"

-- DROP TABLE "CUST_TREE_ROLLUP_MST";

CREATE TABLE "CUST_TREE_ROLLUP_MST"
(
  "ACCT_GROUP" character varying(4),
  "TREE_TYPE" character varying(50),
  "SUB_TYPE" character varying(3),
  "DATA_GROUP" character varying(100),
  "LIBNAME" character varying(8),
  "DATA_NAME" character varying(32),
  "RPT_GRP_ID" character varying(9),
  "TREE_ID" character varying(10),
  "TREE_NAME" character varying(100),
  "TREE_DESC" character varying(500),
  "USERID" character varying(50),
  "ORG_GROUP" character varying(50),
  "LASTUPDATE" timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CUST_TREE_ROLLUP_MST"
  OWNER TO "ALMConf";





-- Table: "LEVEL_INFO"

-- DROP TABLE "LEVEL_INFO";

CREATE TABLE "LEVEL_INFO"
(
  "ACCT_GROUP" character varying(4),
  "N1레벨계정구분CD" character varying(1),
  "N1레벨계정구분ID" character varying(200),
  "N2레벨계정구분CD" character varying(2),
  "N2레벨계정구분ID" character varying(200),
  "N3레벨계정구분CD" character varying(3),
  "N3레벨계정구분ID" character varying(200),
  "N4레벨계정구분CD" character varying(5),
  "N4레벨계정구분ID" character varying(200),
  "N5레벨계정구분CD" character varying(5),
  "N5레벨계정구분ID" character varying(200),
  "N6레벨계정구분CD" character varying(6),
  "N6레벨계정구분ID" character varying(200)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "LEVEL_INFO"
  OWNER TO "ALMConf";





-- Table: "REPORT_PRPT"

-- DROP TABLE "REPORT_PRPT";

CREATE TABLE "REPORT_PRPT"
(
  "CF_TYPE" character varying(20),
  "CURRENCY" character varying(40)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "REPORT_PRPT"
  OWNER TO "ALMConf";





-- Table: "RPT_GRP_LST"

-- DROP TABLE "RPT_GRP_LST";

CREATE TABLE "RPT_GRP_LST"
(
  "RPT_GRP_ID" character varying(9),
  "RPT_GRP_NAME" character varying(50),
  "LASTUPDATE" timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "RPT_GRP_LST"
  OWNER TO "ALMConf";





-- Table: "SYS_FMT_MST"

-- DROP TABLE "SYS_FMT_MST";

CREATE TABLE "SYS_FMT_MST"
(
  "COL_NAME" character varying(32),
  "START" character varying(100),
  "END" character varying(100),
  "LABEL" character varying(200),
  "TYPE" character varying(1),
  "USE_YN" character varying(1)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "SYS_FMT_MST"
  OWNER TO "ALMConf";






-- Table: "TREE_DATA_MST"

-- DROP TABLE "TREE_DATA_MST";

CREATE TABLE "TREE_DATA_MST"
(
  "ACCT_GROUP" character varying(4),
  "TREE_TYPE" character varying(50),
  "SUB_TYPE" character varying(3),
  "DATA_GROUP" character varying(100),
  "LIBNAME" character varying(8),
  "DATA_NAME" character varying(32),
  "RPT_GRP_ID" character varying(9),
  "TREE_ID" character varying(10),
  "TREE_NAME" character varying(100),
  "TREE_DESC" character varying(500),
  "MAX_LEAF_NO" integer,
  "USERID" character varying(20),
  "ORG_GROUP" character varying(50),
  "CREATEDATE" character varying(8)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "TREE_DATA_MST"
  OWNER TO "ALMConf";





-- Table: "TREE_PRMT_MST"

-- DROP TABLE "TREE_PRMT_MST";

CREATE TABLE "TREE_PRMT_MST"
(
  "ACCT_GROUP" character varying(4),
  "TREE_TYPE" character varying(50),
  "SUB_TYPE" character varying(3)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "TREE_PRMT_MST"
  OWNER TO "ALMConf";






-- View: "VIEW_COL_INFO_FMT"

-- DROP VIEW "VIEW_COL_INFO_FMT";

CREATE OR REPLACE VIEW "VIEW_COL_INFO_FMT" AS 
 SELECT mst."ACCT_GROUP", ( SELECT l1."LABEL"
           FROM "SYS_FMT_MST" l1
          WHERE l1."COL_NAME"::text = 'ACCT_GROUP'::text AND l1."START"::text = mst."ACCT_GROUP"::text) AS "ACCT_GROUP_LABEL", mst."TREE_TYPE", ( SELECT l2."LABEL"
           FROM "SYS_FMT_MST" l2
          WHERE l2."COL_NAME"::text = 'TREE_TYPE'::text AND l2."START"::text = mst."TREE_TYPE"::text) AS "TREE_TYPE_LABEL", mst."SUB_TYPE", ( SELECT l3."LABEL"
           FROM "SYS_FMT_MST" l3
          WHERE l3."COL_NAME"::text = 'SUB_TYPE'::text AND l3."START"::text = mst."SUB_TYPE"::text) AS "SUB_TYPE_LABEL", mst."DATA_GROUP", mst."LIBNAME", mst."DATA_NAME", mst."DATA_DESC", mst."USERID", mst."LASTUPDATE"
   FROM "COL_INFO_MST" mst;

ALTER TABLE "VIEW_COL_INFO_FMT"
  OWNER TO "ALMConf";





-- View: "VIEW_COL_INFO_USER"

-- DROP VIEW "VIEW_COL_INFO_USER";

CREATE OR REPLACE VIEW "VIEW_COL_INFO_USER" AS 
 SELECT mst."ACCT_GROUP", ( SELECT l1."LABEL"
           FROM "SYS_FMT_MST" l1
          WHERE l1."COL_NAME"::text = 'ACCT_GROUP'::text AND l1."START"::text = mst."ACCT_GROUP"::text) AS "ACCT_GROUP_LABEL", mst."DATA_GROUP", mst."LIBNAME", mst."DATA_NAME", mst."DATA_DESC", mst."USERID", mst."LASTUPDATE"
   FROM "COL_INFO_MST" mst
  WHERE mst."DATA_GROUP"::text <> '_SYS_'::text;

ALTER TABLE "VIEW_COL_INFO_USER"
  OWNER TO "ALMConf";






-- View: "VIEW_TREE_PRMT_MST"

-- DROP VIEW "VIEW_TREE_PRMT_MST";

CREATE OR REPLACE VIEW "VIEW_TREE_PRMT_MST" AS 
 SELECT mst."ACCT_GROUP", mst."TREE_TYPE", mst."SUB_TYPE", ( SELECT l1."LABEL"
           FROM "SYS_FMT_MST" l1
          WHERE l1."COL_NAME"::text = 'ACCT_GROUP'::text AND l1."START"::text = mst."ACCT_GROUP"::text) AS "ACCT_GROUP_LABEL", ( SELECT l2."LABEL"
           FROM "SYS_FMT_MST" l2
          WHERE l2."COL_NAME"::text = 'TREE_TYPE'::text AND l2."START"::text = mst."TREE_TYPE"::text) AS "TREE_TYPE_LABEL", ( SELECT l3."LABEL"
           FROM "SYS_FMT_MST" l3
          WHERE l3."COL_NAME"::text = 'SUB_TYPE'::text AND l3."START"::text = mst."SUB_TYPE"::text) AS "SUB_TYPE_LABEL"
   FROM "TREE_PRMT_MST" mst;

ALTER TABLE "VIEW_TREE_PRMT_MST"
  OWNER TO "ALMConf";






