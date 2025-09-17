import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateVehicleData {
  vehicle_insert: Vehicle_Key;
}

export interface GetUserVehiclesData {
  vehicles: ({
    id: UUIDString;
    make: string;
    model: string;
    plateNumber: string;
  } & Vehicle_Key)[];
}

export interface GetVehiclesData {
  vehicles: ({
    id: UUIDString;
    make: string;
    model: string;
    manufacturingYear: number;
    plateNumber: string;
  } & Vehicle_Key)[];
}

export interface InsurancePolicy_Key {
  id: UUIDString;
  __typename?: 'InsurancePolicy_Key';
}

export interface UpdateUserDisplayNameData {
  user_update?: User_Key | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface ValidationError_Key {
  id: UUIDString;
  __typename?: 'ValidationError_Key';
}

export interface VehicleMake_Key {
  id: UUIDString;
  __typename?: 'VehicleMake_Key';
}

export interface VehicleModel_Key {
  id: UUIDString;
  __typename?: 'VehicleModel_Key';
}

export interface Vehicle_Key {
  id: UUIDString;
  __typename?: 'Vehicle_Key';
}

interface CreateVehicleRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateVehicleData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateVehicleData, undefined>;
  operationName: string;
}
export const createVehicleRef: CreateVehicleRef;

export function createVehicle(): MutationPromise<CreateVehicleData, undefined>;
export function createVehicle(dc: DataConnect): MutationPromise<CreateVehicleData, undefined>;

interface GetVehiclesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVehiclesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetVehiclesData, undefined>;
  operationName: string;
}
export const getVehiclesRef: GetVehiclesRef;

export function getVehicles(): QueryPromise<GetVehiclesData, undefined>;
export function getVehicles(dc: DataConnect): QueryPromise<GetVehiclesData, undefined>;

interface UpdateUserDisplayNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserDisplayNameData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateUserDisplayNameData, undefined>;
  operationName: string;
}
export const updateUserDisplayNameRef: UpdateUserDisplayNameRef;

export function updateUserDisplayName(): MutationPromise<UpdateUserDisplayNameData, undefined>;
export function updateUserDisplayName(dc: DataConnect): MutationPromise<UpdateUserDisplayNameData, undefined>;

interface GetUserVehiclesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserVehiclesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserVehiclesData, undefined>;
  operationName: string;
}
export const getUserVehiclesRef: GetUserVehiclesRef;

export function getUserVehicles(): QueryPromise<GetUserVehiclesData, undefined>;
export function getUserVehicles(dc: DataConnect): QueryPromise<GetUserVehiclesData, undefined>;

