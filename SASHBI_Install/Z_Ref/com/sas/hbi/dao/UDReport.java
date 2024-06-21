package com.sas.hbi.dao;
import java.io.IOException;
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
//import org.postgresql.Driver;


import org.apache.log4j.Logger;

//import com.sas.hbi.tools.HBIConfig;
import com.sas.hbi.property.HBIConfig;


public class UDReport {
	private static String DB_DRIVER = "";//"org.postgresql.Driver";
	private static String DB_CONNECTION = "";//"jdbc:postgresql://localhost:9432/ALMConf";
	private static String DB_USER = "";//"ALMConf";
	private static String DB_PASSWORD = "";//"sask@123";
	
	
	private static Logger logger = Logger.getLogger("PG");
	
	public UDReport() throws IOException{
		//Properties conf = new HBIConfig().getConfig();
		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();

		UDReport.setDB_DRIVER(conf.getProperty("alm.DB_DRIVER"));
		UDReport.setDB_CONNECTION(conf.getProperty("alm.DB_CONNECTION"));
		UDReport.setDB_USER(conf.getProperty("alm.DB_USER"));
		UDReport.setDB_PASSWORD(conf.getProperty("alm.DB_PASSWORD"));
		logger.info("DB_DRIVER : " + getDB_DRIVER());
		logger.info("DB_CONNECTION : " + getDB_CONNECTION());
		logger.info("DB_USER : " + getDB_USER());
		logger.info("DB_PASSWORD : " + getDB_PASSWORD());

	}

