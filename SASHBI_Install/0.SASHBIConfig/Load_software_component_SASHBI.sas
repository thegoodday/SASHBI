
/*  Set metadata options to specify the server. */
options metaserver="korpmosrv2.apac.sas.com"
  metaport=8561
  metauser="sasadm@saspw"
  metapass="sask@123"
  metarepository="Foundation";



  /*
 * Loads the SAS Report Launcher - SoftwareComponent representing
 */
options nosymbolgen;


/************************************************************
 * Do not modify below this line
 ************************************************************/

/* **********************  Define tempFile Macro ************************** */

%macro tempFile( fname );
  %if %superq(SYSSCPL) eq %str(z/OS) or %superq(SYSSCPL) eq %str(OS/390) %then 
    %let recfm=recfm=vb;
  %else
    %let recfm=;
  filename &fname TEMP lrecl=2048 &recfm;
%mend;

%macro statusCheck();
  /* &syserr seems to be reset at every step boundary.
   * We'll assign its current value when the macro is invoked to
   * a global var named LOAD_STATUS. Then if LOAD_STATUS is ever FAILED,
   * we can print a suitable message.
   */

%if &LOAD_STATUS ne ABORT %then %do;
	*Assure that we never overwrite ABORT so that later statusChecks ;
	* give GOOD in error.;
	%if (&syserr ne 0 and &syserr ne 4) %then %let LOAD_STATUS = FAILED;
	%else  %let LOAD_STATUS = GOOD;
%end;
%mend statusCheck;

%global LOAD_STATUS;
%let LOAD_STATUS=GOOD;

%macro statusPrint;

data _null_;
/* Assure that errors print.
 * Else, print success!
 */
	%if &LOAD_STATUS = FAILED %then %do;
		putlog "ERROR: An error occurred while loading metadata.";
		%end;
	%else %if &LOAD_STATUS = ABORT %then %do;
		putlog "ERROR: Aborting because the metadata already exists!";
		%end;
	
	%else %do;
		putlog  "NOTE: Successfully loaded metadata.";
		%end;
run;
%mend statusPrint;


/*  Define macro to find metadata object IDs.

    Parameters:

    VARNAME  - name of a macro variable that will be set to the object ID.
               Set to blank if no matching object is found.  Set to the
               first matching object if more than one object is found.
    OBJTYPE  - An OMA type.  For example, AuthenticationDomain or LogicalServer
    SEARCH   - An XMLSelect string defining the match criteria.  For example,
               @Name='My Object Name'.

    Example:

    %getMetadataID(DOMAIN_ID, AuthenticationDomain, @Name='sas.com');

    finds an AuthenticationDomain named 'sas.com' and returns it in
    the DOMAIN_ID global macro variable.
*/

%macro getMetadataID(VARNAME,OBJTYPE,SEARCH);

  /*  Build the GetMetadata request. */

  %tempFile(request);
  data _null_;
    file request;
    put "<GetMetadataObjects>";
    put "<ReposId>$METAREPOSITORY</ReposId>";
    put "<Type>&OBJTYPE</Type>";
    put "<Objects/>";
    put "<ns>SAS</ns>";
    put "<Flags>128</Flags>";
    put "<Options>";
    put "%bquote(<XMLSelect search="&SEARCH"/>)";
    put "</Options>";
    put "</GetMetadataObjects>";
    run;

  /*  Issue the request. */

  %tempFile(response);
  proc metadata
    in=request
    out=response;
    run;

