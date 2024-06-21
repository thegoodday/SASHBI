
package com.sas.hbi.omr;

import java.rmi.RemoteException;
import java.util.List;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import com.sas.metadata.remote.MdObjectBase;
import com.sas.servlet.tbeans.models.TreeNode;


public class STPReportObject extends MetadataObjectBase {
	
	public STPReportObject(MetadataObjectIf parent, MdObjectBase obj,
		String sbipUrl, String viewerUrl, int level, Boolean dispBy) throws RemoteException {
		super(parent,MetadataSearchUtil.getObjectName(obj),
			MetadataSearchUtil.getObjectID(obj), 
			MetadataSearchUtil.getObjectDesc(obj),null,level);
		
		String baseURL="/SASStoredProcess/do?";
		String optURL="_action=form,properties,execute,nobanner,newwindow&";
		sbipUrl=sbipUrl.substring("SBIP://Foundation".length());
		String encUrl=sbipUrl;
		try {
			encUrl = URLEncoder.encode(encUrl,"UTF8");
		} catch (UnsupportedEncodingException e) { 
			e.printStackTrace();
		} 
		String url=baseURL+optURL+"_report="+encUrl;
		String desc = "";
		if(dispBy == true){
			desc=getDescription();
			if (desc.equalsIgnoreCase(""))
				desc=getName();
			this.node = new TreeNode(getFQID(),desc,url);
		} else {
			this.node = new TreeNode(getFQID(),getName(),url);
		}

		this.node.setDefaultImage("StoredProcessReport.gif");
		this.node.setExpandedImage("StoredProcessReport.gif");
		this.node.setTitle(MetadataSearchUtil.createTooltip2(obj,Constants.TREE_OBJECT_TYPE_STP,desc));
		
		this.node.setUserObject(new String[] {
			Constants.TREE_OBJECT_TYPE_STP,
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
