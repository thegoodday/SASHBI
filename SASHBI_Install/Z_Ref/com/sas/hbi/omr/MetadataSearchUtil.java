
package com.sas.hbi.omr;

import java.io.IOException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;


//import com.sas.hbi.tools.HBIConfig;
import com.sas.hbi.property.HBIConfig;
import com.sas.meta.SASOMI.IOMI;
import com.sas.metadata.remote.AssociationList;
import com.sas.metadata.remote.ClassifierMap;
import com.sas.metadata.remote.DeployedComponent;
import com.sas.metadata.remote.CMetadata;
import com.sas.metadata.remote.MdException;
import com.sas.metadata.remote.MdFactoryImpl;
import com.sas.metadata.remote.MdOMIUtil;
import com.sas.metadata.remote.MdOMRConnection;
import com.sas.metadata.remote.MdObjectStore;
import com.sas.metadata.remote.MdStore;
import com.sas.metadata.remote.MetadataObjects;
import com.sas.metadata.remote.Tree;
import com.sas.metadata.remote.Transformation;

public class MetadataSearchUtil {
	private final String loggingContext	= this.getClass().getName();
	private HttpServletRequest request		= null;
	private MdFactoryImpl	_factory		= null;
	private MdOMRConnection MDconnection	= null;
	private MdOMIUtil omiUtil				= null;
	private MdObjectStore store 			= null;
	
	private MdStore mos 					= null;
	private MdOMRConnection mws 			= null; 
	private IOMI iomi			  			= null; 
	private CMetadata rootRepos 			= null;
	private HashMap masterList				= null;
	private boolean loadWRSReports			= false;
	private boolean loadDataExplorations	= false;
	private boolean loadInformationMaps	= false; 
	private boolean hideEmptySubtrees		= true;
	private boolean loadStoredProcesses	= false;
	private boolean loadSTPReports			= true;
	private boolean hideUserNodes			= false;
	private boolean sortEntriesByName		= false;
	private boolean dispEntriesByDesc		= false;
	private String stpRedirection			= null;
	private TreeObject nRoot				= null;
	private String exceptWord 				= null;
	private Logger logger ;
	
	
	public String getExceptWord() throws IOException{
		//Properties conf = new HBIConfig().getConfig();
		//HBIConfig hbiconf = HBIConfig.getInstance();
		//Properties conf = HBIConfig.getConf();
		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();

		String exceptWord = conf.getProperty("hbi.exceptWord");
		//logger.debug("exceptWord : " + exceptWord);
		return exceptWord;
	}	
	
	public MetadataSearchUtil(HttpServletRequest request) {
		this.request           = request;
		this.logger = Logger.getLogger(getClass().getName());
		//this.logger.setLevel(Level.DEBUG);
	}
	
	public boolean init(String user, String pwd, String host, String port) throws RemoteException {
		long now = new Date().getTime();
		try {
			_factory = new MdFactoryImpl(false);
			_factory.setDebug(false);
			_factory.setLoggingEnabled(false);
			store = _factory.createObjectStore();
			MDconnection = _factory.getConnection();
			MDconnection.makeOMRConnection(host, port, user,pwd);
			omiUtil = _factory.getOMIUtil();
			List<CMetadata> repos = omiUtil.getRepositories();
						
			if(repos != null) {
				Iterator it = repos.iterator();
				while(it.hasNext()) {
					CMetadata c = (CMetadata)it.next();
					if(c.getName().equals(Constants.ROOT_REPOS_NAME)) {
						rootRepos = c;
						break;
					}
				} 
			}
		} catch(Exception e) {
		}
		long now2 = new Date().getTime() - now;

		if(rootRepos == null)
			return false;
		return true;
	}

	public ArrayList createArrayFromTree(MetadataObjectIf moif, String prefix) {
		ArrayList results = new ArrayList();
		flattenTreeHierarchy(results,moif,"",prefix,"");
		return results;
	}