%if %eval(&SYSERR>4) %then %do;
    %put ERROR: Failed to find metadata object;
    %let LOAD_STATUS=FAILED;
    %return;
  %end;


  /*  Build the XML Map file to parse the response. */

  %tempFile(map);
  data _null_;
    file map encoding="utf-8";
    put '<?xml version="1.0" encoding="utf-8"?>';
    put '<SXLEMAP version="1.0">';
    put '<TABLE name="respid">';
    put "<TABLE_XPATH>//&OBJTYPE.</TABLE_XPATH>";

    put '<COLUMN name="Id">';
    put "<XPATH>//&OBJTYPE.@Id</XPATH>";
    put '<TYPE>character</TYPE>';
    put '<DATATYPE>STRING</DATATYPE>';
    put '<LENGTH>17</LENGTH>';
    put '</COLUMN>';
    put '</TABLE>';
    put '</SXLEMAP>';

    run;

  /*  Parse the response with the XML library engine and PROC SQL. */

  libname response xml xmlmap=map;

  %global &VARNAME;
  %let &VARNAME=;

  %local NOBS;
  proc sql noprint ;
    select Id, count(Id)
    into   :&VARNAME, :NOBS
    from   response.respid;
    quit;

  /*  Cleanup. 
  filename request;
  filename response;
  filename map;
  libname  response;
*/
  %put;
  %if %superq(&VARNAME) eq %then
    %put WARNING: Unable to find &OBJTYPE matching "&SEARCH";
  %else %if %eval(&NOBS) gt 1 %then
    %put NOTE: Found %cmpres(&NOBS) matching &OBJTYPE.s.  Using first object %superq(&VARNAME);
  %else
    %put NOTE: Found &OBJTYPE %superq(&VARNAME);
%mend;


%macro getMeta;

/* Check if the pref connection already exists. If so, abort. Otherwise,
 * a "duplicate" connection would be created.
 */

%getMetadataID(WIP_TREE, SoftwareComponent, @Name='SAS Application Infrastructure');
%put &WIP_TREE;
%getMetadataID(Pref_SWC, SoftwareComponent, @Name='SASHBI');

%if &Pref_SWC ne  %then %do;
	%put "ERROR: Aborting because the SAS Report Launcher SoftwareComponent already exists!";
    %let LOAD_STATUS=ABORT;
    %return; 
%end;
%else %put "NOTE: Creating SAS Report Launcher SoftwareComponent.";

%mend getMeta;

%getMeta;

/* Output the XML for this theme connection */
%tempFile(tempxml);
options nocardimage;
data _null_;
    file tempxml;
 length long $256;
  input;
  long = _infile_;
  long = tranwrd(long, '$WIP_TREE', "&WIP_TREE");
  long = trim(long);
  put long ' ';
  cards4;

<AddMetadata>
<Metadata>

<SoftwareComponent Desc="SASHBI" 
     Major="9" Minor="3" Name="SASHBI" 
     ProductName="SASHBI" PublicType="Application"
     SoftwareVersion="1.0" SpecVersion="1.0" 
     UsageVersion="1000000" TLObjN="1">
		<DeployedComponents>
			<DeployedComponent Name="Registered SAS Application">
				<SourceConnections>
					<TCPIPConnection  Name="Connection URI" 
					                  CommunicationProtocol="http" 
					                  Desc="The URL to the root context of the preferences WAR"
					                  HostName="korpmosrv2.apac.sas.com" 
					                  Port="80" 
					                  Service="/SASHBI"/>
				</SourceConnections>
			</DeployedComponent>
		</DeployedComponents>
		<ImplementedObjects>
			<SoftwareComponent ObjRef="$WIP_TREE" />
		</ImplementedObjects>
</SoftwareComponent>

</Metadata>
<Reposid>$METAREPOSITORY</Reposid>
<Ns>SAS</Ns>
<Flags>268435456</Flags>
<Options/>
</AddMetadata>
;;;;

  
run;

%macro loadMetadata;

  %if &LOAD_STATUS ne GOOD %then %return;
	/*  Load the metadata. */
	proc metadata
	  in=tempxml;
	  run;
	quit;
  %statusCheck;
%mend loadMetadata;

/* Load the metadata */
%loadMetadata;

/* Cleanup */
filename tempxml;

%statusPrint;
