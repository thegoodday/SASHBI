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

public class Grid2SASData {
	private static String LogicalServerName = "";

	//private static Logger logger = Logger.getLogger("Grid2SASData");
	private Logger logger ;
	
	public Grid2SASData() throws IOException{
		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();
		Grid2SASData.setLogicalServerName(conf.getProperty("app.logicalServerName"));
		this.logger = Logger.getLogger(getClass().getName());

	}

	public static void main(String[] argv) throws JSONException, IOException, GenericError, ServerConnectionException, SQLException, ConnectionFactoryException {
		String gridData="[{'Dept1':'Sales','Dept2':'Sales','Dept3':'Sales Mgmt','refDept':1,'empid':'korhbc','empno':'E8659','koName':'최희복','enName':'Choi, Hee-Bok','koTitle':'전무','enTitle':'Senior Director, Sales'},{'Dept1':'Sales','Dept2':'Sales','Dept3':'Partner Sales','refDept':3,'empid':'korlih','empno':'35139','koName':'이인호','enName':'Lee, InHo','koTitle':'상무','enTitle':'Director, Partner Sales'}]";
		//JSONObject gridTable = new JSONObject("{"+gridData+"}");

		Grid2SASData gr2sas = new Grid2SASData();  
		gr2sas.makeSASTable(gridData,"","sales", "sales_org", null,null);
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
	public void makeSASTable(String gridData,String userID,String libname,String dataName,String path,DataProvider dataProvider) 
			throws SQLException, JSONException, GenericError, ServerConnectionException, ConnectionFactoryException {
		IWorkspace iWorkspace = null;
		String sasCode	= "";

		try {
			iWorkspace = SASConnection.getWorkspace(dataProvider,getLogicalServerName(),"");
			//iWorkspace = SASConnection.getWorkspace("POOLED","koryhh5",8701,"sasdemo","sask@123","");
			sasCode	 = ";*\';*\";*/;quit;run;\n";
			sasCode += "OPTIONS OBS=MAX SPOOL NOMPRINT NOERRORABEND NOSYNTAXCHECK LS=256 NOQUOTELENMAX;\n";
			sasCode	+= "LIBNAME SAVEA '"+ path +"';\n";
			sasCode	+= "DATA WORK.DUMMY;_DUMMY_=0;RUN;\n";
			sasCode += "DATA SAVEA."+dataName+";\n";
			sasCode += "  SET " + libname + "." + dataName + "(OBS=1) WORK.DUMMY; \n";
			sasCode += "  IF _N_ EQ 1 THEN DO;\n";
			JSONArray gridTable = new JSONArray(gridData);
			for(int ii=0;ii<gridTable.length();ii++){
				JSONObject colObj = (JSONObject)gridTable.get(ii);
				Iterator<?> colkeys = colObj.keys();
			    while( colkeys.hasNext() ) {
				    String colid = (String)colkeys.next();
				    Object objCval = colObj.get(colid);
				    String colVal = "";
				    String varType ="";
				    if ( objCval instanceof String) {
				    	colVal = colObj.getString(colid);
				    	String cr = "\'||\"0D0A\"x||\'";
				    	colVal = colVal.replaceAll("\'", "");
						colVal = colVal.replaceAll("\n", cr);
				    	varType = "C";
				    } else if (objCval instanceof Integer){
				    	colVal = String.valueOf(colObj.getInt(colid));			    	
				    	varType = "N";
				    } else if (objCval instanceof Long){
				    	colVal = String.valueOf(colObj.getDouble(colid));			    	
				    	varType = "N";
				    } else if (objCval instanceof Float){
				    	colVal = String.valueOf(colObj.getDouble(colid));			    	
				    	varType = "N";
				    } else if (objCval instanceof Double){
				    	colVal = String.valueOf(colObj.getDouble(colid));			    	
				    	varType = "N";
				    }
				    
				    //System.out.println("colName : " + colid +"\tcolVal : " + colVal );
				    logger.trace("colName : " + colid +"\tcolVal : " + colVal);
				    if (varType == "C") {
				    	sasCode += "    "+colid+" = '"+colVal+"';\n";
				    } else {
				    	if(colVal.equalsIgnoreCase("")){colVal=".";}
				    	sasCode += "    "+colid+" = "+colVal+";\n";
				    }
				}
			    sasCode += "    DROP _DUMMY_;\n";
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
				logger.trace("SAS Log : " + logStr);
				//System.out.println("SAS Log : " + logStr);
			}	
			System.out.println("kkkk");

		} finally {
			//iWorkspace.Close();
		}
	}

	private static java.sql.Timestamp getCurrentTimeStamp() {
		java.util.Date today = new java.util.Date();
		return new java.sql.Timestamp(today.getTime());
	}
	private static String getLogicalServerName() {
		return LogicalServerName;
	}
	private static void setLogicalServerName(String logicalServerName) {
		LogicalServerName = logicalServerName;
	}

}
