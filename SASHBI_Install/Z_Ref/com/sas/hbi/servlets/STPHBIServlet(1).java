package com.sas.hbi.servlets;

import java.io.IOException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.sas.hbi.listeners.STPSessionBindingListener;
import com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface;
import com.sas.hbi.storedprocess.StoredProcessConnection;
import com.sas.hbi.storedprocess.StoredProcessFacade;
import com.sas.prompts.PromptValuesInterface;
import com.sas.prompts.definitions.PromptDefinitionInterface;
import com.sas.prompts.groups.PromptGroupInterface;
import com.sas.services.ServiceException;
import com.sas.services.TransportException;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.deployment.ServiceDeploymentException;
import com.sas.services.information.InformationServiceInterface;
import com.sas.services.information.RepositoryInterface;
import com.sas.services.information.metadata.PathUrl;
import com.sas.services.session.SessionContextInterface;
import com.sas.services.storedprocess.StoredProcess2Interface;
import com.sas.services.storedprocess.StoredProcessServiceInterface;
import com.sas.services.user.UserContextInterface;
import com.sas.services.user.UserIdentityInterface;
import com.sas.servlet.util.BaseUtil;
import com.sas.web.keys.CommonKeys;
import com.sas.web.keys.ComponentKeys;

/**
 * Servlet implementation class STPHBIServlet
 * editLayout.jsp 에서 Stored Process 정보 획득하는데 사용
 */
public class STPHBIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private InformationServiceInterface informationService;
	private StoredProcessServiceInterface storedProcessService;

	
	public static final String STORED_PROCESS_DESTROYABLE_OBJECT	= "sas_StoredProcessDestroyableObject_STPHBI"; 
	public static final String STORED_PROCESS_CONNECTION 		 	= "sas_StoredProcessConnection_STPHBI";
	public static final String STORED_PROCESS_FACADE 				= "sas_StoredProcessFacade_STPHBI";    
	public static final String STORED_PROCESS_DATA_PROVIDER			= "sas_StoredProcessDataProvider_STPHBI";

	private static final String AutDomain	="DefaultAuth";
	private static final String Repository="Foundation";

	private PathUrl path;
	private String reurl;
	private String hostname;
	private int port;  
	private String username; 
	private String password;
	private Locale locale;
	private String portalURL; 
	private String stpcustPath;
	private String stpcustFile;
	private String stpInstallPath;
	
	private Logger logger;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public STPHBIServlet() {
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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger = Logger.getLogger("STPHBIServlet");
		final HttpSession session = request.getSession();
		RequestDispatcher rd=null;
		
		final UserContextInterface userContext = (UserContextInterface) session.getAttribute(CommonKeys.USER_CONTEXT);
		final SessionContextInterface sessionContext = (SessionContextInterface) session.getAttribute(CommonKeys.SESSION_CONTEXT);
		ServletContext localServletContext = getServletContext();
		
		String charset = BaseUtil.getOutputCharacterEncoding(request);
		response.setContentType("text/html; charset=" + charset);

		synchronized (session){
			try {
				StoredProcessDestroyableObject destroyableObject = (StoredProcessDestroyableObject) session.getAttribute(STORED_PROCESS_DESTROYABLE_OBJECT);
				if (destroyableObject == null) {
					destroyableObject = new StoredProcessDestroyableObject();
					STPSessionBindingListener.getInstance(session).addDestroyableObject(destroyableObject);

					session.setAttribute(STORED_PROCESS_DESTROYABLE_OBJECT, destroyableObject);
				}
				
				String sp_pathUrl=""; 
				if(request.getParameter("sp_pathUrl") != null){
					sp_pathUrl = new String(request.getParameter("sp_pathUrl"));
				} else {
					logger.error("sp_pathUrl did not passed!!!");
					return;
				}
				logger.debug("sp_pathUrl : "+sp_pathUrl);
				path = new PathUrl(sp_pathUrl);

				StoredProcessConnection connection = (StoredProcessConnection) session.getAttribute(STORED_PROCESS_CONNECTION);
				if (connection == null)
				{
					logger.debug("connection is null...");
					
				    try
				    {
				      //String appName = localServletContext.getInitParameter("application-name");
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
					
					connection = new StoredProcessConnection(userContext, sessionContext, informationService,storedProcessService);
					
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

				final Map<String, Object> storedProcessParameters = populateParameterMap();
				final StoredProcessFacade facade = new StoredProcessFacade(connection, path, storedProcessParameters);
				logger.debug("sp_pathUrl : " + path);

				session.setAttribute(STORED_PROCESS_FACADE, facade);


				final StoredProcess2Interface infoSTP=facade.getStoredProcess();
				session.setAttribute("info_stp", infoSTP);
				String metaID=facade.getMetaID();
				logger.debug("metaID : " + metaID);
				
				destroyableObject.addFacade(facade);
				
				String params="";
				StoredProcess2Interface stpInfo = facade.getStoredProcess();
				PromptValuesInterface pvi  = stpInfo.getPromptValues();
				PromptGroupInterface pgi = pvi.getPromptGroup();
				List<PromptDefinitionInterface> promptDefinitions = pgi.getPromptDefinitions(true);
				for (int i = 0; i < promptDefinitions.size(); i++) {
					PromptDefinitionInterface pdi = promptDefinitions.get(i);
					if (!pdi.getPromptName().toUpperCase().equalsIgnoreCase("_STPREPORT_DUMMY")){
						if (!pdi.isHidden()){
							if (params.length() < 1){
								params += pdi.getPromptName();
							} else {
								params += ","+pdi.getPromptName();
							}
						}
					}
				}
				session.setAttribute("stp_params", params);

				
				String sas_forwardLocation = request.getParameter(ComponentKeys.FORWARD_LOCATION);
				sas_forwardLocation = "/jsp/" + sas_forwardLocation +".jsp"; 

				rd = session.getServletContext().getRequestDispatcher(sas_forwardLocation);
				rd.forward(request, response);
			} 
			catch (ServiceDeploymentException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (ServiceException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (IllegalStateException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			/*
			catch (ExecutionException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (InterruptedException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			*/
			catch (ConnectionFactoryException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
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
		@Override
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


		@Override
		public int getOrder() 
		{
			// Ensure the StoredProcessDestroyableObject gets destroyed before the SAS Session Context
			return 0;
		}
		
	};
	private Map<String, Object> populateParameterMap()
	{
		final Map<String, Object> storedProcessParameters = new HashMap<String, Object>();
		
		storedProcessParameters.put("_debug", "");
		storedProcessParameters.put(StoredProcessFacade.RESULT_PARAMETER_KEY, StoredProcessFacade.RESULT_PARAMETER_STREAM_VALUE);
	
		return storedProcessParameters;
	}
}
