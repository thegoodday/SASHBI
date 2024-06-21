package com.sas.hbi.dao;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

//import com.sas.hbi.tools.HBIConfig;
import com.sas.hbi.property.HBIConfig;
import com.sas.iom.SAS.ILanguageService;
import com.sas.iom.SAS.IWorkspace;
import com.sas.iom.SAS.ILanguageServicePackage.CarriageControlSeqHolder;
import com.sas.iom.SAS.ILanguageServicePackage.LineTypeSeqHolder;
import com.sas.iom.SASIOMDefs.GenericError;
import com.sas.iom.SASIOMDefs.StringSeqHolder;
import com.sas.prompts.valueprovider.dynamic.DataProvider;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.storage.exception.ServerConnectionException;
import com.sas.hbi.tools.SASConnection;

public class Format {

	private static String DB_DRIVER = "";
	private static String DB_CONNECTION = "";
	private static String DB_USER = "";
	private static String DB_PASSWORD = "";
	private static String LogicalServerName = "";
	
	
	private static Logger logger = Logger.getLogger("PG");
	
	public Format() throws IOException{
		//Properties conf = new HBIConfig().getConfig();
		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();

		Format.setDB_DRIVER(conf.getProperty("alm.DB_DRIVER"));
		Format.setDB_CONNECTION(conf.getProperty("alm.DB_CONNECTION"));
		Format.setDB_USER(conf.getProperty("alm.DB_USER"));
		Format.setDB_PASSWORD(conf.getProperty("alm.DB_PASSWORD"));
		Format.setLogicalServerName(conf.getProperty("app.logicalServerName"));
		System.out.println(getDB_DRIVER());
		logger.info("DB_DRIVER : " + getDB_DRIVER());
		logger.info("DB_CONNECTION : " + getDB_CONNECTION());
		logger.info("DB_USER : " + getDB_USER());
		logger.info("DB_PASSWORD : " + getDB_PASSWORD());

	}

