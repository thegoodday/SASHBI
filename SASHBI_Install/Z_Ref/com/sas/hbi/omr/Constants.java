package com.sas.hbi.omr;


public class Constants {
	
	public static final String PARAM_PORTLET_ID        	= "BITREEVIEWER_ID";  
	
	public static final String CONFIG_USE_DOMAIN	   	= "BITREEVIEWER_USE_DOMAIN";
	public static final String CONFIG_LOAD_DE 		   	= "BITREEVIEWER_LOAD_DE";
	public static final String CONFIG_LOAD_WRS 			= "BITREEVIEWER_LOAD_WRS";
	public static final String CONFIG_LOAD_STP 		   	= "BITREEVIEWER_LOAD_STP";
	public static final String CONFIG_LOAD_STPRPT		= "BITREEVIEWER_LOAD_STPRPT";
	public static final String CONFIG_LOAD_MAP 			= "BITREEVIEWER_LOAD_MAP";
	public static final String CONFIG_HIDE_EMPTY	   	= "BITREEVIEWER_HIDE_EMPTY";
	public static final String CONFIG_HIDE_ROOT	   	   	= "BITREEVIEWER_HIDE_ROOT";
	public static final String CONFIG_ROOTS  			= "BITREEVIEWER_ROOTS";
	public static final String CONFIG_ROOT_FOLDER  		= "BITREEVIEWER_ROOT_FOLDER";
	public static final String CONFIG_ROOT_FOLDER_ID   	= "BITREEVIEWER_ROOT_FOLDER_ID";
	public static final String CONFIG_HIDE_WELCOME 		= "BITREEVIEWER_HIDE_WELCOME";
	public static final String CONFIG_WELCOME_TEXT 		= "BITREEVIEWER_WELCOME_TEXT";
	public static final String CONFIG_HIDE_USERS   	   	= "BITREEVIEWER_HIDE_USERS"; 
	public static final String CONFIG_SORT_BYNAME  	   	= "BITREEVIEWER_SORT_BYNAME";
	public static final String CONFIG_DISP_BYDESC  	   	= "BITREEVIEWER_DISP_BYDESC";
	public static final String CONFIG_DFT_ROOT_FOLDER	= "BITREEVIEWER_DFT_ROOT_FOLDER";
	public static final String CONFIG_TITLE_IMG_URL		= "BITREEVIEWER_TITLE_IMG_URL";
	public static final String CONFIG_STP_INSTALL_PATH	= "BITREEVIEWER_STP_INSTALL_PATH";
	public static final String CONFIG_STP_REDIRECTION	= "BITREEVIEWER_STP_REDIRECTION";	
	public static final String CONFIG_MENU_SIZE			= "BITREEVIEWER_MENUSIZE";
	public static final String CONFIG_TOP_MENU_HEIGHT	= "BITREEVIEWER_TOPMENUHEIGHT";
	public static final String CONFIG_TREE_LOADING_STYLE= "BITREEVIEWER_TREELOADINGSTYLE";
	public static final String CONFIG_DISPLAY_TYPE		= "BITREEVIEWER_DISPLAYTYPE";
	public static final String CONFIG_VARPT_DIRECTION	= "BITREEVIEWER_VAREPORTDIRECTION";
	public static final String CONFIG_TREE_SIGN			= "BITREEVIEWER_TREESIGN";
	public static final String CONFIG_TREE_EXP_LEVEL	= "BITREEVIEWER_TREEEXPLVL";
		
	public static final String SESSION_TREEFOLDERS_ID 	= "BITREEVIEWER_TREEFOLDERS_";
	public static final String SESSION_TREE_ID	  	   	= "BITREEVIEWER_TREE_";
	public static final String SESSION_SESSION_ID      	= "com.sas.services.session.SessionContextInterface";
	public static final String PORTAL_IMAP_CLASSNAME	= "com.sas.iquery.metadata.business.BriefInformationMap";
	
	public final static String INIT_PARAM_DISPLAY    		= "display-page";
	public final static String INIT_PARAM_EDIT       		= "edit-page";
	
	public static final String EDIT_PAGE_SAVE_KEY       	= "BITREEVIEWER_SAVE";
	public static final String DISPLAY_PAGE_DISPLAY_KEY    	= "BITREEVIEWER_DISPLAY";
	public static final String DISPLAY_PAGE_UPDATETREE_KEY 	= "BITREEVIEWER_UPDATETREE";
	public static final String DISPLAY_PAGE_REFRESH_KEY 	= "BITREEVIEWER_REFRESH";

	public static final String DISPLAY_PAGE_VIEWITEM_URL 	= "viewItemFromNavPortlet.do";

