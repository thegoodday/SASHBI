/**
 * $Id$
 * Title:       InformationMapObject.java
 * Description:
 * Copyright:   Copyright (c) 2005
 * Company:     SAS Institute
 * Author:      Hans Edert (GERHJE)
 * Support:     Hans Edert (GERHJE)
 */
package com.sas.hbi.omr;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.List;

import com.sas.metadata.remote.MdObjectBase;
import com.sas.servlet.tbeans.models.TreeNode;


public class InformationMapObject extends MetadataObjectBase {
	
	public InformationMapObject(MetadataObjectIf parent, MdObjectBase obj,
		String sbipUrl, String viewerUrl, int level) throws RemoteException {
		super(parent,MetadataSearchUtil.getObjectName(obj),
			MetadataSearchUtil.getObjectID(obj),
			MetadataSearchUtil.getObjectDesc(obj),null,level);
		 

		String encUrl=sbipUrl  + "(BriefInformationMap)";
		try {
			encUrl = URLEncoder.encode(sbipUrl,"UTF8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}  
		
		String url = viewerUrl + "?fullyQualifiedLocation=" + encUrl +	"&reportURI=fromExpK";
		this.node = new TreeNode(getFQID(),getName(),url);
		this.node.setDefaultImage("InformationMap.gif");
		this.node.setExpandedImage("InformationMap.gif");
		this.node.setTitle(MetadataSearchUtil.createTooltip(obj,Constants.TREE_OBJECT_TYPE_MAP));
		
		this.node.setUserObject(new String[] {
			Constants.TREE_OBJECT_TYPE_MAP,
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
