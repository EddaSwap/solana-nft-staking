import {
    STAKER_STORAGE_SIZE,
    decodeStakerData,
    StakerStorage
} from './state/staker.account';
import { PublicKey } from '@solana/web3.js';

function sortItems(array: any) : any{
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if(!array[j] || !array[j+1]){
            continue;
        }
        
        if (array[j].points < array[j + 1].points) {
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        } else if (array[j].points == array[j + 1].points &&  array[j].stake_date.getTime() > array[j+1].stake_date.getTime()) {
            let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  }
  

const getStats = async (connection: any) => {
    const stakerStorageAccounts = await connection.getProgramAccounts(new PublicKey(process.env.REACT_APP_PROGRAM_ID || ''), {
        filters: [{ dataSize: STAKER_STORAGE_SIZE }],
    });

    const stakerStorageKeys = stakerStorageAccounts.map(
        function (account: any) {
            return account.pubkey;
        }
    );

    let totalStaked = 0;
    let filterStakerInfos: any[] = [];
    for (let i = 0; i < stakerStorageKeys.length; i++) {
        const item = stakerStorageKeys[i];
        const stakerData = await getStakerNft(connection, item);
        
        if (stakerData) {
            const stakeNFTRecord = getStakeNftStat(stakerData);
            totalStaked = totalStaked + parseInt(stakeNFTRecord.no_nfts);
            filterStakerInfos.push(stakeNFTRecord);
        }
    }
    
    return {
        totalStaked,
        userList: sortItems(filterStakerInfos),
    }
}


const getStakerNft = async (connection: any, stakerStorageKey: PublicKey) => {
    const storage = await connection.getAccountInfo(stakerStorageKey);
    if (storage === null) {
        console.log('Error: cannot find storage account');
        return null;
    }

    const data = decodeStakerData(storage.data);
    return data;
};

const getStakeNftStat = (stakerData: StakerStorage): any => {
    const stakes = stakerData.stakes;

    let stakeDate =  new Date();
    stakes.forEach(item => {
        const _stakeDate = new Date(item.date_initialized.toNumber());
        if(stakeDate.getTime() > _stakeDate.getTime()) {
            stakeDate = _stakeDate;
        }
    })
    
    return {
        staker_address: stakerData.staker_address,
        stake_date: stakeDate,
        no_nfts: stakerData.stakes.length.toString(),
        points: stakerData.totalPoints(),
    };
};

export default getStats;