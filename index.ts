import * as dotenv from 'dotenv'
dotenv.config();

const { getUtxoList } = require('./utils/get-utxo-list')
const { getUtxoDetail } = require('./utils/get-utxo-detail')
const { sendTo } = require('./utils/send-to')

const utxoList = [
    // {"type":"send","index":1,"vout":1,"txid":"23dcb2266f757dfab6b88a034c0dcc34684f4b90d1a6a639b61d59c0d059e78d","value":7887760,"ordinals":[],"atomicals":[],"confirmed":false}
    {"type":"send","index":1,"vout":1,"txid":"7b79886463460ae410f3f6f9c93af261ae226f5b879ad1f50eb7d4d43e265ff5","value":14800,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"e8b09bde1bafef6b469b297cadc70b6b27776fda8facb7741e060f0b763a9066","value":14800,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":4,"vout":4,"txid":"5c410458899e02cca2b8053fdf4b69a5b6fc244dcfdfd8ee20aefbe9f3be2d88","value":14800,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":9,"vout":9,"txid":"5c410458899e02cca2b8053fdf4b69a5b6fc244dcfdfd8ee20aefbe9f3be2d88","value":14800,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":19,"vout":19,"txid":"5c410458899e02cca2b8053fdf4b69a5b6fc244dcfdfd8ee20aefbe9f3be2d88","value":14800,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"76c42e6cddb4e55c6eda7c6dfa70ce9d93d4d93d663f3c13f6f588122b75456c","value":6049,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"76c414e1b7ad770b7f83dbdff6f45d7ab3177da40c542d0633a30f542ded105c","value":6049,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"76c4c4374081af0591ad7d97cc0c02b922af18dcb1c4af9bc252d140054fe352","value":6049,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"76c42849d21d29bd2a2b8871901e0e9c30f2810c3c6250a4c08a4fcc0b970eff","value":6049,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"76c4e90628f2612e9add9834285b2144571c0b3fcf5a2b73a0800be18c6f03dd","value":6049,"ordinals":[],"atomicals":[],"confirmed":false},
    {"type":"send","index":1,"vout":1,"txid":"76c4b2c0a8fb4737dac192bc704c563e309d9b6f16cb5624567589303d5f24fa","value":6049,"ordinals":[],"atomicals":[],"confirmed":false},
]

const main = async () => {
    // const list = await getUtxoList({ addy: process.env.ADDRESS})
    // for (const utxo of list) {
    //     const { txid, vout, status, value } = utxo
    //     const { confirmed } = status
    //     if (confirmed)
    //         console.log(value, vout)
    // }

    // const detail = await getUtxoDetail({ txid: 'e8b09bde1bafef6b469b297cadc70b6b27776fda8facb7741e060f0b763a9066' })
    const { result, txid } = await sendTo({ utxos: utxoList, toAddy: process.env.ADDRESS})
    console.log(result)
}

main()