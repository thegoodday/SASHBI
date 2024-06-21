package com.sas.hbi.property;

import org.springframework.beans.factory.annotation.Value;

public class HBIConf {
	@Value("${stp.connMethod}")
	private String stpConnMethod;

	public String getConnMethod() {
		return stpConnMethod;
	}

	public void setConnMethod(String connMethod) {
		this.stpConnMethod = connMethod;
	}
	
}
