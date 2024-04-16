const getUtxoList = require('./utils/get-utxo-list')
const sendTo = require('./utils/send-to')

const main = async () => {
    const list = getUtxoList(process.env.address)
    console.log(list)
}

main()