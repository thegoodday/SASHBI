package com.sas.hbi.property;
import java.util.Properties;
import javax.sql.DataSource;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.transaction.annotation.EnableTransactionManagement;



@Configuration
@EnableTransactionManagement
@PropertySource({ "classpath:config.properties" })

public class AppConfig {
	@Autowired
	Environment env;

	public static void main(String[] args) {
		AppConfig aa = new AppConfig();
		aa.restDataSource();

	}





	@Bean
    public DataSource restDataSource() {
        final BasicDataSource dataSource = new BasicDataSource();
		String kk = env.getProperty("alm.DB_CONNECTION");
/*
        dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
        dataSource.setUrl(env.getProperty("jdbc.url"));
        dataSource.setUsername(env.getProperty("jdbc.user"));
        dataSource.setPassword(env.getProperty("jdbc.pass"));
*/


        return dataSource;
    }


}
