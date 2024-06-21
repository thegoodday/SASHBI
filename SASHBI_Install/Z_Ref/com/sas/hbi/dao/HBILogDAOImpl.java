package com.sas.hbi.dao;

import java.sql.BatchUpdateException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.log4j.Logger;
import org.json.JSONObject;

public class HBILogDAOImpl extends DAOBase implements HBILogDAO {
	private static Logger logger = Logger.getLogger("HBILogDAOiImpl");
	public HBILogDAOImpl(String lookup_name, String source_name){
		setDATA_LOOKUP_NAME(lookup_name);
		setDATA_SOURCE_KEY(source_name);
	}

	@Override
	public int getSeqID() {
		int seq_id = 0;
		seq_id = queryInteger("select nextval('hbi_log_seq') as seq_id");
		return seq_id;
	}

	@Override
	public int insertHBILog(String userid, String ip, String uri, String action, String program, String sessionid,HashMap<String, String> addLoggingParam) {
		int seqid = 0;
		String query = "insert into hbi_acc_log (seq_id,userid,ip,uri,action,program,sessionid,datetime";

		Set<Entry<String, String>> addLoggingParamSet = addLoggingParam.entrySet();
		Iterator<Entry<String, String>> it = addLoggingParamSet.iterator();
		while (it.hasNext()) {
			Map.Entry<String, String> e = (Map.Entry<String, String>)it.next();
			//System.out.println("이름 : " + e.getKey() + ", 점수 : " + e.getValue());
			query += "," + e.getKey();
		}
		query += ") values (?,?,?,?,?,?,?,?";

		Iterator<Entry<String, String>> it2 = addLoggingParamSet.iterator();
		while (it2.hasNext()) {
			Map.Entry<String, String> e2 = (Map.Entry<String, String>)it2.next();
			query += ",?";		
		}

		query += ")";
        PreparedStatement pstmt = null;
        if (action == null) action = "";
        if (program == null) program = "";
        try {								 
            Connection conn=getConnection();								
            try {								
            	pstmt=conn.prepareStatement(query);	
            	seqid = getSeqID();
            	logger.debug("seqid in insertHBILog Method : " + seqid);
            	pstmt.setInt(1, seqid);
            	pstmt.setString(2, userid);
            	pstmt.setString(3, ip);
            	pstmt.setString(4, uri);
            	pstmt.setString(5, action);
            	pstmt.setString(6, program);
            	pstmt.setString(7, sessionid);
            	pstmt.setTimestamp(8, getCurrentTimeStamp());
        		Iterator<Entry<String, String>> it3 = addLoggingParamSet.iterator();
        		int ii=1;
        		while (it3.hasNext()) {
        			Map.Entry<String, String> e3 = (Map.Entry<String, String>)it3.next();
        			pstmt.setString(8+ii,e3.getValue());
        			ii++;
        		}

            	pstmt.executeUpdate();
            } catch(Exception e){
            	e.printStackTrace();							
                logger.debug(e.getMessage());								            	
            }finally {								
                releaseConnection(conn);								
            }								
        }								
        catch (Exception e) {								
        	e.printStackTrace();							
            logger.debug(e.getMessage());								
        }												
		return seqid;
	}

	@Override
	public void insertHBILogDetail(int seqid, HashMap<String,String> params) {
		String query = "insert into hbi_acc_log_detail (seq_id,param,value) values (?,?,?)";
        PreparedStatement pstmt = null;
         
        try {								 
            Connection conn=getConnection();								
            try {		
            	pstmt=conn.prepareStatement(query);	
            	Set<Entry<String,String>> keys = params.entrySet();
            	Iterator<Entry<String,String>> it = keys.iterator();
            	while (it.hasNext()) {
            		Map.Entry<String, String> enty = (Map.Entry<String, String>)it.next();
            		String param = enty.getKey();
            		String value = enty.getValue();
    				pstmt.setInt(1, seqid);
    				pstmt.setString(2, param);
    				pstmt.setString(3, value);
    				pstmt.addBatch();
    				pstmt.clearParameters();
    			}
            	pstmt.executeBatch();
            	pstmt.close();
            } catch (BatchUpdateException be){
            	logger.error("ERROR : Batch Error occured. : " + be.getLocalizedMessage());
            	logger.error("ERROR : Batch Error occured. : " + be.getMessage());
            } finally {								
                releaseConnection(conn);								
            }								
        }								
        catch (Exception e) {								
        	e.printStackTrace();							
            logger.debug(e.getMessage());								
        }												
		
	}

}
