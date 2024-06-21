package com.sas.hbi.storedprocess;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.rmi.RemoteException;
import java.util.Date;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.sas.hbi.property.HBIConfig;
import com.sas.prompts.InvalidPromptValueException;
import com.sas.services.InitializationException;
import com.sas.services.ServiceException;
import com.sas.services.TransportException;
import com.sas.services.connection.BridgeServer;
import com.sas.services.connection.ConnectionFactoryAdminInterface;
import com.sas.services.connection.ConnectionFactoryConfiguration;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.connection.ConnectionFactoryInterface;
import com.sas.services.connection.ConnectionFactoryManager;
import com.sas.services.connection.ConnectionInterface;
import com.sas.services.connection.ManualConnectionFactoryConfiguration;
import com.sas.services.connection.Server;
import com.sas.services.information.RepositoryInterface;
import com.sas.services.information.ServerInterface;
import com.sas.services.information.metadata.LogicalServerInterface;
import com.sas.services.information.metadata.MetadataInterface;
import com.sas.services.information.metadata.PathUrl;
import com.sas.services.session.SessionContextInterface;
import com.sas.services.storedprocess.Execution2Interface;
import com.sas.services.storedprocess.ExecutionBaseInterface;
import com.sas.services.storedprocess.ExecutionException;
import com.sas.services.storedprocess.MetadataConstants;
import com.sas.services.storedprocess.StoredProcess2Interface;
import com.sas.services.storedprocess.StoredProcessBaseInterface;
import com.sas.services.storedprocess.StoredProcessServiceFactory;
import com.sas.services.storedprocess.StoredProcessServiceInterface;
import com.sas.services.storedprocess.metadata.StoredProcessInterface;
import com.sas.services.storedprocess.metadata.StoredProcessOptions;
import com.sas.services.user.UserContextInterface;
import com.sas.services.user.UserIdentityInterface;
import com.sas.web.keys.CommonKeys;

public class StoredProcessFacade2 {
	public static final String STORED_PROCESS_DESTROYABLE_OBJECT	= "sas_StoredProcessDestroyableObject_SPF"; 
	public static final String STORED_PROCESS_CONNECTION 		 	= "sas_StoredProcessConnection_HBI";
	public static final String STORED_PROCESS_FACADE 				= "sas_StoredProcessFacade_HBI";    
	public static final String STORED_PROCESS_DATA_PROVIDER			= "sas_StoredProcessDataProvider_HBI";
/*
	public static final String STORED_PROCESS_DESTROYABLE_OBJECT	= "sas_StoredProcessDestroyableObject_STPHBI"; 
	public static final String STORED_PROCESS_CONNECTION 		 	= "sas_StoredProcessConnection_STPHBI";
	public static final String STORED_PROCESS_FACADE 				= "sas_StoredProcessFacade_STPHBI";    
	public static final String STORED_PROCESS_DATA_PROVIDER			= "sas_StoredProcessDataProvider_STPHBI";
*/
	private static HttpSession 		session 	= null;
	private SessionContextInterface sci	 		= null;
	private UserContextInterface 	ucif 		= null;
	private RepositoryInterface 	rif	 		= null; 
	private UserIdentityInterface 	id	 		= null; 

	private StoredProcess2Interface	storedProcess	= null;
	private Execution2Interface 	stpEI			= null;
	private ConnectionFactoryAdminInterface admin 	= null;
	private ConnectionInterface 	cx 				= null;
	
	private static String 			appSrvName 		= null;
	
	private LinkedHashMap<String, String[]> SASLogs = null; // 
	private static Properties 		hbiconf 		= HBIConfig.getConf();
	private Logger			logger 			;//= Logger.getLogger("StoredProcessFacade2");
	
