const core = require("oci-core")
const identity = require("oci-identity");
const { getProvider, getVirtualNetworkClient, getApmDomainClient, getFunctionsManagementClient, getArtifactsClient } = require('./helpers');
const parsers = require("./parsers")

// auto complete helper methods

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}


/***
 * @returns {[{id, value}]} filtered result items
 ***/
function handleResult(result, query, specialKey){
  let items = result.items;
  if (items.length === 0) return [];
  items = items.map(item => ({
    id: specialKey ? item[specialKey] : item.id,
    value:  specialKey ? item[specialKey] : 
            item.displayName ? item.displayName : 
            item.name ? item.name : item.id
  }));

  if (!query) return items;
  query = query.split(" ");
  return items.filter(item => query.every(qWord => 
    item.value.toLowerCase().includes(qWord.toLowerCase())
  ));
}

// main auto complete methods

async function listCompartments(query, pluginSettings) {
  const settings = mapAutoParams(pluginSettings);
  const tenancyId = settings.tenancyId;
  const provider = getProvider(settings);
  const identityClient = await new identity.IdentityClient({
    authenticationDetailsProvider: provider
  });
  const result = await identityClient.listCompartments({
    compartmentId: tenancyId,
    compartmentIdInSubtree: true,
    accessLevel: "ACCESSIBLE"
  });
  const compartments = handleResult(result, query);
  compartments.push({id: tenancyId, value: "Tenancy"});
  return compartments;
}

async function listVCN(query, pluginSettings, pluginActionParams) {
  /**
   * This method will return all VCN
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const compartmentId = params.compartment || settings.tenancyId;
  const provider = getProvider(settings);
  const virtualNetworkClient = new core.VirtualNetworkClient({
    authenticationDetailsProvider: provider
  });

  const request = {compartmentId};
  const result = await virtualNetworkClient.listVcns(request);
  return handleResult(result, query);
}

async function listSubnets(query, pluginSettings, pluginActionParams) {
/**
 * This method will return all VCN
 */
const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
const compartmentId = params.compartment || settings.tenancyId;
const virtualNetworkClient = getVirtualNetworkClient(settings);
const result = await virtualNetworkClient.listSubnets({
  compartmentId,
  vcnId: params.vcn
});
return handleResult(result, query);
}

async function listApmDomains(query, pluginSettings, pluginActionParams) {
  /**
   * This method will return all APM domains in the specified compartment
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getApmDomainClient(settings);
  const result = await client.listApmDomains({compartmentId: params.compartment || settings.tenancyId});
  return handleResult(result, query);
}

async function listApps(query, pluginSettings, pluginActionParams) {
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getFunctionsManagementClient(settings);
  const result = await client.listApplications({compartmentId: params.compartment || settings.tenancyId});
  return handleResult(result, query);
}

async function listFunctions(query, pluginSettings, pluginActionParams) {
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getFunctionsManagementClient(settings);
  const result = await client.listFunctions({
    compartmentId: params.compartment || settings.tenancyId,
    applicationId: params.app
  });
  return handleResult(result, query);
}

async function listRepos(query, pluginSettings, pluginActionParams) {
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getArtifactsClient(settings);
  const result = await client.listContainerRepositories({compartmentId: params.compartment || settings.tenancyId});
  return handleResult(result, query);
}

async function listRepoImages(query, pluginSettings, pluginActionParams) {
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const client = getArtifactsClient(settings);
  const result = await client.listContainerImages({
    compartmentId: params.compartment || settings.tenancyId,
    repositoryId: params.imageRepository
  });
  return handleResult(result, query);
}

module.exports = {
  listCompartments,
  listVCN,
  listSubnets,
  listApmDomains,
  listApps,
  listFunctions,
  listRepos,
  listRepoImages
}
