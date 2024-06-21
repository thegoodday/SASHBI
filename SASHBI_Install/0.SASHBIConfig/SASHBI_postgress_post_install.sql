-- Role: sashbi

-- DROP ROLE sashbi;

CREATE ROLE sashbi LOGIN
  ENCRYPTED PASSWORD 'md541a195f1120b5bf3a1c4e32a15d4b8b5'
  NOSUPERUSER INHERIT CREATEDB NOCREATEROLE NOREPLICATION;



-- Database: "SASHBI"

-- DROP DATABASE "SASHBI";

CREATE DATABASE "SASHBI"
  WITH OWNER = sashbi
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'Korean_Korea.949'
       LC_CTYPE = 'Korean_Korea.949'
       CONNECTION LIMIT = -1;


-- Table: hbi_acc_log

-- DROP TABLE hbi_acc_log;

CREATE TABLE hbi_acc_log
(
  seq_id integer NOT NULL DEFAULT nextval('hbi_log_seq'::regclass),
  empno character varying(20),
  dept character varying(20),
  userid character varying(20),
  ip character varying(15),
  uri character varying(30),
  action character varying(30),
  program character varying(200),
  sessionid character varying(40),
  datetime timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE hbi_acc_log
  OWNER TO sashbi;



-- Table: hbi_acc_log_detail

-- DROP TABLE hbi_acc_log_detail;

CREATE TABLE hbi_acc_log_detail
(
  seq_id integer NOT NULL,
  param character varying(40),
  value character varying(200)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE hbi_acc_log_detail
  OWNER TO sashbi;



-- Sequence: hbi_log_seq

-- DROP SEQUENCE hbi_log_seq;

CREATE SEQUENCE hbi_log_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 191
  CACHE 1
  CYCLE;
ALTER TABLE hbi_log_seq
  OWNER TO sashbi;