	public static void main(String[] argv) throws JSONException, IOException, GenericError, ServerConnectionException, SQLException, ConnectionFactoryException {
		String gridData="[{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"1\",\"END\":\"1\",\"LABEL\":\"~3%이하\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"2\",\"END\":\"2\",\"LABEL\":\"~10%이하\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"3\",\"END\":\"3\",\"LABEL\":\"~20%이하\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"4\",\"END\":\"4\",\"LABEL\":\"~50%이하\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"5\",\"END\":\"5\",\"LABEL\":\"~70%이하\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"6\",\"END\":\"6\",\"LABEL\":\"~100%\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"7\",\"END\":\"7\",\"LABEL\":\"무담보\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"8\",\"END\":\"8\",\"LABEL\":\"전액담보\",\"HLO\":\"\",\"TYPE\":\"C\"},{\"FMT_NAME\":\"ATTR_00022F\",\"FMT_DESC\":\"LGD구간\",\"START\":\"9\",\"END\":\"9\",\"LABEL\":\"기타\",\"HLO\":\"\",\"TYPE\":\"C\"}]";
		//JSONObject gridTable = new JSONObject("{"+gridData+"}");

		Format Format = new Format();  
		//insertFormat("TEST Fmt Desc...", gridData, "sasdemo", "ALMConf", "CUST_FMT_LST", "c:\\temp\\"); 
		/*
		try {

			Format Format = new Format();  
		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		}
		*/
	}	
	private static String getNewFormatName(Connection dbConnection) throws SQLException{
		int newIDint =0;
		String newFormatName="";
		//Connection dbConnection = null;
		PreparedStatement preparedStatement = null;

		String getNewIDSQL = "SELECT nextval('SEQ_FMT') as format_name";

		try {
			//dbConnection = getDBConnection();
			preparedStatement = dbConnection.prepareStatement(getNewIDSQL);
			ResultSet rs = preparedStatement.executeQuery();	
			while (rs.next()) {
				newIDint = rs.getInt("format_name");
			}
			newFormatName = "ATTR_" + String.format("%05d",  newIDint)+"F";

			logger.info("New Sequence is " + rs);
			logger.info("New ID is " + newFormatName);

		} catch (SQLException e) {
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		} 		
		return newFormatName;
	}
	public static void updateFormat(String gridData,String userID,String libname,String dataName,String path,DataProvider dataProvider) 
			throws SQLException, JSONException, GenericError, ServerConnectionException, ConnectionFactoryException {
		Connection dbConnection = null;
		IWorkspace iWorkspace = null;
		String sasCode	= "";

		try {
			dbConnection = getDBConnection();
			iWorkspace = SASConnection.getWorkspace(dataProvider,getLogicalServerName(),"");
			//iWorkspace = SASConnection.getWorkspace("POOLED","koryhh5",8701,"sasdemo","sask@123","");
			sasCode	 = ";*\';*\";*/;quit;run;\n";
			sasCode += "OPTIONS OBS=MAX SPOOL NOMPRINT NOERRORABEND NOSYNTAXCHECK LS=256 NOQUOTELENMAX;\n";
			sasCode	+= "LIBNAME SAVEA '"+ path +"';\n";
			sasCode += "DATA SAVEA."+dataName+";\n";
			sasCode += "  SET " + libname + "." + dataName + "(OBS=1);\n";
			sasCode += "  IF _N_ EQ 1 THEN DO;\n";
			JSONArray gridTable = new JSONArray(gridData);
			for(int ii=0;ii<gridTable.length();ii++){
				JSONObject colObj = (JSONObject)gridTable.get(ii);
				Iterator<?> colkeys = colObj.keys();
			    while( colkeys.hasNext() ) {
				    String colid = (String)colkeys.next();
				    String colVal	=(String)colObj.get(colid);
				    System.out.println("colName : " + colid +"\tcolVal : " + colVal );
				    logger.debug("colName : " + colid +"\tcolVal : " + colVal);
				    sasCode += "    "+colid+" = '"+colVal+"';\n";
				}
			    sasCode += "    OUTPUT;\n";
			}
			sasCode += "  END;\n";
			sasCode += "RUN;\n";
			ILanguageService sas = iWorkspace.LanguageService();
			sas.Submit(sasCode);
			logger.debug("sasCode : " + sasCode);
			CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
			LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
			StringSeqHolder logHldr = new StringSeqHolder();
			sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
			String[] logLines = logHldr.value;
			String logStr="";
			for (int logii=0;logii<logLines.length;logii++){
				logStr=logLines[logii];
				logger.debug("SAS Log : " + logStr);
				System.out.println("SAS Log : " + logStr);
			}	

		} finally {

		}
	}
	public static String insertFormat(String fmt_desc,String gridData,String userID,String libname,String dataName,String path,DataProvider dataProvider) throws SQLException, JSONException, GenericError, ServerConnectionException, ConnectionFactoryException {
		String newFormatName="";
		Connection dbConnection = null;
		IWorkspace iWorkspace = null;
		String sasCode	= "";

		try {
			dbConnection = getDBConnection();
			iWorkspace = SASConnection.getWorkspace(dataProvider,getLogicalServerName(),"");
			//iWorkspace = SASConnection.getWorkspace("POOLED","koryhh5",8701,"sasdemo","sask@123","");
			newFormatName = getNewFormatName(dbConnection);
			sasCode	 = ";*\';*\";*/;quit;run;\n";
			sasCode += "OPTIONS OBS=MAX SPOOL NOMPRINT NOERRORABEND NOSYNTAXCHECK LS=256 NOQUOTELENMAX;\n";
			sasCode	+= "LIBNAME SAVEA '"+ path +"';\n";
			sasCode += "DATA SAVEA."+dataName+";\n";
			sasCode += "  SET " + libname + "." + dataName + "(OBS=1);\n";
			sasCode += "  IF _N_ EQ 1 THEN DO;\n";
			JSONArray gridTable = new JSONArray(gridData);
			for(int ii=0;ii<gridTable.length();ii++){
				JSONObject colObj = (JSONObject)gridTable.get(ii);
				Iterator<?> colkeys = colObj.keys();
			    while( colkeys.hasNext() ) {
				    String colid = (String)colkeys.next();
				    if (colid.toUpperCase().equalsIgnoreCase("FMT_NAME") || colid.toUpperCase().equalsIgnoreCase("FMT_LABEL")) {
						sasCode += "    FMT_NAME='"+newFormatName+"';\n";
						sasCode += "  	FMT_LABEL='"+fmt_desc+"';\n";
				    } else {
					    String colVal	=(String)colObj.get(colid);
					    System.out.println("colName : " + colid +"\tcolVal : " + colVal );
					    logger.debug("colName : " + colid +"\tcolVal : " + colVal);
					    sasCode += "    "+colid+" = '"+colVal+"';\n";				    	
				    }
				}
			    sasCode += "    OUTPUT;\n";
			}
			sasCode += "  END;\n";
			sasCode += "RUN;\n";
			ILanguageService sas = iWorkspace.LanguageService();
			sas.Submit(sasCode);
			logger.debug("sasCode : " + sasCode);
			CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
			LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
			StringSeqHolder logHldr = new StringSeqHolder();
			sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
			String[] logLines = logHldr.value;
			String logStr="";
			for (int logii=0;logii<logLines.length;logii++){
				logStr=logLines[logii];
				logger.debug("SAS Log : " + logStr);
				System.out.println("SAS Log : " + logStr);
			}	

		} catch (SQLException e) {
			logger.error("SQLException occured!");
			logger.error(e.getMessage());
			System.out.println(e.getMessage());
		} finally {
			if (dbConnection != null) {
				dbConnection.close();
			}
		}
		return newFormatName;
	}
	private static Connection getDBConnection() {
		logger.info(getDB_DRIVER());
		logger.info(getDB_CONNECTION());
		logger.info(getDB_USER());
		logger.info(getDB_PASSWORD());
		Connection dbConnection = null;
		System.out.println("Driver: " + getDB_DRIVER());
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
	private static String getLogicalServerName() {
		return LogicalServerName;
	}
	private static void setLogicalServerName(String logicalServerName) {
		LogicalServerName = logicalServerName;
	}

}
