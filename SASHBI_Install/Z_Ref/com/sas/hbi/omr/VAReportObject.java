
package com.sas.hbi.omr;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.List;

import com.sas.metadata.remote.MdObjectBase;
import com.sas.servlet.tbeans.models.TreeNode;

public class VAReportObject extends MetadataObjectBase {
	
	public VAReportObject(MetadataObjectIf parent, MdObjectBase obj,
		String sbipUrl, int level, Boolean dispBy) throws RemoteException {
		super(parent,MetadataSearchUtil.getObjectName(obj),
			MetadataSearchUtil.getObjectID(obj),
			MetadataSearchUtil.getObjectDesc(obj),null,level);
		
		//System.out.println("sbipUrl : " + sbipUrl);
		//String encUrl=sbipUrl  + "(Report)";
		int lastPosition = sbipUrl.lastIndexOf("/");
		String reportPath=sbipUrl.substring(17,lastPosition);
		String reportName=sbipUrl.substring(lastPosition+1);
		//System.out.println("reportPath : " + reportPath);
		//System.out.println("reportName : " + reportName);

		try {
			//encUrl = URLEncoder.encode(sbipUrl,"UTF8");
			reportPath = URLEncoder.encode(reportPath,"UTF8");
			reportName = URLEncoder.encode(reportName,"UTF8");
		} catch (UnsupportedEncodingException e) { 
			e.printStackTrace();
		} 

		/* 7.3 changed by koryhh 20160424
		String url = "/SASVisualAnalyticsViewer/VisualAnalyticsViewer_guest.jsp?appSwitcherDisabled=Yes";
			url += "&saspfs_request_path_url=" + encUrl;
			url += "&saspfs_request_entitykey=" + getFQID() +"/Transformation";
		*/
		String url = "/SASVisualAnalyticsViewer/VisualAnalyticsViewer_guest.jsp?";
		url += "reportName=" + reportName;
		url += "&reportPath=" + reportPath;
		url += "&appSwitcherDisabled=true";
		url += "&reportViewOnly=true";
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
		this.node.setTitle(MetadataSearchUtil.createTooltip2(obj,Constants.TREE_OBJECT_TYPE_VARPT,desc));
		
		this.node.setUserObject(new String[] {
			Constants.TREE_OBJECT_TYPE_VARPT,
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
