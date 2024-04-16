import * as dotenv from 'dotenv'
dotenv.config();

export const getUtxoList = async ({addy}: {addy: string}) => {
    const api = `${process.env.NETWORK === "bitcoin" ? process.env.MEMPOOL_API : process.env.MEMPOOL_TESTNET_API}/address/${addy}/utxo`
    const response = await fetch(api)
    if (response.ok) {
        const resJson: any = await response.json()
        return resJson
    }

    return []
}