	private void flattenTreeHierarchy(ArrayList results, MetadataObjectIf moif, String curPrefix, String prefix, String path) {
		results.add(new String[] {moif.getFQID(),curPrefix + moif.getName(),path + "/" + moif.getName() });
		if(moif.hasChildren()) {
			List list = moif.getChildren();
			Iterator it = list.iterator();
			while(it.hasNext()) {
				MetadataObjectIf m = (MetadataObjectIf)it.next();
				flattenTreeHierarchy(results,m,curPrefix+prefix,prefix,path + "/" + moif.getName());
			}
		}
	}
	
	public List getRootFolders() throws RemoteException{
		List li       = null;
		String xmlsel = null;
		String id     = null; 
		long now = new Date().getTime();

		xmlsel="<XMLSELECT Search=\"Tree[SoftwareComponents/*[@NAME='BIP Service']]\" />" 
		+ Constants.XMLSEL_TREE;
		li = getMetadataObjects(xmlsel,MetadataObjects.TREE);
		
		return li;
	}
	
	/*
	 * Report Layout 생성/수정하는 화면에서 STP 선택을 위한 STP 목록 생성을 위한 method 
	 */
	public MetadataObjectIf buildTreeHierarchy2(String[] startBIPUrls) throws RemoteException {
		List li       = null;
		String xmlsel = null;
		String id     = null; 
		long now = new Date().getTime();
		
		masterList = new HashMap();
		String s = "SBIP://Foundation";

		//TreeObject nRoot = (TreeObject)new TreeNode("RootNode", "Root Node", "rootnode");

		for(int i = 0; i < startBIPUrls.length; i++) {
			xmlsel = "<XMLSELECT Search=\"Tree[@Name='" + startBIPUrls[i] + "']\"/>" + Constants.XMLSEL_TREE;
			li = getMetadataObjects(xmlsel,MetadataObjects.TREE);

			id = getObjectID((li != null) ? li.get(0) : null);
			
			//s = "/" + startBIPUrls[i];
			MetadataObjectIf child = traverseSubTrees2(null,id,0,s);
			//MetadataObjectIf parent, MdObjectBase obj, String sbipUrl,String vdePageUrl, int level
			if (nRoot == null)
			{
				nRoot = new TreeObject(null, null, s, null, 0);
			}
			nRoot.addChild(child,sortEntriesByName);
			
			
		}
		if(id == null)
			return null;
		
		/*
		if(loadDataExplorations)
			retrieveDataExplorations();
		if(loadInformationMaps)
			retrieveInformationMaps();
		if(loadWRSReports)
			retrieveWRSReports();
		if(loadSTPReports){
		}
		if(loadStoredProcesses){
		}
		retrieveVAExploration();
		retrieveVAReport();
		*/
		//retrieveSTPReports();
		retrieveStoredProcesses2();
		hideEmptySubtrees();
		
		long now2 = new Date().getTime() - now;
		return nRoot;
	}
	
	public void dispose() throws RemoteException {
		if(mos != null) {
			/*
			mos.dispose();
			mws.dispose();
			*/
			
			//MDconnection.closeOMRConnection();
			_factory.closeOMRConnection();
		}
	}
	
	public String getStpRedirection(){
		return stpRedirection;
	}
	
	public void setStpRedirection(String stpRedirection){
		this.stpRedirection = stpRedirection;
	}
	
	public boolean isLoadDataExplorations() {
		return loadDataExplorations;
	}
	
	public void setLoadDataExplorations(boolean loadDataExplorations) {
		this.loadDataExplorations = loadDataExplorations;
	}
	
	public boolean isLoadInformationMaps() {
		return loadInformationMaps;
	}
	
	public void setLoadInformationMaps(boolean loadInformationMaps) {
		this.loadInformationMaps = loadInformationMaps;
	}
	
	public boolean isLoadWRSReports() {
		return loadWRSReports;
	}
	
	public void setLoadWRSReports(boolean loadReports) {
		this.loadWRSReports = loadReports;
	}

	public boolean isHideEmptySubtrees() {
		return hideEmptySubtrees;
	}
	
	public void setHideUserNodes(boolean b) {
		this.hideUserNodes = b;
	}

	public boolean isHideUserNodes() {
		return hideUserNodes;
	}
	
	public void setHideEmptySubtrees(boolean hideEmptySubtrees) {
		this.hideEmptySubtrees = hideEmptySubtrees;
	}
	
