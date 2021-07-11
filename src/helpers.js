const common = require("oci-common");
const functions = require("oci-functions");
const artifacts = require("oci-artifacts");
const core = require("oci-core");
const apm = require("oci-apmcontrolplane");
const parsers = require("./parsers");

/***
 * @returns {common.SimpleAuthenticationDetailsProvider} OCI Auth Details Provider
 ***/
function getProvider(settings){
  return new common.SimpleAuthenticationDetailsProvider(
      settings.tenancyId,     settings.userId,
      settings.fingerprint,   settings.privateKey,
      null,                   common.Region.fromRegionId(settings.region)
  );
}

/***
 * @returns {functions.FunctionsManagementClient} OCI Functions Management Client
 ***/
function getFunctionsManagementClient(settings){
  const provider = getProvider(settings);
  return new functions.FunctionsManagementClient({
    authenticationDetailsProvider: provider
  });
}

/***
 * @returns {functions.FunctionsInvokeClient} OCI Functions Invoke Client
 ***/
function getFunctionsInvokeClient(settings){
  const provider = getProvider(settings);
  return new functions.FunctionsInvokeClient({
    authenticationDetailsProvider: provider
  });
}

/***
 * @returns {artifacts.ArtifactsClient} OCI Artifacts Client
 ***/
function getArtifactsClient(settings){
  const provider = getProvider(settings);
  return new artifacts.ArtifactsClient({
    authenticationDetailsProvider: provider
  });
}
 

/***
 * @returns {core.VirtualNetworkClient} OCI Virtual Network Client
 ***/
 function getVirtualNetworkClient(settings){
  const provider = getProvider(settings);
  return new core.VirtualNetworkClient({
    authenticationDetailsProvider: provider
  });
}

/***
 * @returns {apm.ApmDomainClient} OCI APM Domain Client
 ***/
function getApmDomainClient(settings){
  const provider = getProvider(settings);
  return new apm.ApmDomainClient({
    authenticationDetailsProvider: provider
  });
}

function parseMultiAutoComplete(param){
  param = parsers.autocomplete(param);
  if (param && !Array.isArray(param)) return [param];
  return param;
}

module.exports = {
    getProvider,
    getFunctionsManagementClient,
    getFunctionsInvokeClient,
    getArtifactsClient,
    getVirtualNetworkClient,
    getApmDomainClient,
    parseMultiAutoComplete
}