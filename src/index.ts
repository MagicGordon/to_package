
import * as clientUtils from '@near-eth/utils'
import { ethers } from 'ethers'
import { readFileSync } from 'fs'

async function findEthProof(queryType: string, transactionHash: string) {
    let abi = ""
    let eventName = ""
    let address = ""

    if (queryType === 'Custodian') {
        abi = readFileSync('./abi/etherCustodian.full.abi').toString()
        address = '0x84a82Bb39c83989D5Dc07e1310281923D2544dC2'
        eventName = 'Deposited'
    } else if (queryType === 'eNEAR') {
        abi = readFileSync('./abi/eNEAR.abi').toString()
        address = '0xe6b7C088Da1c2BfCf84aaE03fd6DE3C4f28629dA'
        eventName = 'TransferToNearInitiated'
    } else if (queryType === 'erc20') {
        abi = readFileSync('./abi/ERC20Locker.full.abi').toString()
        address = '0xc115851ca60aed2ccc6ee3d5343f590834e4a3ab'
        eventName = 'Locked'
    } else {
        return {
            code: -1,
            data: "Invaild queryType: Custodian、eNEAR or erc20"
        }
    }


    try {
        let ethProvider = new ethers.providers.InfuraProvider(
            'mainnet',
            process.env.INFURA_ID
        )
        let proof = await clientUtils.findEthProof(
            eventName,
            transactionHash,
            address,
            abi.toString(),
            ethProvider
        )
        return {
            code: 0,
            data: proof
        }
    } catch (error) {
        return {
            code: -1,
            data: error
        }
    }
}

async function main() {
    // console.log(await findEthProof('Custodian', '0x8a98332f70ae537a3d5d9a642b7b68af9033c5a1a4008e8eb5ac1b875daf085e'))
    // console.log(await findEthProof('erc20', '0x87a48690b34d7e54c4dc4a2ca8bc8689193bed4c9ae0969d58a94f4af0e77788'))
    console.log(await findEthProof('eNEAR', '0xe26f9bf405c0f051d0f589e3cb3ffd12a88e30781cc24b17b873df82b958601c'))
}

main()