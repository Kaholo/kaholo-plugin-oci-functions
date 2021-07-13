const { getFunctionsManagementClient, getArtifactsClient, getFunctionsInvokeClient, parseMultiAutoComplete } = require('./helpers');
const parsers = require("./parsers");
const { Readable } = require("stream")

async function createApplication(action, settings) {
  const client = getFunctionsManagementClient(settings);
  return client.createApplication({createApplicationDetails: {
    compartmentId: parsers.autocomplete(action.params.compartment) || settings.tenancyId,
    displayName: parsers.string(action.params.name),
    subnetIds: parseMultiAutoComplete(action.params.subnets),
    config: parsers.object(action.params.config),
    syslogUrl: parsers.string(action.params.syslogUrl),
    traceConfig: !action.params.enableTracing ? undefined : {
      isEnabled: true,
      domainId: parsers.autocomplete(action.params.apmDomain)
    }
  }});
}

async function createFunction(action, settings) {
  const client = getFunctionsManagementClient(settings);
  
  let {image} = action.params;
  image = image && image.value ? image.value : image;
  if (!image) throw "Must provide Image for function";

  const compartmentId = parsers.autocomplete(action.params.compartment) || settings.tenancyId;
  const artifactClient = getArtifactsClient(settings);
  const namespace = (await artifactClient.getContainerConfiguration({compartmentId})).containerConfiguration.namespace
  const fullImageName = `${settings.region}.ocir.io/${namespace}/${image}`;

  return client.createFunction({createFunctionDetails: {
    compartmentId: compartmentId,
    displayName: parsers.string(action.params.name),
    applicationId: parsers.autocomplete(action.params.app),
    image: fullImageName,
    memoryInMBs: parsers.number(action.params.memSize) || 128,
    timeoutInSeconds: parsers.number(action.params.timeout),
    traceConfig: !action.params.enableTracing ? undefined : {
      isEnabled: true
    }
  }});
}

async function invokeFunction(action, settings) {
  const functionId = parsers.autocomplete(action.params.function);
  const client = getFunctionsInvokeClient(settings);
  const manageClient = getFunctionsManagementClient(settings);
  const invokeEndpoint = (await manageClient.getFunction({functionId})).function.invokeEndpoint;
  client.endpoint = invokeEndpoint;

  return client.invokeFunction({
    functionId,
    fnIntent: action.params.fnIntent === "none" ? undefined : action.params.fnIntent,
    fnInvokeType: action.params.detached ? "detached" : "sync",
    invokeFunctionBody: action.params.body
  });
}

module.exports = {
  createApplication,
  createFunction,
  invokeFunction,
  ...require("./autocomplete")
}

