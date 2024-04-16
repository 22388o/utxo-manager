import * as dotenv from 'dotenv'
dotenv.config();

import * as ecc from 'tiny-secp256k1';
import { ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import { initEccLib } from "bitcoinjs-lib";
const bitcoin = require('bitcoinjs-lib');
bitcoin.initEccLib(ecc);
const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
initEccLib(tinysecp as any);
const ECPair: ECPairAPI = ECPairFactory(tinysecp);

import * as bs58check from "bs58check";
import { sha256 } from "js-sha256";


const RBF_INPUT_SEQUENCE = 0xfffffffd

interface KeyPairInfo {
    address: string;
    output: string;
    childNodeXOnlyPubkey: any;
    tweakedChildNode: any;
    childNode: any;
}

export const toXOnly = (publicKey: any) => {
    return publicKey.slice(1, 33);
}

const getKeypairInfo = (childNode: any): KeyPairInfo => {
    const childNodeXOnlyPubkey = toXOnly(childNode.publicKey);
    const { address, output } = bitcoin.payments.p2tr({
        internalPubkey: childNodeXOnlyPubkey,
        network: process.env.NETWORK === "bitcoin" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
    });
  
    const tweakedChildNode = childNode.tweak(
      bitcoin.crypto.taggedHash('TapTweak', childNodeXOnlyPubkey),
    );
  
    return {
      address,
      tweakedChildNode,
      childNodeXOnlyPubkey,
      output,
      childNode
    }
}

export const sendTo = async ({utxos, toAddy, satsbyte = 30}: {utxos: any[], toAddy: string, satsbyte: number}) => {

    console.log(`Try sending ${utxos.length} UTXOs to address ${toAddy} at ${satsbyte} satsbyte...\n`)

    const keypair = ECPair.fromWIF(process.env.WIF || "")
    const keypairInfo = getKeypairInfo(keypair)

    const psbt = new bitcoin.Psbt({ network: process.env.NETWORK === "bitcoin" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet })
    const { output: script } = detectAddressTypeToScripthash((process.env.NETWORK === "bitcoin" ? process.env.ADDRESS : process.env.TESTNET_ADDRESS) || "")

    let totalInputValue = 0
    for(const utxo of utxos) {
        const { value, txid, index } = utxo
        psbt.addInput({
            sequence: RBF_INPUT_SEQUENCE,
            hash: txid,
            index: index,
            witnessUtxo: { value, script: Buffer.from(script, 'hex')},
            tapInternalKey: keypairInfo.childNodeXOnlyPubkey
        })
        totalInputValue += value
    }

    psbt.addOutput({
        value: totalInputValue - 30294,
        address: process.env.NETWORK === "bitcoin" ? process.env.ADDRESS : process.env.TESTNET_ADDRESS
    })

    for(const i in utxos) {
        psbt.signInput(parseInt(i), keypairInfo.tweakedChildNode)
    }
    psbt.finalizeAllInputs()
    const tx = psbt.extractTransaction()
    const rawtx = tx.toHex()

    console.log(rawtx)
    const broadcastAPI = `${process.env.NETWORK === "bitcoin" ? process.env.MEMPOOL_API : process.env.MEMPOOL_TESTNET_API}/tx`
    // const txId = await fetch(broadcastAPI, {
    //     method: "POST",
    //     body: rawtx,
    // })

    // console.log(txId)

    return {
        result: 'success',
        rawtx,
        // txId
    }
}

export function detectAddressTypeToScripthash(address: string): { output: string, scripthash: string, address: string } {
    // Detect legacy address
    try {
      bitcoin.address.fromBase58Check(address, process.env.NETWORK === "bitcoin" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet);
      const p2pkh = addressToP2PKH(address);
      const p2pkhBuf = Buffer.from(p2pkh, "hex");
      return {
        output: p2pkh,
        scripthash: Buffer.from(sha256(p2pkhBuf), "hex").reverse().toString("hex"),
        address
      }
    } catch (err) {
    }
    // Detect segwit or taproot
    // const detected = bitcoin.address.fromBech32(address);
    const BECH32_SEGWIT_PREFIX = 'bc1';
    const BECH32_TAPROOT_PREFIX = 'bc1p';
    const TESTNET_SEGWIT_PREFIX = 'tb1';
    const REGTEST_TAPROOT_PREFIX = 'bcrt1p';
    if (address.startsWith(BECH32_SEGWIT_PREFIX) || address.startsWith(BECH32_TAPROOT_PREFIX) ||
        address.startsWith(TESTNET_SEGWIT_PREFIX) || address.startsWith(REGTEST_TAPROOT_PREFIX)) {
      return convertAddressToScripthash(address, process.env.NETWORK === "bitcoin" ? bitcoin.networks.bitcoin : bitcoin.networks.testnet);
    } else {
      throw new Error(`Unrecognized address format for address: ${address}`);
    }
}

export function addressToP2PKH(address: string): string {
    const addressDecoded = bs58check.decode(address);
    const addressDecodedSub = addressDecoded.toString().substr(2);
    const p2pkh = `76a914${addressDecodedSub}88ac`;
    return p2pkh;
}

function convertAddressToScripthash(address: string, network: any) {
    const output = bitcoin.address.toOutputScript(address, network);
    return {
        output,
        scripthash: Buffer.from(sha256(output), "hex").reverse().toString("hex"),
        address
    };
}