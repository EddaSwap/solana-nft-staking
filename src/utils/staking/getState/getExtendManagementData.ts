
import {
  checkProgram,
  getExtendManagementKey,
} from '../services';
import { decodeExtendManagementData } from '../state/extend_management.account';


async function getExtendManagementData(connection: any) {

  const programId = await checkProgram(connection);

  const storagePubkey = await getExtendManagementKey(programId);

  const storage = await connection.getAccountInfo(storagePubkey);
  if (storage === null) {
    throw new Error('Error: cannot find storage account');
  }

  const data = decodeExtendManagementData(storage.data);
  console.log(`Extend Management data:`, data);

  return data;
}

export default getExtendManagementData;
