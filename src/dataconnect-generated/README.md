# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetVehicles*](#getvehicles)
  - [*GetUserVehicles*](#getuservehicles)
- [**Mutations**](#mutations)
  - [*CreateVehicle*](#createvehicle)
  - [*UpdateUserDisplayName*](#updateuserdisplayname)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetVehicles
You can execute the `GetVehicles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVehicles(): QueryPromise<GetVehiclesData, undefined>;

interface GetVehiclesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVehiclesData, undefined>;
}
export const getVehiclesRef: GetVehiclesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVehicles(dc: DataConnect): QueryPromise<GetVehiclesData, undefined>;

interface GetVehiclesRef {
  ...
  (dc: DataConnect): QueryRef<GetVehiclesData, undefined>;
}
export const getVehiclesRef: GetVehiclesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVehiclesRef:
```typescript
const name = getVehiclesRef.operationName;
console.log(name);
```

### Variables
The `GetVehicles` query has no variables.
### Return Type
Recall that executing the `GetVehicles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVehiclesData {
  vehicles: ({
    id: UUIDString;
    make: string;
    model: string;
    manufacturingYear: number;
    plateNumber: string;
  } & Vehicle_Key)[];
}
```
### Using `GetVehicles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVehicles } from '@dataconnect/generated';


// Call the `getVehicles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVehicles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVehicles(dataConnect);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
getVehicles().then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

### Using `GetVehicles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVehiclesRef } from '@dataconnect/generated';


// Call the `getVehiclesRef()` function to get a reference to the query.
const ref = getVehiclesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVehiclesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

## GetUserVehicles
You can execute the `GetUserVehicles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserVehicles(): QueryPromise<GetUserVehiclesData, undefined>;

interface GetUserVehiclesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserVehiclesData, undefined>;
}
export const getUserVehiclesRef: GetUserVehiclesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserVehicles(dc: DataConnect): QueryPromise<GetUserVehiclesData, undefined>;

interface GetUserVehiclesRef {
  ...
  (dc: DataConnect): QueryRef<GetUserVehiclesData, undefined>;
}
export const getUserVehiclesRef: GetUserVehiclesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserVehiclesRef:
```typescript
const name = getUserVehiclesRef.operationName;
console.log(name);
```

### Variables
The `GetUserVehicles` query has no variables.
### Return Type
Recall that executing the `GetUserVehicles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserVehiclesData {
  vehicles: ({
    id: UUIDString;
    make: string;
    model: string;
    plateNumber: string;
  } & Vehicle_Key)[];
}
```
### Using `GetUserVehicles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserVehicles } from '@dataconnect/generated';


// Call the `getUserVehicles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserVehicles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserVehicles(dataConnect);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
getUserVehicles().then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

### Using `GetUserVehicles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserVehiclesRef } from '@dataconnect/generated';


// Call the `getUserVehiclesRef()` function to get a reference to the query.
const ref = getUserVehiclesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserVehiclesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateVehicle
You can execute the `CreateVehicle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createVehicle(): MutationPromise<CreateVehicleData, undefined>;

interface CreateVehicleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateVehicleData, undefined>;
}
export const createVehicleRef: CreateVehicleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVehicle(dc: DataConnect): MutationPromise<CreateVehicleData, undefined>;

interface CreateVehicleRef {
  ...
  (dc: DataConnect): MutationRef<CreateVehicleData, undefined>;
}
export const createVehicleRef: CreateVehicleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVehicleRef:
```typescript
const name = createVehicleRef.operationName;
console.log(name);
```

### Variables
The `CreateVehicle` mutation has no variables.
### Return Type
Recall that executing the `CreateVehicle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVehicleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVehicleData {
  vehicle_insert: Vehicle_Key;
}
```
### Using `CreateVehicle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVehicle } from '@dataconnect/generated';


// Call the `createVehicle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVehicle();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVehicle(dataConnect);

console.log(data.vehicle_insert);

// Or, you can use the `Promise` API.
createVehicle().then((response) => {
  const data = response.data;
  console.log(data.vehicle_insert);
});
```

### Using `CreateVehicle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVehicleRef } from '@dataconnect/generated';


// Call the `createVehicleRef()` function to get a reference to the mutation.
const ref = createVehicleRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVehicleRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_insert);
});
```

## UpdateUserDisplayName
You can execute the `UpdateUserDisplayName` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserDisplayName(): MutationPromise<UpdateUserDisplayNameData, undefined>;

interface UpdateUserDisplayNameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserDisplayNameData, undefined>;
}
export const updateUserDisplayNameRef: UpdateUserDisplayNameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserDisplayName(dc: DataConnect): MutationPromise<UpdateUserDisplayNameData, undefined>;

interface UpdateUserDisplayNameRef {
  ...
  (dc: DataConnect): MutationRef<UpdateUserDisplayNameData, undefined>;
}
export const updateUserDisplayNameRef: UpdateUserDisplayNameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserDisplayNameRef:
```typescript
const name = updateUserDisplayNameRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserDisplayName` mutation has no variables.
### Return Type
Recall that executing the `UpdateUserDisplayName` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserDisplayNameData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserDisplayNameData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserDisplayName`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserDisplayName } from '@dataconnect/generated';


// Call the `updateUserDisplayName()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserDisplayName();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserDisplayName(dataConnect);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserDisplayName().then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserDisplayName`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserDisplayNameRef } from '@dataconnect/generated';


// Call the `updateUserDisplayNameRef()` function to get a reference to the mutation.
const ref = updateUserDisplayNameRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserDisplayNameRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

