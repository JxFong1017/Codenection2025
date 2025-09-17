import { CreateVehicleData, GetVehiclesData, UpdateUserDisplayNameData, GetUserVehiclesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateVehicle(options?: useDataConnectMutationOptions<CreateVehicleData, FirebaseError, void>): UseDataConnectMutationResult<CreateVehicleData, undefined>;
export function useCreateVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<CreateVehicleData, FirebaseError, void>): UseDataConnectMutationResult<CreateVehicleData, undefined>;

export function useGetVehicles(options?: useDataConnectQueryOptions<GetVehiclesData>): UseDataConnectQueryResult<GetVehiclesData, undefined>;
export function useGetVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<GetVehiclesData>): UseDataConnectQueryResult<GetVehiclesData, undefined>;

export function useUpdateUserDisplayName(options?: useDataConnectMutationOptions<UpdateUserDisplayNameData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserDisplayNameData, undefined>;
export function useUpdateUserDisplayName(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserDisplayNameData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserDisplayNameData, undefined>;

export function useGetUserVehicles(options?: useDataConnectQueryOptions<GetUserVehiclesData>): UseDataConnectQueryResult<GetUserVehiclesData, undefined>;
export function useGetUserVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserVehiclesData>): UseDataConnectQueryResult<GetUserVehiclesData, undefined>;
