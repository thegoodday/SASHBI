package com.sas.hbi.servlets;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.sas.hbi.listeners.HBISessionBindingListener;
import com.sas.hbi.listeners.HBISessionBindingListener.DestroyableObjectInterface;
/*
import com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface;
import com.sas.hbi.listeners.STPSessionBindingListener;
*/
import com.sas.hbi.property.HBIConfig;
import com.sas.hbi.storedprocess.StoredProcessConnection;
import com.sas.hbi.storedprocess.StoredProcessFacade;
import com.sas.prompts.InvalidPromptValueException;
import com.sas.prompts.valueprovider.dynamic.DataProvider;
import com.sas.services.ServiceException;
import com.sas.services.TransportException;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.deployment.ServiceDeploymentException;
import com.sas.services.information.InformationServiceInterface;
import com.sas.services.information.RepositoryInterface;
import com.sas.services.information.metadata.PathUrl;
import com.sas.services.session.SessionContextInterface;
import com.sas.services.storedprocess.Execution2Interface;
import com.sas.services.storedprocess.ExecutionException;
import com.sas.services.storedprocess.StoredProcess2Interface;
import com.sas.services.storedprocess.StoredProcessServiceInterface;
import com.sas.services.storedprocess.metadata.StoredProcessOptions;
import com.sas.services.user.UserContextInterface;
import com.sas.services.user.UserIdentityInterface;
import com.sas.servlet.util.BaseUtil;
import com.sas.util.Strings;
import com.sas.web.keys.CommonKeys;
import com.sas.web.keys.ComponentKeys;

/**
 * Servlet implementation class STPWRVHEdit
 */