	public boolean isSortEntriesByName() {
		return sortEntriesByName;
	}

	public void setSortEntriesByName(boolean sortEntriesByName) {
		this.sortEntriesByName = sortEntriesByName;
	}
	
	public boolean isDispEntriesByDesc() {
		return dispEntriesByDesc;
	}

	public void setDispEntriesByDesc(boolean dispEntriesByDesc) {
		this.dispEntriesByDesc = dispEntriesByDesc;
	}
	
	public boolean isLoadStoredProcesses() {
		return loadStoredProcesses;
	}
	
	public void setLoadStoredProcesses(boolean loadStoredProcesses) {
		this.loadStoredProcesses = loadStoredProcesses;
	}
	
	public void setLoadSTPReports(boolean loadSTPReports) {
		this.loadSTPReports = loadSTPReports;
	}
	
	public static String createTooltip(Object o, String type) throws RemoteException {
		String s = "";
		if(o instanceof CMetadata) {
			s += "Type:\t\t" + type + "\n";
			s += "Description:\t" + getObjectDesc(o) + "\n";
			s += "Created:\t" + ((CMetadata)o).getMetadataCreated() + "\n";
			s += "Last Updated:\t" + ((CMetadata)o).getMetadataUpdated();
		}
		return s;
	}
	public static String createTooltip2(Object o, String type, String desc) throws RemoteException {
		int is2desc = desc.indexOf("|");
		if ( is2desc > 0 ) 
			desc=desc.substring(is2desc+1);

		String s = "";
		if(o instanceof CMetadata) {
			s += "Type:\t\t" + type + "\n";
			s += "Description:\t" + desc + "\n";
			s += "Created:\t" + ((CMetadata)o).getMetadataCreated() + "\n";
			s += "Last Updated:\t" + ((CMetadata)o).getMetadataUpdated();
		}
		return s;
	}
	
	public static String getObjectID(Object object) throws RemoteException {
		if(object instanceof CMetadata)
			return ((CMetadata)object).getFQID();
		return null;
	}
	
	public static String getObjectName(Object object) throws RemoteException {
		if(object instanceof CMetadata)
			return ((CMetadata)object).getName();
		return null;
	}

	public static String getObjectDesc(Object object) throws RemoteException {
		if(object instanceof CMetadata)
			return ((CMetadata)object).getDesc();
		return null;
	}

	private void hideEmptySubtrees() {
		if(masterList.size() == 0)
			return;
		long now = new Date().getTime();
		// mark everything as hidden, then unhide non-empty trees, then remove hidden trees
		Iterator it = masterList.keySet().iterator();
		while(it.hasNext()) {
			String fqid = (String)it.next();
			MetadataObjectIf moif = (MetadataObjectIf)masterList.get(fqid);
			moif.setHidden(true);
			moif.setExpanded(true);
		}
		
		it = masterList.keySet().iterator();
		while(it.hasNext()) {
			String fqid = (String)it.next();
			MetadataObjectIf moif = (MetadataObjectIf)masterList.get(fqid);
			if(moif != null && moif instanceof TreeObject)
				continue;
			moif.setHidden(false);
			moif.setExpanded(false);
			
			MetadataObjectIf parent = moif.getParent();
			while(parent != null) {
				parent.setHidden(false);
				parent = parent.getParent();
			}
		}
		it = masterList.keySet().iterator();
		while(it.hasNext()) {
			String fqid = (String)it.next();
			MetadataObjectIf moif = (MetadataObjectIf)masterList.get(fqid);
			if(moif != null && moif.isHidden()) {
				MetadataObjectIf parent = moif.getParent();
				if(parent != null)
					parent.remove(fqid);
				masterList.remove(fqid);
				it = masterList.keySet().iterator();
			}
		}
		// expand all tree objects that do not have report items as children
		it = masterList.keySet().iterator();
		while(it.hasNext()) {
			String fqid = (String)it.next();
			MetadataObjectIf moif = (MetadataObjectIf)masterList.get(fqid);
			boolean eligibleForExpand = false;
			if(moif != null && moif instanceof TreeObject) {
				List children = moif.getChildren();
				for(int i=0; children != null && children.size() > i; i++) {
					MetadataObjectIf moif2 = (MetadataObjectIf)children.get(i);
					if(moif2 != null && moif2.isHidden() == false && moif2 instanceof TreeObject) {
						eligibleForExpand = true;
						break;
					}
				}
				moif.setExpanded(eligibleForExpand);
			}
		}
		long now2 = new Date().getTime() - now;
	}

