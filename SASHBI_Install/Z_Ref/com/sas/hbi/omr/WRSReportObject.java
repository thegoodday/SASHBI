package com.sas.hbi.omr;

import java.rmi.RemoteException;
import java.util.List;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import com.sas.metadata.remote.MdObjectBase;
import com.sas.servlet.tbeans.models.TreeNode;

public class WRSReportObject extends MetadataObjectBase {
	 
	public WRSReportObject(MetadataObjectIf parent, MdObjectBase obj, 
		String sbipUrl, String viewerUrl, int level) throws RemoteException {
		super(parent,MetadataSearchUtil.getObjectName(obj),
			MetadataSearchUtil.getObjectID(obj),
			MetadataSearchUtil.getObjectDesc(obj),null,level);
		sbipUrl=sbipUrl.substring(0,7) + "METASERVER" + sbipUrl.substring("SBIP://Foundation".length())+	"(Report)";
		String encUrl=sbipUrl;
		try {
			encUrl = URLEncoder.encode(sbipUrl,"UTF8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace(); 
		} 
		//String url = viewerUrl + "?fullyQualifiedLocation=" + encUrl +	"&reportURI=fromExpK";
		String url = "/SASWebReportStudio/openRVUrl.do" + "?rsRID=" + encUrl +	"&reportURI=fromExpK";

		this.node = new TreeNode(getFQID(),getName().substring(0, getName().length()-4),url);
		this.node.setDefaultImage("Report2.gif");
		this.node.setExpandedImage("Report2.gif");
		this.node.setTitle(MetadataSearchUtil.createTooltip(obj,Constants.TREE_OBJECT_TYPE_REPORT));
		
		this.node.setUserObject(new String[] { 
			Constants.TREE_OBJECT_TYPE_REPORT,
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