public class HBIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public static final String STORED_PROCESS_DESTROYABLE_OBJECT 	= "sas_StoredProcessDestroyableObject_HBI"; 
	public static final String STORED_PROCESS_CONNECTION 			= "sas_StoredProcessConnection_HBI";
	public static final String STORED_PROCESS_FACADE 				= "sas_StoredProcessFacade_HBI";
	public static final String STORED_PROCESS_CUSTOM_FILE			= "sas_StoredProcessCustomFile_HBI";
	public static final String STORED_PROCESS_CUSTOM_PATH			= "sas_StoredProcessCustomPath_HBI";
	public static final String STORED_PROCESS_DATA_PROVIDER			= "sas_StoredProcessDataProvider_HBI";
	private static final String _URL_KEY = "_URL";
	private String STORED_PROCESS_PATH_URL; 
	
	private static final String AutDomain	="DefaultAuth";
	private static final String Repository="Foundation";

	private InformationServiceInterface informationService;
	private StoredProcessServiceInterface storedProcessService;

	private PathUrl path;
	private String 	reurl;
	private String 	stpcustPath;
	private String 	stpcustFile;
	private String 	stpInstallPath;
	private String 	hostname;
	private int 	port;
	private String username;
	private String password;
	private Locale locale;

	private Logger logger;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public HBIServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    public void setInformationService(InformationServiceInterface informationService) 
    {
    	this.informationService = informationService; 
    }


    /** 
     * Spring injection method to store the value of the remote stored process service from the 
     * SAS Web Infrastructure Platform.
     */
    public void setStoredProcessService(StoredProcessServiceInterface storedProcessService) 
    {
    	this.storedProcessService = storedProcessService;
    }
    
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */ 
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		logger = Logger.getLogger(getClass().getName());
		final HttpSession session = request.getSession();
		ServletContext localServletContext = getServletContext();


		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();

    	stpInstallPath = conf.getProperty("stp.installpath");
		if (stpInstallPath.equalsIgnoreCase("")) {
			stpInstallPath="sas.storedprocess.war";
			ServletContext context = getServletContext();
			stpInstallPath = context.getRealPath("").substring(0,context.getRealPath("").length()-20)+stpInstallPath;  
		}
		logger.info("STP Install Path : " + stpInstallPath);
		
		String sp_pathUrl=null; 
		if(request.getParameter("sp_pathUrl") != null){
			sp_pathUrl = new String(request.getParameter("sp_pathUrl"));
			STORED_PROCESS_PATH_URL = sp_pathUrl;
			session.setAttribute("sp_pathUrl", sp_pathUrl);			
			logger.info("sp_pathUrl : "+sp_pathUrl);
		}
		
		synchronized (session)
		{	
			try 
			{
				// Create a StoredProcessDestroyableObject to properly clean up the StoredProcessConnection
				// and StoredProcessFacade objects used by this servlet in the HTTP session
				StoredProcessDestroyableObject destroyableObject = (StoredProcessDestroyableObject) session.getAttribute(STORED_PROCESS_DESTROYABLE_OBJECT);
				if (destroyableObject == null)
				{
					destroyableObject = new StoredProcessDestroyableObject();
					HBISessionBindingListener.getInstance(session).addDestroyableObject(destroyableObject);
					
					session.setAttribute(STORED_PROCESS_DESTROYABLE_OBJECT, destroyableObject);
				}
				
				// Set up the stored process connection
				StoredProcessConnection connection = (StoredProcessConnection) session.getAttribute(STORED_PROCESS_CONNECTION);
				if (connection == null)
				{
					final UserContextInterface userContext = (UserContextInterface) session.getAttribute(CommonKeys.USER_CONTEXT);
					final SessionContextInterface sessionContext = (SessionContextInterface) session.getAttribute(CommonKeys.SESSION_CONTEXT);
					
				    try
				    {
				      String appName = localServletContext.getInitParameter("application-name");
				      //SessionContextInterface sci = sessionContext.getSessionContext();
				      UserContextInterface uci    = sessionContext.getUserContext();
				      UserIdentityInterface id  = uci.getIdentityByDomain(AutDomain); 
				      username					=(String) id.getPrincipal(); 
				      password					=(String) id.getCredential(); 	
				      RepositoryInterface rif	= uci.getRepository(Repository);
				      hostname					= rif.getHost();
				      port 						= rif.getPort(); 
				    }
				    catch (Exception e) {
				    	logger.error("Fail to get userinfo...");
				    	e.printStackTrace();
				    }
				    
					

					
					final DataProvider dataProvider = new com.sas.prompts.valueprovider.dynamic.DataProvider(hostname, port, username, password);
			        dataProvider.setUserContext(userContext); 
			        logger.debug("DataProvider: " + dataProvider);
					session.setAttribute(STORED_PROCESS_DATA_PROVIDER, dataProvider);		
						
					connection = new StoredProcessConnection(userContext, sessionContext, informationService, storedProcessService);
					
					// Activate the connection to prepare for executing stored processes
					connection.connect();
					
					// Place the connection into the session so it can be used in the replay and
					// subsequent execution (e.g. drill down) scenarios					
					session.setAttribute(STORED_PROCESS_CONNECTION, connection);

					// Add the connection to the StoredProcessDestroyableObject so the
					// ExamplesSessionBindingListener can clean it up when the session expires
					destroyableObject.setConnection(connection);
				}

				
				StoredProcessFacade sessionFacade = (StoredProcessFacade) session.getAttribute(STORED_PROCESS_FACADE);
				if (sessionFacade != null)
				{
					sessionFacade.destroyStoredProcessObjects();
					destroyableObject.removeFacade(sessionFacade);
					sessionFacade = null;					
				}

				final Map<String, Object> storedProcessParameters = new HashMap<String, Object>();
				storedProcessParameters.put(_URL_KEY, request.getRequestURI());
				storedProcessParameters.put(StoredProcessFacade.RESULT_PARAMETER_KEY, StoredProcessFacade.RESULT_PARAMETER_STREAM_VALUE);
				
				final PathUrl path = new PathUrl(STORED_PROCESS_PATH_URL);
				final StoredProcessFacade facade = new StoredProcessFacade(connection, path, storedProcessParameters);
				session.setAttribute(STORED_PROCESS_FACADE, facade);
				
				destroyableObject.addFacade(facade);
				
				// Execute the initial (or perhaps only) SAS Stored Process and write the results 
				// to the browser
				//executeStoredProcess(request, response, facade, showSASLog);
			} catch (ServiceDeploymentException e){
				e.printStackTrace();
			} catch (ServiceException e){
				e.printStackTrace();
			} catch (IllegalStateException e){
				e.printStackTrace();
			} catch (ConnectionFactoryException e){
				e.printStackTrace();
			}
		}		

		if (sp_pathUrl != null) {
			path = new PathUrl(sp_pathUrl);

			char[] specialCharacters = { ' ', '\\', '\'', ';', '"', '\t', ':', '*', '?', '<', '>', '|' };
			String[] repstr = { "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_" };
			String stppath = "/" + path.getRootTree();
			String urlpath = path.getPath();
			if (urlpath != null) stppath = stppath + "/" + urlpath;
			String stppath2 = stppath + "/" + path.getName().replace('/', '_');
			stpcustFile = "/input" + Strings.replace(stppath2, specialCharacters, repstr) + ".jsp";
			stpcustPath = "/input" + Strings.replace(stppath, specialCharacters, repstr) + "/";
			if (stpInstallPath.substring(0,1).equalsIgnoreCase("/")){
				
			} else {
				stpcustFile=stpcustFile.replace('/','\\');
				stpcustPath=stpcustPath.replace('/','\\');
			}

			stpcustFile=stpInstallPath+stpcustFile;
			stpcustFile=stpcustFile.replaceAll("\\\\", "/");	//for MSC OTL
			stpcustPath=stpInstallPath+stpcustPath;
			stpcustPath=stpcustPath.replaceAll("\\\\", "/");	//for MSC OTL
			logger.info("stpCustFile : "+this.stpcustFile);
			logger.debug("stpCustPath : "+this.stpcustPath);
			session.setAttribute(STORED_PROCESS_CUSTOM_FILE, this.stpcustFile);
			session.setAttribute(STORED_PROCESS_CUSTOM_PATH, this.stpcustPath);
			try{
				String encUrl=sp_pathUrl;
				encUrl = URLEncoder.encode(sp_pathUrl,"UTF8");
				reurl="/SASStoredProcess/do?_action=form&_program=" + encUrl;
			} catch (Exception e) {
				logger.error(e.getStackTrace());
			}
		} else {
			//logger.error("sp_pathUrl not passed!!!");
		}
		
		RequestDispatcher rd=null;
		String sas_forwardLocation = request.getParameter(ComponentKeys.FORWARD_LOCATION);
		if (sas_forwardLocation == null){ 
			sas_forwardLocation = "/jsp/reportViewer.jsp";
		} else if (sas_forwardLocation.equalsIgnoreCase("EDIT")){ 
			sas_forwardLocation = "/jsp/headerEdit.jsp";
		} else if (sas_forwardLocation.equalsIgnoreCase("DELETE")){
			sas_forwardLocation = "/jsp/headerDelete.jsp";
		} else if (sas_forwardLocation.equalsIgnoreCase("SAVE")){
			sas_forwardLocation = "/jsp/headerSave.jsp";
		} else  {
			sas_forwardLocation = "/jsp/" + sas_forwardLocation +".jsp"; 
		}
		

		File isFile = new File(stpcustFile);
		if (isFile.isFile()){
			response.sendRedirect(reurl);
		} else {
			rd = session.getServletContext().getRequestDispatcher(sas_forwardLocation);
			rd.forward(request, response);
		}
	}

	private class StoredProcessDestroyableObject implements DestroyableObjectInterface 
	{
		private StoredProcessConnection connection = null;
		private List<StoredProcessFacade> facades = 
			Collections.synchronizedList(new ArrayList<StoredProcessFacade>());

		
		public void setConnection(final StoredProcessConnection connection)
		{
			this.connection = connection;
		}

		
		public void addFacade(final StoredProcessFacade facade)
		{
			facades.add(facade);
		}
		
		
		public boolean removeFacade(final StoredProcessFacade facade)
		{
			return facades.remove(facade);
		}
		
		
		// Methods for DestroyableObjectInterface are implemented below
		public void destroy() 
		{
			// Clean up the StoredProcessFacade objects for this session
			for (StoredProcessFacade facade : facades)
			{
				try 
				{
					facade.destroyStoredProcessObjects();
				} 
				catch (TransportException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (RemoteException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (IllegalStateException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (ConnectionFactoryException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			
			// Clean up the StoredProcessConnection object for this session				
			try 
			{
				connection.disconnect();
			} 
			catch (IllegalArgumentException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (IllegalStateException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (RemoteException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (ServiceException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}	
		}


		public int getOrder() 
		{
			// Ensure the StoredProcessDestroyableObject gets destroyed before the SAS Session Context
			return 0;
		}
		
	};
}