	@SuppressWarnings("unchecked")
	public StoredProcessFacade2(final HttpServletRequest request) throws IllegalStateException, RemoteException, ServiceException {
		this.session = request.getSession();
		this.sci  = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
		this.ucif = sci.getUserContext();
		this.rif = ucif.getRepository("Foundation");
		this.id = ucif.getIdentityByDomain("DefaultAuth");
		this.SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
		this.logger = Logger.getLogger("StoredProcessFacade2");
		
	}
/*
	public void execStoredProcess(final HttpServletRequest request, String param, List<String> exceptParam, boolean isNew) 
			throws IllegalStateException, IllegalArgumentException, ServiceException, IOException, ConnectionFactoryException
	{
		if(isNew){
			
		} else {
			setStroedProcess(param); 
		}
		execStoredProcess(request, param, exceptParam);
	}
*/
	public void execStoredProcess(final HttpServletRequest request, HttpServletResponse response, String param,List<String> exceptParam) 
			throws IllegalStateException, IllegalArgumentException, IOException, ConnectionFactoryException, ServiceException{
		try{
			storedProcess = getStoredProcess(param);
			getStoredProcessParametersFromRequest(request,storedProcess,exceptParam);
			stpEI = storedProcess.execute(true, null, false, cx);
			stpEI = getSASLog(stpEI,SASLogs, response);
			destory();
		} catch (ConnectionFactoryException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ConnectionFactoryException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (SecurityException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: SecurityException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IOException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IOException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IllegalArgumentException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IllegalStateException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IllegalStateException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (ExecutionException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ExecutionException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			
			e.printStackTrace();
		} catch (InitializationException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: InitializationException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (ServiceException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ServiceException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (InvalidPromptValueException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: InvalidPromptValueException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		}		
	}
	
	private StoredProcess2Interface getStoredProcess(String param) 
			throws IOException, ConnectionFactoryException, IllegalArgumentException, ServiceException{
		
		Server server = new BridgeServer(Server.CLSID_SASSTP,getSTPHostname(),getSTPPort());
		ConnectionFactoryConfiguration cxfConfig = new ManualConnectionFactoryConfiguration(server);
		ConnectionFactoryManager cxfManager = new ConnectionFactoryManager();
		ConnectionFactoryInterface cxf = cxfManager.getFactory(cxfConfig);
		admin = cxf.getAdminInterface();
		cx = cxf.getConnection((String) id.getPrincipal(),(String) id.getCredential());
		
		StoredProcessServiceFactory spsf = new StoredProcessServiceFactory();
		StoredProcessServiceInterface storedProcessService = spsf.getStoredProcessService();
		StoredProcessOptions options = new StoredProcessOptions();
		options.setSessionContextInterface((SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT));
		
		
		if(param.toUpperCase().startsWith("SBIP://")){
			final ServerInterface authServer = ucif.getAuthServer();
			PathUrl path = new PathUrl(param);
			final MetadataInterface metadataObject = authServer.getObjectByPath(path);
			if (metadataObject instanceof StoredProcessInterface)
			{
				final StoredProcessInterface stp = (StoredProcessInterface) metadataObject;
				storedProcess = (StoredProcess2Interface) stp.newServiceObject(options);
			}
			
		} else {
			StoredProcess2Interface storedProcess = (StoredProcess2Interface) storedProcessService.newStoredProcess(StoredProcessBaseInterface.SERVER_TYPE_STOREDPROCESS, options);
			storedProcess.setSourceFromFile(hbiconf.getProperty("stp.tempdir").trim(), param);
		}
		return storedProcess;
	}
	
	private String getSTPHostname() throws ServiceException, RemoteException
	{
		StoredProcessFacade facade=(StoredProcessFacade)session.getAttribute(STORED_PROCESS_FACADE);
		StoredProcess2Interface stp2 = facade.getStoredProcess();
		LogicalServerInterface logicalServer = stp2.getServer();
		String stpSrvName = logicalServer.getName();		//Bingo!!!  "SASPmo2 - Logical Stored Process Server"
		appSrvName = stpSrvName.split(" ")[0];
		
		return hbiconf.getProperty(appSrvName.trim()+".hostname");
	}
	private int getSTPPort()
	{	
		return Integer.parseInt(hbiconf.getProperty(appSrvName.trim()+".port"));
	}
	public void getStoredProcessParametersFromRequest(HttpServletRequest request, StoredProcess2Interface storedProcess, List<String> exceptParam) 
			throws UnsupportedEncodingException, RemoteException, ServiceException, InvalidPromptValueException 
	{
		final Enumeration<String> paramNames = request.getParameterNames();
		while(paramNames.hasMoreElements())
		{
			String name = paramNames.nextElement().toString();
			String value = new String(request.getParameter(name).getBytes("UTF-8"),"UTF-8");
			if(value.equalsIgnoreCase("")||value==null){
				value = "";
			}
			if (name.toUpperCase().indexOf("_DRILL_") > -1){
				name=name.substring(7);
			}
			if (exceptParam.contains(name.toUpperCase())) {
				logger.debug(name.toUpperCase() + " Exclued!");
			} else {
				storedProcess.setParameterValue(name,value);
				logger.debug("Passed Parameter : " + name + " : " + value);
			}
		}		
		storedProcess.setParameterValue("_RESULT", "STREAMFRAGMENT");
		storedProcess.setParameterValue("_URL", "/SASStoredProcess/do");
	}

	private Execution2Interface getSASLog(Execution2Interface stpEI,LinkedHashMap<String, String[]> SASLogs, HttpServletResponse response) 
			throws TransportException, IllegalStateException, IOException{
		//Logger logger = Logger.getLogger("getSASLog");
		
		String log = stpEI.readSASLog(ExecutionBaseInterface.LOG_FORMAT_HTML,ExecutionBaseInterface.LOG_ALL_LINES);
		logger.debug("SASLog : " + log);
		String [] logs = {log};

		Long curDT = new Date().getTime();
		int ran = (int)(Math.random() * 1000);
		
		String logID = curDT.toString() + ran;
		logger.debug("logID : " + logID);
		SASLogs.put(logID,logs);
		session.setAttribute("SASLogs",SASLogs);			
			
		final BufferedInputStream inData = new BufferedInputStream(stpEI.getInputStream(MetadataConstants.WEBOUT));
		final BufferedOutputStream outData = new BufferedOutputStream(response.getOutputStream());
		final byte[] buffer = new byte[4096];
		for (int n = 0; (n = inData.read(buffer, 0, buffer.length)) > 0; ) {
			outData.write(buffer, 0, n);
		}
		outData.flush();
		outData.close();
		return stpEI;
	}
	
	private void destory() 
			throws TransportException, RemoteException, IllegalStateException, ConnectionFactoryException
	{
		stpEI.destroy();
		storedProcess.destroy();
		cx.close();
		admin.shutdown();	
	}
}