	public static final String DEFAULT_TITLE_IMG_URL		= "/SASTheme_default/themes/default/images/1x1.gif";
	public static final String DEFAULT_STP_INSTALL_PATH		= "C:\\SASConf\\Lev1\\Web\\WebAppServer\\SASServer1_1\\sas_webapps\\sas.storedprocess.war";
	public static final String DEFAULT_STP_APPL				= "Portal";
	public static final String DEFAULT_MENU_SIZE			= "180";
	public static final String DEFAULT_TOP_MENU_HEIGHT		= "130";
	public static final String DEFAULT_TREE_LOADING_STYLE	= "PROGRESSIVE";
	public static final String DEFAULT_DISPLAY_TYPE			= "Accordion";
	public static final String DEFAULT_VARPT_DIRECTION		= "Viewer";
	public static final String DEFAULT_TREE_SIGN			= "NO";
	
	public static final String DEFAULT_TREE_ROOT_FOLDER  	= "Products"; 
	
	public static final String DEFAULT_TREE_PREFIX		 	= "!!!!!!!!!!!!!!!!!!!!!!!!";
	
	
	public static final String TREE_OBJECT_TYPE_TREE     	= "Tree";
	public static final String TREE_OBJECT_TYPE_DE       	= "DataExploration";
	public static final String TREE_OBJECT_TYPE_BOOKMARK 	= "DataExplorationBookmark";
	public static final String TREE_OBJECT_TYPE_MAP 	 	= "InformationMap";
	public static final String TREE_OBJECT_TYPE_REPORT 	 	= "Report";
	public static final String TREE_OBJECT_TYPE_STP 	 	= "StoredProcess";
	public static final String TREE_OBJECT_TYPE_VARPT 	 	= "VA Report";
	public static final String TREE_OBJECT_TYPE_VAMAP 	 	= "VA Exploration";
	
	public static final String USER_FOLDERS_NAME 		= "Users";
	public static final String ROOT_REPOS_NAME   		= "Foundation";
	public static final String DATA_EXPLORATION  		= "DataExploration";
	
	public static final String XMLSEL_TREE     = 
		"<TEMPLATES>" +
			"<Tree Name=\"\" Id=\"\"/>" +
		"</TEMPLATES>";
	public static final String XMLSEL_TREE_DETAILS = 
		"<TEMPLATES>" +
			"<Tree Name=\"\" Id=\"\" Desc=\"\">" +
				"<SubTrees/>" +
			"</Tree>" +
			"<Tree Name=\"\" Id=\"\"/>" +
		"</TEMPLATES>";
	public static final String XMLSEL_TRANSFORMATIONS = 
		"<TEMPLATES>" +
			"<Transformation Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" MetadataCreated=\"\" MetadataUpdated=\"\">" +
				"<Notes/>" +
				"<Properties/>" +
				"<Trees/>" +
			"</Transformation>" +
			"<TextStore Name=\"\" Id=\"\"/>" +
			"<Property Id=\"\" DefaultValue=\"\" MetadataCreated=\"\" MetadataUpdated=\"\"/>" +
		"</TEMPLATES>";
	
	public static final String XMLSEL_INFORMATIONMAPS = 
		"<TEMPLATES>" +
			"<Transformation Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" MetadataCreated=\"\" MetadataUpdated=\"\">" +
				"<Trees/>" +
			"</Transformation>" +
		"</TEMPLATES>";
	
	public static final String XMLSEL_REPORTS = 
		"<TEMPLATES>" +
			"<Transformation Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" MetadataCreated=\"\" MetadataUpdated=\"\">" +
				"<Trees/>" +
			"</Transformation>" +
		"</TEMPLATES>";

	public static final String XMLSEL_STPREPORTS = 
			"<TEMPLATES>" +
				"<Transformation Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" MetadataCreated=\"\" MetadataUpdated=\"\">" +
					"<Trees/>" +
				"</Transformation>" +
			"</TEMPLATES>";
		
	public static final String XMLSEL_STOREDPROCESSES = 
		"<TEMPLATES>" +
			"<ClassifierMap Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" MetadataCreated=\"\" MetadataUpdated=\"\">" +
				"<Trees/>" +
			"</ClassifierMap>" +
		"</TEMPLATES>";
	
	public static final String XMLSEL_VAExploration = 
		"<TEMPLATES>" +
			"<DeployedComponent Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" >" +
				"<Trees/>" +
			"</DeployedComponent>" +
		"</TEMPLATES>";

	public static final String XMLSEL_VAReport = 
		"<TEMPLATES>" +
			"<Transformation Name=\"\" Id=\"\" Desc=\"\" TransformRole=\"\" >" +
				"<Trees/>" +
			"</Transformation>" +
		"</TEMPLATES>";

	public static boolean ok(String s) {
		return (s != null && s.length() > 0);
	}
}
