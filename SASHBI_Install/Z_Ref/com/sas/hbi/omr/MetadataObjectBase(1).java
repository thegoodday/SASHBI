
package com.sas.hbi.omr;

import com.sas.servlet.tbeans.models.TreeNode;


public abstract class MetadataObjectBase implements MetadataObjectIf {
	private String name	= null;
	private String id	= null;
	private String desc	= null; 
	private int level   = 0;
	private MetadataObjectIf parent     = null;
	private String sbipurl				= null;
	protected boolean hidden            = false;
	protected TreeNode node 			= null;

	public MetadataObjectBase(MetadataObjectIf parent, String name, String id, String desc, 
		String sbipUrl, int level) {
		this.parent = parent;
		this.name   = name;
		this.id     = id;
		this.desc   = desc; 
		this.level  = level;
		this.sbipurl= sbipUrl;
	}
	
	@Override
	public String getSBIPUrl() {
		return sbipurl;
	}
	
	@Override
	public boolean isHidden() {
		return hidden;
	}

	@Override
	public TreeNode getTreeNode() {
		return node;
	}
	
	@Override
	public void setHidden(boolean b) {
		hidden = b;
	}
		
	@Override
	public MetadataObjectIf getParent() {
		return parent;
	}
	
	@Override
	public int getLevel() {
		return level;
	}
	
	@Override
	public String getName() {
		return name;
	}

	@Override
	public String getFQID() {
		return id;
	}

	@Override
	public String getDescription() {
		return desc;
	}
	
	@Override
	public String toString() {
		return name + "(" + id + ")"; 
	}

	@Override
	public boolean isExpanded() {
		if(node != null)
			return node.isExpanded();
		return false;
	}

	@Override
	public void setExpanded(boolean expanded) {
		if(node != null)
			node.setExpanded(expanded);
	}
}
