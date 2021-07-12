# kaholo-plugin-oci-functions
Kaholo Plugin for integration with Oracle Cloud Infrastructure(OCI) Functions Service.

## Settings
1. Private Key (Vault) **Required** - Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
2. User ID (String) **Required** - The OCID of the user to authenticate with.
3. Tenancy ID (String) **Required** - Tenancy OCID. Can be found in user profile.
4. Fingerprint (Vault) **Required** -  Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
5. Region (String) **Required** - Identifier of the region to create the requests in. 

## Method Create Application
Create a new application that is stored in the specified subnets. An application stored multiple OCI Functions.

### Parameters
1. Compartment (Autocomplete) **Required** - The ID of the compartment to create the new application in.
2. Name (String) **Required** - The name of the new application.
3. VCN (Autocomplete) **Required** - The VCN to choose subnets from to host the application.
4. Subnets (Autocomplete/Array) **Required** - The subnet/s to store the application. To enter multiple values, pass value as array from code.
5. Config (Object) **Optional** - Application configuration for functions in this application (passed as environment variables). Can be overridden by function configuration. Keys must be ASCII strings consisting solely of letters, digits, and the ‘_’ (underscore) character, and must not begin with a digit. Values should be limited to printable unicode characters. Example: {“MY_FUNCTION_CONFIG”: “ConfVal”}. **Remember to pass value from code for Objects**
6. SyslLog URL (String) **Optional** - A syslog URL to which to send all function logs. Supports tcp, udp, and tcp+tls. The syslog URL must be reachable from all of the subnets configured for the application. **Note: If you enable the OCI Logging service for this application, the syslogUrl value is ignored.**
7. Enable Tracing (Boolean) **Optional** - Whether to enable tracing on the new application or not.
8. Tracing APM Domain (AutoComplete) **Optional** - The APM Domain to be the collector trace events will be sent to.


## Method Create Function
Create a new function in the specified application.

### Parameters
1. Compartment (Autocomplete) **Required** - The  compartment to create the new application in.
2. Application (Autocomplete) **Required** - The application to create the new function in.
3. Function Name (String) **Required** - The name of the new function.
4. Image Repository (Autocomplete) **Required** - The Image Repository to selecet the image from.
5. Image (Autocomplete) **Required** - The Image to create the function from.
6. Config (Object) **Optional** - Configuration to use in this function. Keys must be ASCII strings consisting solely of letters, digits, and the ‘_’ (underscore) character, and must not begin with a digit. Values should be limited to printable unicode characters. Example: {“MY_FUNCTION_CONFIG”: “ConfVal”}. **Remember to pass value from code for Objects**
6. Max Memory Used(MBs) (Options) **Optional** - The maximum size of memory to use, In MBs. Possivle Values are: 128/256/512/1024. Default value is 128.
7. Timeout(In Seconds) (Integer) **Optional** - If specified, the function will have the following timeout when being invoked.
8. Enable Tracing (Boolean) **Optional** - Whether to enable tracing in the new function or not.

## Method Invoke Function
Invoke\run the specified function.

### Parameters
1. Compartment (Autocomplete) **Required** - The compartment to get the application from.
2. Application (Autocomplete) **Required** - The application to get the function from.
3. Function (Autocomplete) **Required** - The function to invoke.
4. Invoke Function Body (Object) **Required** - The body of the function invocation.
5. Function Intent (Options) **Optional** - The intent of the invocation. An optional intent header that indicates to the FDK the way the event should be interpreted. Allowed values are: none/httprequest/cloudevent. Default value is none.
6. Invoke Detached (Boolean) **Optional** - Dicates whether the functions platform should execute the request detached or not. If not detached run directly and return the result. If detached, enqueue the request for later processing and acknowledge that it has been processed.
