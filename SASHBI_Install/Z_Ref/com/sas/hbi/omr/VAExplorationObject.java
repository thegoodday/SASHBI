
package com.sas.hbi.omr;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.List;

import com.sas.metadata.remote.MdObjectBase;
import com.sas.servlet.tbeans.models.TreeNode;

public class VAExplorationObject extends MetadataObjectBase {
	// public StoredProcessObject(MetadataObjectIf parent, MdObjectBase obj, 
	//  String sbipUrl, String viewerUrl, int level, String redirectionAppl, Boolean dispBy)
	public VAExplorationObject(MetadataObjectIf parent, MdObjectBase obj,
		String sbipUrl, int level, Boolean dispBy) throws RemoteException {
		super(parent,MetadataSearchUtil.getObjectName(obj),
			MetadataSearchUtil.getObjectID(obj),
			MetadataSearchUtil.getObjectDesc(obj),null,level);
		 

		String encUrl=sbipUrl  + "(VisualExploration)";
		try {
			encUrl = URLEncoder.encode(sbipUrl,"UTF8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace(); 
		} 
		
		String url = "/SASVisualAnalyticsExplorer/VisualAnalyticsExplorer/VisualAnalyticsExplorerApp_noApp.jsp?";
			url += "saspfs_request_path_url=" + encUrl;
			url += "&saspfs_request_entitykey=" + getFQID() +"/DeployedComponent";
		String desc = "";
		if(dispBy == true){
			desc=getDescription();
			if (desc.equalsIgnoreCase(""))
				desc=getName();
			this.node = new TreeNode(getFQID(),desc,url);
		} else {
			this.node = new TreeNode(getFQID(),getName(),url);
		}
			
		//this.node = new TreeNode(getFQID(),getName(),url);
		this.node.setDefaultImage("InformationMap.gif");
		this.node.setExpandedImage("InformationMap.gif");
		this.node.setTitle(MetadataSearchUtil.createTooltip2(obj,Constants.TREE_OBJECT_TYPE_VAMAP,desc));
		
		this.node.setUserObject(new String[] {
			Constants.TREE_OBJECT_TYPE_VAMAP,
			getFQID(),
			getName(),
			getDescription()
		});
	}

	@Override
	public void traverse(VisitorIf vif) {
		vif.visit(this);
	}

	@Override
	public boolean hasChildren() {
		return false;
	}

	@Override
	public List getChildren() {
		return null;
	}

	@Override
	public void remove(String id) {
	}
}
