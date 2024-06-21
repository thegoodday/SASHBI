package com.sas.hbi.tools;

import java.rmi.RemoteException;

import com.sas.metadata.remote.CMetadata;
import com.sas.metadata.remote.MdException;
import com.sas.services.ServiceException;
import com.sas.services.session.SessionContextInterface;


public class STPNote {

	//~ Instance fields --------------------------------------------------------
	private String stpObjId;
	private String stpNote;
	private CMetadata repository;
	
	//~ Methods ----------------------------------------------------------------
	public CMetadata getRepository() {
		return repository;
	}
	public String getSTPNote() {
		return stpNote;
	}
	public String getStpObjId() {
		return stpObjId;
	}
	public void setRepository(CMetadata repository) {
		this.repository = repository;
	} 
	public void setStpObjId(String stpObjId) {
		this.stpObjId = stpObjId;
	}
	public void setSTPNote(String stpNoteText) {
		this.stpNote = stpNoteText;
	}
	
    protected MetadataUtil getMetadataUtil(SessionContextInterface sci) throws IllegalStateException, RemoteException, ServiceException {
    	MetadataUtil metadataUtil = new MetadataUtil(sci);    	
        if (metadataUtil.connectToServer()) {
        	setRepository(metadataUtil.getFoundationRepository());
        } else {
            System.out.println("Not Connected...");
        }
        return metadataUtil;
    }
    public void saveSTPNote (SessionContextInterface sci,String NoteName) throws IllegalStateException, RemoteException, ServiceException, MdException{
    	getMetadataUtil(sci).setSTPNote(getRepository(), getStpObjId(), getSTPNote(), NoteName);	
    }
    public void deleteSTPNote (SessionContextInterface sci,String NoteName) throws IllegalStateException, RemoteException, ServiceException, MdException{
    	getMetadataUtil(sci).removeSTPNote(getRepository(), getStpObjId(), NoteName);
    }
    public String getSTPNote(SessionContextInterface sci,String NoteName) throws IllegalStateException, RemoteException, ServiceException, MdException{
    	return getMetadataUtil(sci).getSTPNote(getRepository(), getStpObjId(), NoteName);
    }
}