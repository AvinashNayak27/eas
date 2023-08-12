import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import 'dotenv/config'

export const EASContractAddress = "0x4200000000000000000000000000000000000021"; // OPGoerli 

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

const provider = new ethers.providers.AlchemyProvider('optimism-goerli', process.env.ALCHEMY_API_KEY);

const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

eas.connect(signer);


const schemaUID = "0x0d8e519b516505830678629f2e76e0e5a318673faef950b6acf00963149468b4";

const schemaEncoder = new SchemaEncoder('bool NSFW');
const encodedData = schemaEncoder.encodeData([{ name: 'NSFW', value: false, type: 'bool' }]);
console.log(encodedData);

const hello = async () => {

  try {
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient:signer.address,
        data: encodedData
      },
    });
    const newAttestationUID = await tx.wait();
    console.log(newAttestationUID);
  }
  catch (error) {
    console.log(error);

  }

}

hello();