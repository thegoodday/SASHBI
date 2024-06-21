package com.sas.hbi.property;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;


public class HBIConfig {
	private static String configFile = "config.properties";
	private static Properties conf;
	private static HBIConfig instance;
	@Value("${stp.installpath}")
	private static String stpInstallPath;


	public HBIConfig() throws IOException {
		/*
		if (instance != null) {
			throw new Error();
		}
		*/
		conf = new Properties();
		InputStream inputStream = getClass().getClassLoader().getResourceAsStream(configFile);
		if ( inputStream != null){
			conf.load(inputStream);
			System.out.println("=================================================> HBIConfig is loadded...." + stpInstallPath);
		} else {
			throw new FileNotFoundException("Config file " + configFile + " not found in the classpath");
		}
	}

	public static Properties getConf() {
		return conf;
	}

	public void setConf(Properties conf) {
		HBIConfig.conf = conf;
	}

	/*
	public synchronized HBIConfig getInstance() throws IOException {
		if (instance == null) {
			instance = new HBIConfig();
		}
		return instance;
	}
	*/
	public static HBIConfig getInstance() throws IOException{
		if(instance == null){
			synchronized(HBIConfig.class){
				if(instance == null){
					instance = new HBIConfig();
				}
			}
		}
		return instance;
	}
}

/*
com.sas.hbi.tools.HBIConfig
public class HBIConfig {
	public HBIConfig(){
		super();
	}
	public Properties getConfig() throws IOException{
		Properties property = new Properties();
		String configFile = "config.properties";
		InputStream inputStream = getClass().getClassLoader().getResourceAsStream(configFile);
		if ( inputStream != null){
			property.load(inputStream);
		} else {
			throw new FileNotFoundException("Config file " + configFile + " not found in the classpath");
		}
		return property;
	}
}
  
*/
