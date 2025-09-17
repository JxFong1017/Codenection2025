const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'codenection2025',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createVehicleRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVehicle');
}
createVehicleRef.operationName = 'CreateVehicle';
exports.createVehicleRef = createVehicleRef;

exports.createVehicle = function createVehicle(dc) {
  return executeMutation(createVehicleRef(dc));
};

const getVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehicles');
}
getVehiclesRef.operationName = 'GetVehicles';
exports.getVehiclesRef = getVehiclesRef;

exports.getVehicles = function getVehicles(dc) {
  return executeQuery(getVehiclesRef(dc));
};

const updateUserDisplayNameRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserDisplayName');
}
updateUserDisplayNameRef.operationName = 'UpdateUserDisplayName';
exports.updateUserDisplayNameRef = updateUserDisplayNameRef;

exports.updateUserDisplayName = function updateUserDisplayName(dc) {
  return executeMutation(updateUserDisplayNameRef(dc));
};

const getUserVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserVehicles');
}
getUserVehiclesRef.operationName = 'GetUserVehicles';
exports.getUserVehiclesRef = getUserVehiclesRef;

exports.getUserVehicles = function getUserVehicles(dc) {
  return executeQuery(getUserVehiclesRef(dc));
};