	private MetadataObjectIf traverseSubTrees2(MetadataObjectIf parent, String id, int level, String baseurl) throws RemoteException {
		try {
			List li = getMetadataObjects("<XMLSELECT Search=\"Tree[@Id='" + id + "']\"/>" + 
				Constants.XMLSEL_TREE_DETAILS,MetadataObjects.TREE);
			Tree t  = (Tree)li.get(0);
			TreeObject root = (TreeObject)masterList.get(getObjectID(t));
			if(parent == null) {	//root == null
				root = new TreeObject(parent, t,baseurl+"/"+getObjectName(t),null,level);
				masterList.put(root.getFQID(),root);
			}
			
			// loop through subtrees
			AssociationList subtrees = t.getSubTrees();
			Iterator itt = subtrees.iterator();
			while(itt.hasNext()) {
				Tree t2  = (Tree)itt.next();
				if(hideUserNodes && t2.getName().equalsIgnoreCase(Constants.USER_FOLDERS_NAME))
					continue;
				TreeObject child = 	new TreeObject(root, t2,root.getSBIPUrl()+"/"+getObjectName(t2),null,level+1);
				masterList.put(child.getFQID(),child);
				
				root.addChild(child,sortEntriesByName);
				
				traverseSubTrees2(child,getObjectID(t2),level+1,null);
			}
			return root;
		} catch (MdException e) {
		}
		return null;
	}
	
	public MetadataObjectIf buildTreeHierarchy(String[] startBIPUrls) throws IOException {
		List li       = null;
		String xmlsel = null;
		String id     = null; 
		long now = new Date().getTime();
		for(int i = 0; i < startBIPUrls.length; i++) {
			if(i == 0)
				xmlsel = "<XMLSELECT Search=\"Tree[@Name='" + startBIPUrls[i] + "']\"/>" + Constants.XMLSEL_TREE;
				//xmlsel = "<XMLSELECT Search=\"Tree[SoftwareComponents/*[@NAME='BIP Service']]\" />" + Constants.XMLSEL_TREE;

			else
				xmlsel = "<XMLSELECT Search=\"Tree[@Name='" + startBIPUrls[i] + "'][ParentTree/Tree[@Id='" +
					id + "']]\"/>" + Constants.XMLSEL_TREE;
			li = getMetadataObjects(xmlsel,MetadataObjects.TREE);
			
			id = getObjectID((li != null) ? li.get(0) : null);
		}
		if(id == null)
			return null;
		
		// recursively traverse the subtrees
		masterList = new HashMap();

		String s = "SBIP://Foundation";
		for(int i=0; i<startBIPUrls.length-1; i++) {
			s += "/" + startBIPUrls[i];
		}
		
		MetadataObjectIf root = traverseSubTrees(null,id,0,s);
		if(loadDataExplorations)
			retrieveDataExplorations();
		if(loadInformationMaps)
			retrieveInformationMaps();
		if(loadWRSReports)
			retrieveWRSReports();
		if(loadSTPReports){
			retrieveSTPReports();
		}
		if(loadStoredProcesses){
			retrieveStoredProcesses();
		}
		retrieveVAExploration();
		retrieveVAReport();
		if(hideEmptySubtrees) 
			hideEmptySubtrees();
		
		long now2 = new Date().getTime() - now;

		return root;
	}
	private MetadataObjectIf traverseSubTrees(MetadataObjectIf parent, String id, int level, String baseurl) throws IOException {
		try {
			List li = getMetadataObjects("<XMLSELECT Search=\"Tree[@Id='" + id + "']\"/>" + 
				Constants.XMLSEL_TREE_DETAILS,MetadataObjects.TREE);
			Tree t  = (Tree)li.get(0);
			TreeObject root = (TreeObject)masterList.get(getObjectID(t));
			if(root == null) {
				root = new TreeObject(parent, t,baseurl+"/"+getObjectName(t),null,level);
				masterList.put(root.getFQID(),root);
			}
			
			// loop through subtrees
			AssociationList subtrees = t.getSubTrees();
			Iterator itt = subtrees.iterator();
			while(itt.hasNext()) {
				Tree t2  = (Tree)itt.next();
				exceptWord=getExceptWord();
				boolean isVisible = true;
				if (t2.getName().toUpperCase().indexOf(exceptWord.toUpperCase()) > 0) isVisible=false;
				if (isVisible) {
					if(hideUserNodes && t2.getName().equalsIgnoreCase(Constants.USER_FOLDERS_NAME))
						continue;
					TreeObject child = 	new TreeObject(root, t2,root.getSBIPUrl()+"/"+getObjectName(t2),null,level+1);
					masterList.put(child.getFQID(),child);
					
					root.addChild(child,sortEntriesByName);
					
					traverseSubTrees(child,getObjectID(t2),level+1,null);
				}
			}
			return root;
		} catch (MdException e) {
		}
		return null;
	}	
	/**
	 * @param string
	 * @param type
	 * @return
	 * @throws RemoteException 
	 */
	private List getMetadataObjects(String string, String type) throws RemoteException {
		try {
			/*
			List objects = MetadataUtil.getMetadataObjectsSubset(iomi, mos,
				rootRepos.getFQID(), type,
				MetadataUtil.OMI_XMLSELECT | MetadataUtil.OMI_TEMPLATE |  MetadataUtil.OMI_GET_METADATA,
				string, false);
			*/
			int flags = MdOMIUtil.OMI_XMLSELECT | MdOMIUtil.OMI_TEMPLATE |  MdOMIUtil.OMI_GET_METADATA ;
			List objects = omiUtil.getMetadataObjectsSubset(store, rootRepos.getFQID(), type, 
					flags, string);
			return objects;
		} catch (MdException e) {
		}
		return null;
	}

