package com.sas.hbi.dao;

import java.sql.*;
import java.util.HashMap;

/*
import java.io.*;
import java.util.Properties;

import javax.naming.*;
import javax.sql.*;
import org.apache.log4j.Logger;
*/


public interface HBILogDAO {
	/*
	  seq_id integer NOT NULL DEFAULT nextval('hbi_log_seq'::regclass),
	  userid character varying(20),
	  ip character varying(15),
	  uri character varying(30),
	  action character varying(30),
	  program character varying(200),
	  sessionid character varying(40),
	  datetime timestamp without time zone	 
	  
	  seq_id integer NOT NULL,
	  param character varying(40),
	  value character varying(50)  
	 */
	int getSeqID();
	int insertHBILog(String userid,String ip,String uri,String action,String program,String sessionid,HashMap<String, String> addLoggingParam);
	void insertHBILogDetail(int seqid,HashMap<String,String> params);
}
