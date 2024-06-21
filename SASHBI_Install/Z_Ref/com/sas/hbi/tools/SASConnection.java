package com.sas.hbi.tools;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

import javax.sql.RowSet;

import org.apache.log4j.Logger;

import sun.jdbc.rowset.CachedRowSet;

import com.sas.rio.MVAConnection;
import com.sas.services.connection.BridgeServer;
import com.sas.services.connection.ConnectionFactoryConfiguration;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.connection.ConnectionFactoryInterface;
import com.sas.services.connection.ConnectionFactoryManager;
import com.sas.services.connection.ConnectionInterface;
import com.sas.services.connection.ManualConnectionFactoryConfiguration;
import com.sas.services.connection.Server;
import com.sas.iom.SAS.IDataService;
import com.sas.iom.SAS.ILanguageService;
import com.sas.iom.SAS.IWorkspace;
import com.sas.iom.SAS.IWorkspaceHelper;
import com.sas.iom.SAS.ILanguageServicePackage.CarriageControlSeqHolder;
import com.sas.iom.SAS.ILanguageServicePackage.LineTypeSeqHolder;
import com.sas.iom.SASIOMDefs.GenericError;
import com.sas.iom.SASIOMDefs.StringSeqHolder;
import com.sas.prompts.valueprovider.dynamic.DataProvider;
import com.sas.storage.exception.ServerConnectionException;
import com.sas.storage.jdbc.JDBCToTableModelAdapter;

public class SASConnection {
	/*
	private final static int RESULT_SET_TYPE_BIT           = -7;
	private final static int RESULT_SET_TYPE_TINYINT       = -6;
	private final static int RESULT_SET_TYPE_SMALLINT      = 5;
	private final static int RESULT_SET_TYPE_INTEGER       = 4;
	private final static int RESULT_SET_TYPE_BIGINT        = -5;
	private final static int RESULT_SET_TYPE_FLOAT         = 6;
	private final static int RESULT_SET_TYPE_REAL          = 7;
	private final static int RESULT_SET_TYPE_DOUBLE        = 8;
	private final static int RESULT_SET_TYPE_NUMERIC       = 2;
	private final static int RESULT_SET_TYPE_DECIMAL       = 3;
	private final static int RESULT_SET_TYPE_CHAR          = 1;
	private final static int RESULT_SET_TYPE_VARCHAR       = 12;
	private final static int RESULT_SET_TYPE_LONGVARCHAR   = -1;
	private final static int RESULT_SET_TYPE_DATE          = 91;
	private final static int RESULT_SET_TYPE_TIME          = 92;
	private final static int RESULT_SET_TYPE_TIMESTAMP     = 93; 
	private final static int RESULT_SET_TYPE_BINARY        = -2;
	private final static int RESULT_SET_TYPE_VARBINARY     = -3;
	private final static int RESULT_SET_TYPE_LONGVARBINARY = -4;
	*/
	
	static Logger logger = Logger.getLogger("SASConnection.java");
	/**
	 * @param args
	 */
	public static IWorkspace getWorkspace(DataProvider dataProvider,String logicalServerName, String stmt) 
			throws ConnectionFactoryException, GenericError, ServerConnectionException{

		IWorkspace iWorkspace = dataProvider.getIWorkspace(logicalServerName);
		
		ILanguageService sasLanguage = iWorkspace.LanguageService();
		sasLanguage.Submit(stmt);
		CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
		LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
		StringSeqHolder logHldr = new StringSeqHolder();
		sasLanguage.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr, logLineTypeHldr, logHldr);
		String[] logLines = logHldr.value;
		for (int i = 0; i < logLines.length; i++) {
			logger.info(logLines[i]);			
		}
		return iWorkspace;	 
	}
	public static IWorkspace getWorkspace(String serverType, String serverName, int port, String userName, String passwd, String stmt) {
		logger.debug("getWorkspace(String serverType, String serverName, int port, String userName, String passwd, String stmt) started...");
		String classID = null;
		if (serverType.equalsIgnoreCase("POOLED")) {
			classID = Server.CLSID_POOLED_SAS;
		} else {
			classID = Server.CLSID_SAS;
		}
		Server server = new BridgeServer(classID,serverName,port);
		ConnectionFactoryConfiguration cxfConfig = new ManualConnectionFactoryConfiguration(server);
		ConnectionFactoryManager cxfManager = new ConnectionFactoryManager();
		ConnectionFactoryInterface cxf = null;
		ConnectionInterface cx = null;
		try
		{
			cxf = cxfManager.getFactory(cxfConfig);
			cx = cxf.getConnection(userName,passwd);
		}
		catch (ConnectionFactoryException cfe)
		{
			logger.debug("ConnectionFactoryException....");
			cfe.printStackTrace();
			//System.exit(1);
		}
		
		// narrow and use the connection
		org.omg.CORBA.Object obj = cx.getObject();
		IWorkspace iWorkspace = IWorkspaceHelper.narrow(obj);
		ILanguageService  sasLanguage=iWorkspace.LanguageService();
		try {
			sasLanguage.Submit(stmt);
		} catch (GenericError e) {
			logger.debug("GenericError 107....");
			e.printStackTrace();
		}
		CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
		LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
		StringSeqHolder logHldr = new StringSeqHolder();
		try {
			sasLanguage.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr, logLineTypeHldr, logHldr);
		} catch (GenericError e) {
			logger.debug("GenericError 117....");
			e.printStackTrace();
		}
		String[] logLines = logHldr.value;
		for (int i = 0; i < logLines.length; i++) {
			logger.info(logLines[i]);			
		}
		return iWorkspace;
	} 
	public static JDBCToTableModelAdapter getTableModel(DataProvider dataProvider,String logicalServerName, String libstmt) 
			throws ConnectionFactoryException, GenericError, ServerConnectionException{
		IWorkspace sasConn=getWorkspace(dataProvider,logicalServerName,libstmt);
		IDataService dService = sasConn.DataService();

		Connection sqlConnection=null;
		JDBCToTableModelAdapter adapter=null;
		try {
			sqlConnection = new MVAConnection(dService,new Properties());

			adapter=new JDBCToTableModelAdapter();
			adapter.setModel(sqlConnection);
			adapter.setReadOnly(false);
			adapter.setTrimUsed(true);
			adapter.setFormattedDataUsed(true);
		}
		catch (SQLException e) {
			e.printStackTrace();
		} 
		return adapter;
		
	}
	public static Connection getSQLConn(DataProvider dataProvider,String logicalServerName, String libstmt) throws GenericError, ServerConnectionException, ConnectionFactoryException {
		IWorkspace workspace=getWorkspace(dataProvider,logicalServerName,libstmt);
		IDataService dataService = workspace.DataService();
		RowSet rowset=null;
    	Connection jdbcConn = null;
    	Statement statement = null;
    	ResultSet rs = null;
    	CachedRowSet crs = null;
		try {
			jdbcConn = new MVAConnection(dataService, new Properties());
		} catch (SQLException e) {
			e.printStackTrace();
		}	

		return jdbcConn;
	}
}
