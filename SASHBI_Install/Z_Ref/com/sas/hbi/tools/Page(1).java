package com.sas.hbi.tools;

import java.rmi.RemoteException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.io.IOException;
import java.lang.Object;

import org.apache.log4j.Logger;

import com.sas.hbi.omr.MetadataObjectIf;
import com.sas.hbi.omr.MetadataSearchUtil;
import com.sas.hbi.tools.MetadataUtil;
import com.sas.services.session.SessionContextInterface;
import com.sas.services.user.UserContextInterface;
import com.sas.services.user.UserIdentityInterface;
import com.sas.servlet.tbeans.models.TreeNode;


public class Page {
	private static Logger logger = Logger.getLogger("tools.Page");
	private MetadataSearchUtil msu = null;
	private MetadataSearchUtil msu2 = null;
	private LinkedHashMap pDescInfo = new LinkedHashMap();
	private LinkedHashMap pNameInfo = new LinkedHashMap();
	private HashMap<String, TreeNode> pageTreeInfo = new HashMap<String, TreeNode>();
	private String boardTitle = null;
	

	/*
	public static void main(String[] args) throws RemoteException {
		logger.setLevel(Level.INFO);
			
		Page TEST = new Page();
		MetadataSearchUtil msu = TEST.initMSU();
		HashMap<String, String> boardList = TEST.getBoardList(msu);
		logger.debug("Main : " + boardList);				
	}
	*/
	public Page(){ 
        super();
    }
	public void closeMSU() throws RemoteException{
		this.msu.dispose();
		this.msu2.dispose();
	}
	public void initMSU(SessionContextInterface sci,String hostname, String port) throws RemoteException{
		UserContextInterface ucif    = sci.getUserContext();
		UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth"); 
		String principal=(String) id.getPrincipal(); 
		String credential=(String) id.getCredential(); 
		
		msu = new MetadataSearchUtil(null); 
		msu.init(principal,credential, hostname, port);
		msu.setLoadInformationMaps(false);
		msu.setLoadStoredProcesses(true);
		msu.setLoadWRSReports(true);
		msu.setSortEntriesByName(true);
		msu.setDispEntriesByDesc(true);

		msu2 = new MetadataSearchUtil(null); 
		msu2.init(principal,credential, hostname, port);
		msu2.setLoadInformationMaps(false);
		msu2.setLoadStoredProcesses(true);
		msu2.setLoadWRSReports(true);
		msu2.setSortEntriesByName(true);
		msu2.setDispEntriesByDesc(true);
		
		//return msu;
		this.msu = msu;
		this.msu2 = msu2;
	}
	public String getBoardTitle(){
		return this.boardTitle;
	}
	public HashMap<String,String> getPageList(String boardName) throws IOException{
		HashMap<String, String> pageList = new HashMap<String, String>();

		String[] pageInfo = MetadataUtil.getRootFolder(boardName);
		MetadataObjectIf moif = msu.buildTreeHierarchy(pageInfo);
		
		TreeNode tn = moif.getTreeNode();
		String[] rootInfo = (String[])tn.getUserObject();
		boardTitle = rootInfo[3];
		if (boardTitle != "" ) boardTitle = "- " + boardTitle;
		logger.debug("boardTitle : " + boardTitle);

		//String fName, fID, fDesc;
		String fID=null;
		if(tn.getAllowsChildren()) {
			Enumeration enm = tn.children();
			while(enm.hasMoreElements()) {
				TreeNode ptNode = (TreeNode)enm.nextElement();
				String[] pInfo = (String[])ptNode.getUserObject();
				if (pInfo[0].equalsIgnoreCase("Tree")) {
					fID= pInfo[1].substring(pInfo[1].indexOf(".")+1);

					pNameInfo.put(fID,pInfo[2]);
					pDescInfo.put(fID,pInfo[3]);
					pageList.put(pInfo[2], pInfo[3]);

					//Enumeration enm2 = ptNode.children();
					//TreeNode ptNode2 = (TreeNode)enm2.nextElement();
					pageTreeInfo.put(fID,ptNode);
				}
			}
		}		
		return pageList;
	}
	public HashMap<String, TreeNode> getPageTreeInfo(){
		return this.pageTreeInfo;
	}
	public LinkedHashMap getPageNameInfo(){
		return this.pNameInfo;
	}
	public LinkedHashMap getPageDescriptionInfo(){
		return this.pDescInfo;
	}
	@SuppressWarnings("unchecked")
	public HashMap<String, String> getBoardList() throws IOException{
		List<Object> rootList = msu.getRootFolders();
		HashMap<String, String> boardList = new HashMap<String, String>();
		HashMap<String, String> exceptList = new HashMap<String, String>();
		exceptList.put("Shared Data","Shared Data");
		exceptList.put("Portal Application Tree","Portal Application Tree");
		exceptList.put("User Folders","User Folders");
		exceptList.put("System","System");
		exceptList.put("","");
		String fid=null;
		for(int ii=0; ii<rootList.size();ii++){
			fid=rootList.get(ii).toString();
			if(!exceptList.containsKey(fid)) {
				if (hasContents(fid)) {
					boardList.put(fid,getRootFolderDescription(fid));	
				}
			}
				
		}		
		logger.debug("boardList : " + boardList);				
		return boardList;
	}
	private boolean hasContents(String folderName) throws IOException{
		boolean hasContents = false;
		String[] contents = MetadataUtil.getRootFolder(folderName);
		logger.debug("folderName : " + folderName);
		MetadataObjectIf moif = msu.buildTreeHierarchy(contents);
		if (!moif.isHidden()){
			TreeNode boardNode = moif.getTreeNode();
			String[] rootInfo = (String[])boardNode.getUserObject();
			logger.debug(folderName + " has : " + rootInfo[2]);
			int childCount = boardNode.getChildCount();
			logger.debug(folderName + " childCount : " + childCount);

			int hasFolder = 0;
			if ( childCount > 0){
				Enumeration enm = boardNode.children();
				while(enm.hasMoreElements()) {
					TreeNode pageNode = (TreeNode)enm.nextElement();
					Enumeration enm2 = pageNode.children();
					while(enm2.hasMoreElements()) {
						TreeNode tabNode = (TreeNode)enm2.nextElement();
						Enumeration enm3 = tabNode.children();
						while(enm3.hasMoreElements()) {
							Object item = enm3.nextElement();
							if (item instanceof TreeNode) {
								hasFolder += 1;
								break;
							}
						}
					}
				} 
			}
			logger.debug(folderName + " has " + hasFolder);
			if(hasFolder > 0) hasContents = true;
		}
		return hasContents;
	}
	private String getRootFolderDescription(String folderName) throws IOException{
		String[] contents = MetadataUtil.getRootFolder(folderName);
		logger.debug("folderName : " + folderName);
		MetadataObjectIf moif = msu.buildTreeHierarchy(contents);
		TreeNode folderNode = moif.getTreeNode();
		String[] rootInfo = (String[])folderNode.getUserObject();
		return rootInfo[3];
	}
}