	public static void main(String[] argv) throws JSONException, IOException {
		try {
			UDReport UDReport = new UDReport();  
			Connection dbConnection = null;
			dbConnection = getDBConnection();

			String mf=getJsonText("TR_00075","MF");
			insertReportMStatsFlat("TR_00075",mf,dbConnection);
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		}
	}
	private static void testinsertReportMStats(String treeID) 
			throws SQLException, JSONException {
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			//String treeID,String objTreeMStats,Connection dbConnection
			treeID="TR_00058";
			//String objTreeMStats="newtest";
			//updateTreeReportJSON(treeID, "MT", objTreeMStats, dbConnection);
			String objTreeMStats = getJson(treeID,"FT",dbConnection);
			System.out.println("objTreeMStats" + objTreeMStats);
			insertReportFilter(treeID, objTreeMStats,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
	}

	
	private static String getNewTreeID(Connection dbConnection) throws SQLException{
		int newIDint =0;
		String newID="";
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;

		String getNewIDSQL = "SELECT nextval('SEQ_RPT') as newID";

		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(getNewIDSQL);
			ResultSet rs = preparedStatement.executeQuery();	
			while (rs.next()) {
				newIDint = rs.getInt("newID");
			}
			newID = "TR_" + String.format("%05d",  newIDint);

			logger.info("New Sequence is " + rs);
			logger.info("New ID is " + newID);

		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		} 		
		return newID;
	}
	public static String getJsonText(String treeID,String type) throws SQLException{
		String jsonText="";
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;

		String getNewIDSQL = "SELECT \"JSON_TEXT\" AS json FROM \"CUST_TREE_ROLLUP_JSON\" WHERE \"TREE_ID\" = ? AND \"TYPE\" = ?";

		try {
			dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(getNewIDSQL);
			preparedStatement.setString(1, treeID);
			preparedStatement.setString(2, type);
			ResultSet rs = preparedStatement.executeQuery();	
			while (rs.next()) {
				jsonText = rs.getString("json");
			}
			logger.debug(treeID + ":" + type + " : "+ jsonText);

		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		} 		
		return jsonText;
	}
	public static void insertReportInfo(String treeID,String ACCT_GROUP,String TREE_TYPE,String SUB_TYPE,String LIBNAME,
			String DATA_NAME,String RPT_GRP_ID,String TREE_NAME,String TREE_DESC,String USERID,String AUTH_GROUP,int MAX_LEVEL) throws SQLException {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertReportInfoSQL = "INSERT INTO \"CUST_TREE_ROLLUP_MST\" "
				  + "(\"TREE_ID\",\"ACCT_GROUP\",\"TREE_TYPE\",\"SUB_TYPE\",\"LIBNAME\",\"DATA_NAME\","
				  + " \"RPT_GRP_ID\",\"TREE_NAME\",\"TREE_DESC\",\"USERID\",\"AUTH_GROUP\",\"MAX_LEVEL\",\"LASTUPDATE\") "
				  + "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)" ;
		try {
			dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertReportInfoSQL);

			preparedStatement.setString(1, treeID);
			preparedStatement.setString(2, ACCT_GROUP);
			preparedStatement.setString(3, TREE_TYPE);
			preparedStatement.setString(4, SUB_TYPE);
			preparedStatement.setString(5, LIBNAME);
			preparedStatement.setString(6, DATA_NAME);
			preparedStatement.setString(7, RPT_GRP_ID);
			preparedStatement.setString(8, TREE_NAME);
			preparedStatement.setString(9, TREE_DESC);
			preparedStatement.setString(10, USERID);
			preparedStatement.setString(11, AUTH_GROUP);
			preparedStatement.setInt(12, MAX_LEVEL);
			preparedStatement.setTimestamp(13, getCurrentTimeStamp());
			preparedStatement.executeUpdate();
			logger.info("Record is inserted into CUST_TREE_ROLLUP_MST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (dbConnection != null) {
				dbConnection.close();
			}
		}		
	}
	public static void insertReportInfo(String id,String RPT_TYPE,String AUTH_GROUP,String LIBNAME,String DATA_NAME,
			String TREE_GROUP,String TREE_NAME,String TREE_DESC,String USERID) throws SQLException {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String updateReportInfoSQL = "INSERT INTO \"CUST_TREE_ROLLUP_MST\" "
							  + "(\"RPT_TYPE\",\"AUTH_GROUP\",\"LIBNAME\",\"DATA_NAME\",\"TREE_GROUP\","
							  + " \"TREE_ID\",\"TREE_NAME\",\"TREE_DESC\",\"USERID\",\"LASTUPDATE\") "
							  + "VALUES (?,?,?,?,?,?,?,?,?,?)" ;
		try {
			dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(updateReportInfoSQL);

			preparedStatement.setString(1, RPT_TYPE);
			preparedStatement.setString(2, AUTH_GROUP);
			preparedStatement.setString(3, LIBNAME);
			preparedStatement.setString(4, DATA_NAME);
			preparedStatement.setString(5, TREE_GROUP);
			preparedStatement.setString(6, id);
			preparedStatement.setString(7, TREE_NAME);
			preparedStatement.setString(8, TREE_DESC);
			preparedStatement.setString(9, USERID);
			preparedStatement.setTimestamp(10, getCurrentTimeStamp());
			preparedStatement.executeUpdate();
			logger.info("Record is updated into CUST_TREE_ROLLUP_MST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
	}
	public static void updateReportInfo(String TREE_ID,String ACCT_GROUP,String TREE_TYPE,String SUB_TYPE,String LIBNAME,
			String DATA_NAME,String RPT_GRP_ID,String TREE_NAME,String TREE_DESC,String USERID,String AUTH_GROUP,int MAX_LEVEL) throws SQLException {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String updateReportInfoSQL = "UPDATE \"CUST_TREE_ROLLUP_MST\" "
				+ "SET \"ACCT_GROUP\"=? , \"TREE_TYPE\"=? , \"SUB_TYPE\"=? , \"LIBNAME\"=? , \"DATA_NAME\"=? , "
				+ " \"RPT_GRP_ID\"=? , \"TREE_NAME\"=? , \"TREE_DESC\"=? , \"USERID\"=?,\"AUTH_GROUP\"=?,\"MAX_LEVEL\"=?,\"LASTUPDATE\"=? "
				+ "WHERE \"TREE_ID\"= ?" ;
		try {
			dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(updateReportInfoSQL);

			preparedStatement.setString(1, ACCT_GROUP);
			preparedStatement.setString(2, TREE_TYPE);
			preparedStatement.setString(3, SUB_TYPE);
			preparedStatement.setString(4, LIBNAME);
			preparedStatement.setString(5, DATA_NAME);
			preparedStatement.setString(6, RPT_GRP_ID);
			preparedStatement.setString(7, TREE_NAME);
			preparedStatement.setString(8, TREE_DESC);
			preparedStatement.setString(9, USERID);
			preparedStatement.setString(10, AUTH_GROUP);
			preparedStatement.setInt(11, MAX_LEVEL);
			preparedStatement.setTimestamp(12, getCurrentTimeStamp()); 
			preparedStatement.setString(13, TREE_ID);
			preparedStatement.executeUpdate();
			logger.info("Record is updated into CUST_TREE_ROLLUP_MST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (dbConnection != null) {
				dbConnection.close();
			}
		}

	}
	public static void updateReportInfo(String id,String RPT_TYPE,String AUTH_GROUP,String LIBNAME,String DATA_NAME,
			String TREE_GROUP,String TREE_NAME,String TREE_DESC,String USERID) throws SQLException {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		/*
	     RPT_TYPE		char(50)		label = "보고서형태"
	    ,AUTH_GROUP    	char(30)		label = "사용부서"
	    ,TREE_GROUP   	char(100)		label = "트리그룹"
	    ,LIBNAME		char(8)			label = "Libname"
	    ,DATA_NAME    	char(32)		label = "데이터명"
	    ,TREE_ID		char(10)		label = "트리ID"
	    ,TREE_NAME		char(10)		label = "트리명"
	    ,TREE_DESC		char(100)		label = "트리설명"
	    ,USERID			char(10)		label = "작성자ID"
	    ,LASTUPDATE   	num				label = "마지막저장일자" 	
		 */
		String updateReportInfoSQL = "UPDATE \"CUST_TREE_ROLLUP_MST\" "
							  + "SET \"RPT_TYPE\"=? , \"AUTH_GROUP\"=? , \"LIBNAME\"=? , \"DATA_NAME\"=? , \"TREE_GROUP\"=? , "
							  + " \"TREE_NAME\"=? , \"TREE_DESC\"=? , \"USERID\"=? , \"LASTUPDATE\"=? "
							  + "WHERE \"TREE_ID\"= ?" ;
		try {
			dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(updateReportInfoSQL);

			preparedStatement.setString(1, RPT_TYPE);
			preparedStatement.setString(2, AUTH_GROUP);
			preparedStatement.setString(3, LIBNAME);
			preparedStatement.setString(4, DATA_NAME);
			preparedStatement.setString(5, TREE_GROUP);
			preparedStatement.setString(6, TREE_NAME);
			preparedStatement.setString(7, TREE_DESC);
			preparedStatement.setString(8, USERID);
			preparedStatement.setTimestamp(9, getCurrentTimeStamp());
			preparedStatement.setString(10, id);
			preparedStatement.executeUpdate();
			logger.info("Record is updated into CUST_TREE_ROLLUP_MST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
	}
	
	public static void updateReportLayout(String objTreeLayout,String objFlatLayout,String objTreeFilter,String objTreeMStats,String objFlatMStats,String TREE_ID) 
			throws SQLException, JSONException {
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			updateTreeReportJSON(TREE_ID, "LT", objTreeLayout, dbConnection);
			updateTreeReportJSON(TREE_ID, "LF", objFlatLayout, dbConnection);
			updateTreeReportJSON(TREE_ID, "FT", objTreeFilter, dbConnection);
			updateTreeReportJSON(TREE_ID, "MT", objTreeMStats, dbConnection);
			updateTreeReportJSON(TREE_ID, "MF", objTreeMStats, dbConnection);
			deleteReportLST(TREE_ID, dbConnection);
			deleteReportMSF(TREE_ID, dbConnection);
			deleteReportMS(TREE_ID, dbConnection);
			insertReportLST(TREE_ID, objFlatLayout, dbConnection);
			//insertReportMStats(treeID,objTreeMStats,dbConnection);
			insertReportMStatsFlat(TREE_ID,objFlatMStats,dbConnection);
			insertReportFilter(TREE_ID,objTreeFilter,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
	}
	public static void updateReportLayout(String objTreeLayout,String objFlatLayout,String objTreeFilter,String TREE_ID) 
			throws SQLException, JSONException {
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			updateTreeReportJSON(TREE_ID, "LT", objTreeLayout, dbConnection);
			updateTreeReportJSON(TREE_ID, "LF", objFlatLayout, dbConnection);
			updateTreeReportJSON(TREE_ID, "FT", objTreeFilter, dbConnection);
			deleteReportLST(TREE_ID, dbConnection);
			deleteReportMSF(TREE_ID, dbConnection);
			deleteReportMS(TREE_ID, dbConnection);
			insertReportLST(TREE_ID, objFlatLayout, dbConnection);
			//insertReportMStats(treeID,objTreeMStats,dbConnection);
			insertReportFilter(TREE_ID,objTreeFilter,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
	}

	private static void updateTreeReportJSON(String treeID, String type, String objText,Connection dbConnection) throws SQLException {
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String updateTableSQL = "UPDATE \"CUST_TREE_ROLLUP_JSON\" SET \"JSON_TEXT\"=? WHERE \"TREE_ID\"= ? AND \"TYPE\" = ? " ;
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(updateTableSQL);

			preparedStatement.setString(1, objText);
			preparedStatement.setString(2, treeID);
			preparedStatement.setString(3, type);
			preparedStatement.executeUpdate();
			logger.info("Record is updated into CUST_TREE_ROLLUP_JSON table! -- type : " + type);
			System.out.println("objText : \n" + objText);
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	/*
	public static void insertReportLayout(String objFlatLayout,String objTreeFilter,String objTreeMStats,String treeID) throws SQLException, JSONException {
	}
	*/
	private static void insertReportJSON(String treeID, String type, String objText,Connection dbConnection) throws SQLException, JSONException {
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "INSERT INTO \"CUST_TREE_ROLLUP_JSON\" (\"TREE_ID\", \"TYPE\", \"JSON_TEXT\") VALUES (?,?,?)";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);

			preparedStatement.setString(1, treeID);
			preparedStatement.setString(2, type);
			preparedStatement.setString(3, objText);
			preparedStatement.executeUpdate();
			logger.info("Record is inserted into CUST_TREE_ROLLUP_JSON table!");

		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	public static String insertReportLayout(String objTreeLayout,String objFlatLayout,String objTreeFilter,String objTreeMStats) throws SQLException, JSONException {
		String newTreeID="";
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			newTreeID = getNewTreeID(dbConnection);
			insertReportJSON(newTreeID, "LT", objTreeLayout,dbConnection);
			insertReportJSON(newTreeID, "LF", objFlatLayout,dbConnection);
			insertReportJSON(newTreeID, "FT", objTreeFilter,dbConnection);
			insertReportJSON(newTreeID, "MT", objTreeMStats,dbConnection);

			insertReportLST(newTreeID, objFlatLayout,dbConnection);
			insertReportMStats(newTreeID,objTreeMStats,dbConnection);
			insertReportFilter(newTreeID,objTreeFilter,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
		return newTreeID;
	}
	public static String insertReportLayout(String objTreeLayout,String objFlatLayout,String objTreeFilter,String objTreeMStats,String objFlatMStats) throws SQLException, JSONException {
		String newTreeID="";
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			newTreeID = getNewTreeID(dbConnection);
			insertReportJSON(newTreeID, "LT", objTreeLayout,dbConnection);
			insertReportJSON(newTreeID, "LF", objFlatLayout,dbConnection);
			insertReportJSON(newTreeID, "FT", objTreeFilter,dbConnection);
			insertReportJSON(newTreeID, "MT", objTreeMStats,dbConnection);
			insertReportJSON(newTreeID, "MF", objFlatMStats,dbConnection);

			insertReportLST(newTreeID, objFlatLayout,dbConnection);
			insertReportMStatsFlat(newTreeID,objFlatMStats,dbConnection);
			insertReportFilter(newTreeID,objTreeFilter,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
		return newTreeID;
	}
	public static String insertReportLayout(String objTreeLayout,String objFlatLayout,String objTreeFilter) throws SQLException, JSONException {
		String newTreeID="";
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			newTreeID = getNewTreeID(dbConnection);
			insertReportJSON(newTreeID, "LT", objTreeLayout,dbConnection);
			insertReportJSON(newTreeID, "LF", objFlatLayout,dbConnection);
			insertReportJSON(newTreeID, "FT", objTreeFilter,dbConnection);

			insertReportLST(newTreeID, objFlatLayout,dbConnection);
			insertReportFilter(newTreeID,objTreeFilter,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
		return newTreeID;
	}

	private static String getJson(String treeID,String type,Connection dbConnection) throws SQLException, JSONException{
		String jsonText="";
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;

		String getJsonText = "SELECT \"JSON_TEXT\" from \"CUST_TREE_ROLLUP_JSON\" "
				   + "WHERE \"TREE_ID\" = ? AND \"TYPE\" = ?"; 


		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(getJsonText);
			preparedStatement.setString(1, treeID);
			preparedStatement.setString(2, type);
			ResultSet rs = preparedStatement.executeQuery();	
			while (rs.next()) {
				jsonText = rs.getString("JSON_TEXT");
			}
			//System.out.println("jsonText : \n" + jsonText);
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
		return jsonText;
	}
	private static void deleteReportJSON(String treeID,Connection dbConnection) throws SQLException {
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "DELETE FROM \"CUST_TREE_ROLLUP_LST\" WHERE \"TREE_ID\" = ? ";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);

			preparedStatement.setString(1, treeID);
			preparedStatement.executeUpdate();
			logger.info("Records are deleted from CUST_TREE_ROLLUP_LST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	public static void deleteTreeReport(String treeID) throws SQLException{
		Connection dbConnection = null;
		try {
			dbConnection = getDBConnection();
			deleteReportMST(treeID,dbConnection);
			deleteReportLST(treeID,dbConnection);
			deleteReportMSF(treeID,dbConnection);
			deleteReportJSON(treeID,dbConnection);
		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage()); 
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
	}
	private static void deleteReportMST(String treeID,Connection dbConnection) throws SQLException {
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "DELETE FROM \"CUST_TREE_ROLLUP_MST\" WHERE \"TREE_ID\" = ? ";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);
			preparedStatement.setString(1, treeID);
			preparedStatement.executeUpdate();
			logger.info("Record is deleted from CUST_TREE_ROLLUP_MST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	private static void deleteReportMSF(String treeID,Connection dbConnection) throws SQLException {
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "DELETE FROM \"CUST_TREE_ROLLUP_MSF\" WHERE \"TREE_ID\" = ? ";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);
			preparedStatement.setString(1, treeID);
			preparedStatement.executeUpdate();
			logger.info("Record is deleted from CUST_TREE_ROLLUP_MST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	private static void deleteReportLST(String treeID,Connection dbConnection) throws SQLException {
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "DELETE FROM \"CUST_TREE_ROLLUP_LST\" WHERE \"TREE_ID\" = ? ";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);
			preparedStatement.setString(1, treeID);
			preparedStatement.executeUpdate();
			logger.info("Record is deleted from CUST_TREE_ROLLUP_LST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	private static void deleteReportMS(String treeID,Connection dbConnection) throws SQLException {
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "DELETE FROM \"CUST_TREE_ROLLUP_MS\" WHERE \"TREE_ID\" = ? ";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);
			preparedStatement.setString(1, treeID);
			preparedStatement.executeUpdate();
			logger.info("Record is deleted from CUST_TREE_ROLLUP_MS table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	private static void insertReportLST(String treeID, String objFlatLayout,Connection dbConnection) throws SQLException, JSONException {
		deleteReportJSON(treeID,dbConnection);
		JSONArray jsonArr = new JSONArray(objFlatLayout);

		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "INSERT INTO \"CUST_TREE_ROLLUP_LST\" (\"TREE_ID\", \"SEQ_NO\",\"ID\", \"PID\", \"COL_NAME\", \"FMT_NAME\", \"CODE\") VALUES (?,?,?,?,?,?,?)";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);
			
			for (int rii=0; rii<jsonArr.length(); rii++){
				if (rii!=0){
					JSONObject row=jsonArr.getJSONObject(rii);
					JSONObject rowData = row.getJSONObject("data").getJSONObject("0");
					String id = row.getString("id");
					String pid = row.getString("parent");
					String columnsName = rowData.getString("columnsName");
					String columnsFormat = rowData.getString("columnsFormat");
					String attrCode = rowData.getString("attrCode");
					System.out.println("id : \t" + id + ":\t" + pid+ ":\t" + columnsName+ ":\t" + columnsFormat+ ":\t" + attrCode);
					preparedStatement.setString(1, treeID);
					preparedStatement.setInt(2, rii);
					preparedStatement.setString(3, id);
					preparedStatement.setString(4, pid);
					preparedStatement.setString(5, columnsName);
					preparedStatement.setString(6, columnsFormat);
					preparedStatement.setString(7, attrCode);
					preparedStatement.addBatch();
					preparedStatement.clearParameters();
				} 
			}
			preparedStatement.executeBatch();

			logger.info("Records are inserted into CUST_TREE_ROLLUP_LST table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	private static void insertReportMStats(String treeID,String objTreeMStats,Connection dbConnection) throws JSONException, SQLException{
		JSONArray jsonArr = new JSONArray(objTreeMStats);

		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertSQL = "INSERT INTO \"CUST_TREE_ROLLUP_MSF\" "
				+ " (\"TREE_ID\", \"TYPE\", \"COL_NAME\", \"FMT_NAME\") "
				+ " VALUES (?,?,?,?)";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertSQL);	
			JSONArray analL	=jsonArr.getJSONObject(0).getJSONArray("children");	// Measures
			for(int aii=0; aii<analL.length();aii++){
				JSONObject analObj=analL.getJSONObject(aii);
				JSONObject analData=analObj.getJSONObject("data").getJSONObject("0");
				String analVar=analData.getString("columnName");		
				String analFMT=analData.getString("columnFormat");	
				System.out.println(analVar + " : " + analFMT);
				preparedStatement.setString(1, treeID);
				preparedStatement.setString(2, "MS");
				preparedStatement.setString(3, analVar);
				preparedStatement.setString(4, analFMT);
				preparedStatement.addBatch();
				preparedStatement.clearParameters();
			}
			preparedStatement.executeBatch();
			preparedStatement.close();
			
			preparedStatement = dbConnection.prepareStatement(insertSQL);
			JSONArray statL	=jsonArr.getJSONObject(1).getJSONArray("children");	// Statistics
			for(int sii=0; sii<statL.length();sii++){
				JSONObject analObj=statL.getJSONObject(sii);
				JSONObject analData=analObj.getJSONObject("data").getJSONObject("0");
				String statVar=analData.getString("columnName");		
				System.out.println(statVar + " : " );
				preparedStatement.setString(1, treeID);
				preparedStatement.setString(2, "ST");
				preparedStatement.setString(3, statVar);
				preparedStatement.setString(4, "");
				preparedStatement.addBatch();
				preparedStatement.clearParameters();
			}
			preparedStatement.executeBatch();
			preparedStatement.close();
			
			logger.info("Records are inserted into CUST_TREE_ROLLUP_MSF(Measure/Statistics) table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} 
	}
	private static void insertReportMStatsFlat(String treeID, String objFlatLayout,Connection dbConnection) throws SQLException, JSONException {
		JSONArray jsonArr = new JSONArray(objFlatLayout);

		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertTableSQL = "INSERT INTO \"CUST_TREE_ROLLUP_MS\" (\"TREE_ID\", \"SEQ_NO\",\"ID\", \"PID\", \"COL_NAME\", \"FMT_NAME\", \"COL_LABEL\") VALUES (?,?,?,?,?,?,?)";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertTableSQL);
			
			for (int rii=0; rii<jsonArr.length(); rii++){
				if (rii!=0){
					JSONObject row=jsonArr.getJSONObject(rii);
					JSONObject rowData = row.getJSONObject("data").getJSONObject("0");
					String id = row.getString("id");
					String pid = row.getString("parent");
					String columnName = "";
					String columnFormat = "";
					String columnLabel = "";
					columnName=rowData.getString("columnName");
					if ( rowData.has("columnFormat")){
						columnFormat=rowData.getString("columnFormat");
						columnLabel=rowData.getString("columnLabel");
					} else {
						columnFormat="STATISTICS";
					}
					System.out.println("id : \t" + id + ":\t" + pid+ ":\t" + columnName+ ":\t" + columnFormat);
					logger.info("id : \t" + id + ":\t" + pid+ ":\t" + columnName+ ":\t" + columnFormat);
					preparedStatement.setString(1, treeID);
					preparedStatement.setInt(2, rii);
					preparedStatement.setString(3, id);
					preparedStatement.setString(4, pid);
					preparedStatement.setString(5, columnName);
					preparedStatement.setString(6, columnFormat);
					preparedStatement.setString(7, columnLabel);
					preparedStatement.addBatch();
					preparedStatement.clearParameters();
				} 
			}
			preparedStatement.executeBatch();

			logger.info("Records are inserted into CUST_TREE_ROLLUP_MS table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}
	}
	private static void insertReportFilter(String treeID,String objTreeFilter,Connection dbConnection) throws JSONException, SQLException{
		JSONArray jsonArr = new JSONArray(objTreeFilter);

		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		String insertSQL = "INSERT INTO \"CUST_TREE_ROLLUP_MSF\" "
				+ " (\"TREE_ID\", \"TYPE\", \"COL_NAME\", \"FMT_NAME\", \"VALUE\") "
				+ " VALUES (?,?,?,?,?)";
		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(insertSQL);	
			for(int fii=0; fii<jsonArr.length();fii++){
				JSONObject filterL	=jsonArr.getJSONObject(fii);	//	// Filter
				JSONArray attrL = filterL.getJSONArray("children");
				String columnName	= filterL.getJSONObject("data").getJSONObject("0").getString("columnName");	
				String columnFormat	= filterL.getJSONObject("data").getJSONObject("0").getString("columnFormat");	

				for(int fjj=0; fjj<attrL.length();fjj++){
					JSONObject attrObj=attrL.getJSONObject(fjj);
					JSONObject attrState=attrObj.getJSONObject("state");//.getJSONObject("0");
					boolean isSelected = attrState.getBoolean("selected");
					if (isSelected){
						JSONObject attrData=attrObj.getJSONObject("data").getJSONObject("0");
						//String columnName 	= attrData.getString("columnsName");		
						String attrCode		= attrData.getString("attrCode");	
						System.out.println(columnName + " : " + columnFormat+ " : " + attrCode);
						preparedStatement.setString(1, treeID);
						preparedStatement.setString(2, "FT");
						preparedStatement.setString(3, columnName);
						preparedStatement.setString(4, columnFormat);
						preparedStatement.setString(5, attrCode);
						preparedStatement.addBatch();
						preparedStatement.clearParameters();
					}
				}
			}
			preparedStatement.executeBatch();
			
			logger.info("Records are inserted into CUST_TREE_ROLLUP_MSF(Filter) table!");
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		}	
	}
	
	private static Connection getDBConnection() {
		logger.info(getDB_DRIVER());
		logger.info(getDB_CONNECTION());
		logger.info(getDB_USER());
		logger.info(getDB_PASSWORD());
		Connection dbConnection = null;
		try {
			Class.forName(getDB_DRIVER());
		} catch (ClassNotFoundException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		}
		try {
			dbConnection = DriverManager.getConnection(getDB_CONNECTION(), getDB_USER(),getDB_PASSWORD());
			return dbConnection;
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		}
		return dbConnection;
	}

	private static java.sql.Timestamp getCurrentTimeStamp() {
		java.util.Date today = new java.util.Date();
		return new java.sql.Timestamp(today.getTime());
	}

	private static String getDB_DRIVER() {
		return DB_DRIVER;
	}

	private static void setDB_DRIVER(String dB_DRIVER) {
		DB_DRIVER = dB_DRIVER;
	}

	private static String getDB_CONNECTION() {
		return DB_CONNECTION;
	}

	private static void setDB_CONNECTION(String dB_CONNECTION) {
		DB_CONNECTION = dB_CONNECTION;
	}

	private static String getDB_USER() {
		return DB_USER;
	}

	private static void setDB_USER(String dB_USER) {
		DB_USER = dB_USER;
	}

	private static String getDB_PASSWORD() {
		return DB_PASSWORD;
	}

	private static void setDB_PASSWORD(String dB_PASSWORD) {
		DB_PASSWORD = dB_PASSWORD;
	}
}
