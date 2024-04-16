const sendTo = async ({utxos, toAddy, satsbyte}: {utxos: any[], toAddy: string, satsbyte: number}) => {
    console.log(`sending ${utxos.length} UTXOs to address ${toAddy} at ${satsbyte} satsbyte...\n`)
    return {
        result: 'failure',
        txid: 'blahblah'
    }
}

export default sendTo