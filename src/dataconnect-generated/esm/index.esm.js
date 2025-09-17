import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'codenection2025',
  location: 'us-central1'
};

export const createVehicleRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVehicle');
}
createVehicleRef.operationName = 'CreateVehicle';

export function createVehicle(dc) {
  return executeMutation(createVehicleRef(dc));
}

export const getVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehicles');
}
getVehiclesRef.operationName = 'GetVehicles';

export function getVehicles(dc) {
  return executeQuery(getVehiclesRef(dc));
}

export const updateUserDisplayNameRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserDisplayName');
}
updateUserDisplayNameRef.operationName = 'UpdateUserDisplayName';

export function updateUserDisplayName(dc) {
  return executeMutation(updateUserDisplayNameRef(dc));
}

export const getUserVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserVehicles');
}
getUserVehiclesRef.operationName = 'GetUserVehicles';

export function getUserVehicles(dc) {
  return executeQuery(getUserVehiclesRef(dc));
}

