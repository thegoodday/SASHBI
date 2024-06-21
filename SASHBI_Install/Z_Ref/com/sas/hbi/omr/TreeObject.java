package com.sas.hbi.omr;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import com.sas.metadata.remote.MdObjectBase;
import com.sas.servlet.tbeans.models.TreeNode;

public class TreeObject extends MetadataObjectBase {
	private ArrayList children = null;
	
	public TreeObject(MetadataObjectIf parent, MdObjectBase obj, String sbipUrl,
		String vdePageUrl, int level) throws RemoteException {
		super(parent,MetadataSearchUtil.getObjectName(obj),
			MetadataSearchUtil.getObjectID(obj), 
			MetadataSearchUtil.getObjectDesc(obj),sbipUrl,level);
		
		this.node = new TreeNode(getFQID(),getName());
		this.node.setUserObject(new String[] {
			Constants.TREE_OBJECT_TYPE_TREE,
			getFQID(),
			getName(),
			getDescription() 
		});
	}
	
	@Override
	public void remove(String id) {
		for(int i=0;children != null && i<children.size();i++) {
			MetadataObjectIf moif = (MetadataObjectIf)children.get(i);
			if(moif.getFQID().equals(id)) {
				node.remove(moif.getTreeNode());
				children.remove(moif);
				return;
			}
		}
	}
	
	public void addChild(MetadataObjectIf moif, boolean sorted) {
		if(children == null)
			children = new ArrayList();
		children.add(moif);
		TreeNode n1 	 = moif.getTreeNode();
		String[] s1 	 = (String[])n1.getUserObject();
		String c1		 = s1[2];
		if(s1[0].equals(Constants.TREE_OBJECT_TYPE_TREE))
			c1 = Constants.DEFAULT_TREE_PREFIX + c1;
		
		boolean inserted = false;
		if(sorted) {
			Enumeration e = node.children();
			while(e.hasMoreElements()) {
				TreeNode n2 = (TreeNode)e.nextElement();
				String[] s2 = (String[])n2.getUserObject();
				String c2   = s2[2];
				if(s2[0].equals(Constants.TREE_OBJECT_TYPE_TREE))
					c2 = Constants.DEFAULT_TREE_PREFIX + c2;
				
				if(c1.compareToIgnoreCase(c2) < 0) {
					node.insert(n1,node.getIndex(n2));
					inserted = true;
					break;
				}
			}
		}
		if(!inserted) {
			node.add(n1);
		}
	}

	@Override
	public boolean hasChildren() {
		return (children != null && children.size() > 0);
	}

	@Override
	public List getChildren() {
		return children;
	}
	
	@Override
	public void traverse(VisitorIf vif) {
		vif.visit(this);
		for(int i=0; children != null && i < children.size(); i++) {
			MetadataObjectIf moif = (MetadataObjectIf)children.get(i);
			moif.traverse(vif);
		}
	}
}