	private void retrieveWRSReports() throws RemoteException {
		try {
//			// reports created on the target machine have this associated note 
//	 		List li2 = getMetadataObjects("<XMLSELECT Search=\"Transformation[@TransformRole='Report']" +
//	 				"/Notes/TextStore[@Name='WRS_Hints']]\"/>" +
//		 			Constants.XMLSEL_REPORTS,MdObjectFactory.TRANSFORMATION);
//	 		for (int i = 0; i < li2.size(); i++) {
//	 			Transformation t1 = (Transformation)li2.get(i);
//	 			PortletLogger.debug("retrieveWRSReports(): li2::" + t1.getName(),
//						loggingContext,request);
//			}
//	 		
//			// reports imported to the target machine have this associated property
//	 		List li3 = getMetadataObjects("<XMLSELECT Search=\"Transformation[@TransformRole='Report']" + 
//	 				"/Properties/Property[@DefaultValue='Report']]\"/>" +
//	 			Constants.XMLSEL_REPORTS,MdObjectFactory.TRANSFORMATION);
//	 		for (int i = 0; i < li3.size(); i++) {
//	 			Transformation t1 = (Transformation)li3.get(i);
//	 			PortletLogger.debug("retrieveWRSReports(): li3::" + t1.getName(),
//						loggingContext,request);
//			}
//	 		
//	 		// reports published via Enterprise Guide have this property
//	 		List li4 = getMetadataObjects("<XMLSELECT Search=\"Transformation[@TransformRole='Report']" + 
//	 				"/Properties/Property[@Name='##CACHE_NAME_LIST##']]\"/>" +
//	 			Constants.XMLSEL_REPORTS,MdObjectFactory.TRANSFORMATION);
//	 		for (int i = 0; i < li4.size(); i++) {
//	 			Transformation t1 = (Transformation)li4.get(i);
//	 			PortletLogger.debug("retrieveWRSReports(): li4::" + t1.getName(),
//						loggingContext,request);
//			}
	 		
	 		// 03.09.2006: updated & simplified query strategy: now the object name needs to contain ".srx" to 
			// be a valid WRS report (some imported reports occured that missed all of the above filter criteria, so
			// a change was necessary)
			String xmlsel="<XMLSELECT Search=\"Transformation[@TransformRole='Report' and @Name ? '.srx']\"/>" +Constants.XMLSEL_REPORTS;
	 		List li5 = getMetadataObjects(xmlsel,MetadataObjects.TRANSFORMATION);

	 		
	 		// unify both lists
	 		ArrayList tmp = new ArrayList(li5);
	 		ArrayList li = new ArrayList();
	 		for(int i=0;i<tmp.size();i++) {
	 			Transformation t1 = (Transformation)tmp.get(i);
	 			boolean reportExists = false;
	 			for(int j=0;j<li.size();j++) {
		 			Transformation t2 = (Transformation)li.get(j);
		 			if(t2.getId().equals(t1.getId())) {
		 				reportExists = true;
		 				break;
		 			}
	 			}
	 			if(!reportExists)
	 				li.add(tmp.get(i));
	 		}
	 		
	 		// loop through wrs reports
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				Transformation t = (Transformation)it.next();
				AssociationList trees = t.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					if(to != null) {
						WRSReportObject wro = 
							new WRSReportObject(to,t,to.getSBIPUrl() + "/" + getObjectName(t),
								Constants.DISPLAY_PAGE_VIEWITEM_URL,to.getLevel()+1);
						masterList.put(wro.getFQID(),wro);
						to.addChild(wro,sortEntriesByName);
					}
				}
			}		
		} catch(MdException e) {
		}
	}

	private void retrieveInformationMaps() throws RemoteException {
		try {
	 		List li = getMetadataObjects("<XMLSELECT Search=\"Transformation[@TransformRole='InformationMap']\"/>" + 
	 			Constants.XMLSEL_INFORMATIONMAPS,MetadataObjects.TRANSFORMATION);

	 		// loop through data explorations
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				Transformation t = (Transformation)it.next();
				AssociationList trees = t.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					if(to != null) {
						InformationMapObject imo = 
							new InformationMapObject(to,t,to.getSBIPUrl()+"/"+getObjectName(t),
								Constants.DISPLAY_PAGE_VIEWITEM_URL,to.getLevel()+1);
						masterList.put(imo.getFQID(),imo);
						to.addChild(imo,sortEntriesByName);
					}
				}
			}		
		} catch(MdException e) {
		}
	}

	private void retrieveDataExplorations() throws RemoteException {
		try {
			String xmlsel="<XMLSELECT Search=\"Transformation[@TransformRole='DataExploration']\"/>" + 
 			Constants.XMLSEL_TRANSFORMATIONS;
	 		List li = getMetadataObjects(xmlsel,MetadataObjects.TRANSFORMATION);

	 		// loop through data explorations
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				Transformation t = (Transformation)it.next();
				if(t.getTransformRole().equals(Constants.DATA_EXPLORATION)) {
					AssociationList trees = t.getTrees();
					if(trees != null && trees.size() > 0) {
						Tree t2 = (Tree)trees.get(0);
						String id = t2.getFQID();
						TreeObject to = (TreeObject)masterList.get(id);
						if(to != null) {
							DataExplorationObject deo = 
								new DataExplorationObject(to,t,to.getSBIPUrl()+"/"+getObjectName(t),
										Constants.DISPLAY_PAGE_VIEWITEM_URL,to.getLevel()+1);
							masterList.put(deo.getFQID(),deo);
							to.addChild(deo,sortEntriesByName);
						}
					}
				}
			}
		} catch (MdException e) {
		}
	}

	private void retrieveSTPReports() throws RemoteException {
		try {
			String xmlsel="<XMLSELECT Search=\"Transformation[@TransformRole='' and @Name ne '']\"/>" + 
 			Constants.XMLSEL_STPREPORTS;
	 		List li = getMetadataObjects(xmlsel,MetadataObjects.TRANSFORMATION);
	 		
	 		// loop through data explorations
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				Transformation t = (Transformation)it.next();
				AssociationList trees = t.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					if(to != null) {
						STPReportObject spro = 
								new STPReportObject(to,t,to.getSBIPUrl()+"/"+getObjectName(t),
									Constants.DISPLAY_PAGE_VIEWITEM_URL,to.getLevel()+1, dispEntriesByDesc);
							masterList.put(spro.getFQID(),spro);
							to.addChild(spro,sortEntriesByName);
					}
				}
			}
		} catch (MdException e) {
		}
	}

	private void retrieveStoredProcesses() throws RemoteException {
		try {
			String xmlsel="<XMLSELECT Search=\"ClassifierMap[@TransformRole='StoredProcess']\"/>" + 
 			Constants.XMLSEL_STOREDPROCESSES;
	 		List li = getMetadataObjects(xmlsel,MetadataObjects.CLASSIFIERMAP);
	 	
	 		// loop through data explorations
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				ClassifierMap c = (ClassifierMap)it.next();
				AssociationList trees = c.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					//String mm=getObjectName(c);
					//System.out.println("=====================: "+ mm);
					if(to != null) {
						StoredProcessObject spo = 
							new StoredProcessObject(to,c,to.getSBIPUrl()+"/"+getObjectName(c),
								Constants.DISPLAY_PAGE_VIEWITEM_URL,to.getLevel()+1, 
								stpRedirection, dispEntriesByDesc);
						masterList.put(spo.getFQID(),spo);
						to.addChild(spo,sortEntriesByName);
					}
				}
			}		
		} catch(MdException e) {
		}
	}
	private void retrieveStoredProcesses2() throws RemoteException {
		try {
			String xmlsel="<XMLSELECT Search=\"ClassifierMap[@TransformRole='StoredProcess']\"/>" + 
 			Constants.XMLSEL_STOREDPROCESSES;
	 		List li = getMetadataObjects(xmlsel,MetadataObjects.CLASSIFIERMAP);
	 	
	 		// loop through data explorations
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				ClassifierMap c = (ClassifierMap)it.next();
				AssociationList trees = c.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					if(to != null) {
						StoredProcessObject2 spo = 
							new StoredProcessObject2(to,c,to.getSBIPUrl()+"/"+getObjectName(c),
								Constants.DISPLAY_PAGE_VIEWITEM_URL,to.getLevel()+1, 
								stpRedirection, dispEntriesByDesc);
						masterList.put(spo.getFQID(),spo);
						to.addChild(spo,sortEntriesByName);
					}
				}
			}		
		} catch(MdException e) {
		}
	}
	private void retrieveVAExploration() throws RemoteException {
		try {
			String xmlsel="<XMLSELECT Search=\"DeployedComponent[@ProductIdentifier='ExplorationDto']\"/>" + 
 			Constants.XMLSEL_VAExploration;
	 		List li = getMetadataObjects(xmlsel,MetadataObjects.DEPLOYEDCOMPONENT);
	 		
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				DeployedComponent c = (DeployedComponent)it.next();
				AssociationList trees = c.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					if(to != null) {
						VAExplorationObject spo = 
							new VAExplorationObject(to,c,to.getSBIPUrl()+"/"+getObjectName(c),
								to.getLevel()+1, dispEntriesByDesc);
						masterList.put(spo.getFQID(),spo);
						to.addChild(spo,sortEntriesByName);
					}
				}
			}		
		} catch(MdException e) {
		}
	}

	private void retrieveVAReport() throws RemoteException {
		try {
			// search="Transformation[@PublicType='Report.BI']"
			String xmlsel="<XMLSELECT Search=\"Transformation[@PublicType='Report.BI']\"/>" + 
 			Constants.XMLSEL_VAReport;
	 		List li = getMetadataObjects(xmlsel,MetadataObjects.TRANSFORMATION);
	 		
	 		Iterator it = li.iterator();
			while(it.hasNext()) {
				Transformation c = (Transformation)it.next();
				AssociationList trees = c.getTrees();
				if(trees != null && trees.size() > 0) {
					Tree t2 = (Tree)trees.get(0);
					String id = t2.getFQID();
					TreeObject to = (TreeObject)masterList.get(id);
					if(to != null) {
						VAReportObject spo = 
							new VAReportObject(to,c,to.getSBIPUrl()+"/"+getObjectName(c),
								to.getLevel()+1, dispEntriesByDesc);
						masterList.put(spo.getFQID(),spo);
						to.addChild(spo,sortEntriesByName);
					}
				}
			}		
		} catch(MdException e) {
		}
	}
	
}
