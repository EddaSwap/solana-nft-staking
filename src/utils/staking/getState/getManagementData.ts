import * as services from '../services';

import {decodeManagementData} from '../state/management.account';

async function getManagementData(connection: any) {

  const storagePubkey = services.getPublicKey('management_storage');

  const storage = await connection.getAccountInfo(storagePubkey);
  if (storage === null) {
    throw new Error('Error: cannot find storage account');
  }

  const data = decodeManagementData(storage.data);
  console.log(`Management data:`, data);

  return data;
}
  
export default getManagementData;
