
const { utils, BigNumber, Wallet, providers, getDefaultProvider, constants } = require("ethers")
const erc20Abi = require("./erc20.json")

const getWallet = (privKeyOrMnemonic) => {
    var w = null

    if(privKeyOrMnemonic) {
        if(privKeyOrMnemonic.includes(" ")) {
            w = Wallet.fromMnemonic(privKeyOrMnemonic, "m/44'/60'/0'/0/0")
            w = new Wallet(w.privateKey, new providers.JsonRpcProvider(process.env.RPC_URL))
    
        } else {
            w = new Wallet(privKeyOrMnemonic, new providers.JsonRpcProvider(process.env.RPC_URL))
        }
    }
    
    return w
}

const DATA_CACHE = {

}

const getCacheKey = (func, args) => {
    var key = `${func}:`
    args.forEach(arg => {
        key += `${arg}`
    })
    return key
}
const approve = async (ownerWallet, spenderAddress, tokenAmount, tokenAddress, tokenDecimal, gasLimit, gasPrice) => {
    const base = BigNumber.from(10);
    const valueToTransfer = base.pow(tokenDecimal).mul(BigNumber.from(tokenAmount))

    const iface = new utils.Interface(erc20Abi);

    const dataKey = getCacheKey("approve", [spenderAddress, valueToTransfer.toString()])
    let rawData = DATA_CACHE[dataKey]
    if(!rawData) {
        rawData = iface.encodeFunctionData("approve", [spenderAddress, valueToTransfer.toString()])
        DATA_CACHE[dataKey] = rawData
    }
    const nonce = await ownerWallet.getTransactionCount("pending")

    var transaction = {
        gasLimit: gasLimit,
        gasPrice: BigNumber.from(gasPrice).mul(BigNumber.from("1000000000")), // 10 Gwei*/
        from: ownerWallet.address,
        to: tokenAddress, // token contract address
        data: rawData,
        type: 0,
        nonce: nonce,
        chainId: 56
    }


    //transaction = await ownerWallet.populateTransaction(transaction);
    let signedTransaction = await ownerWallet.signTransaction(transaction)
    
    /*
    console.log("owner", ownerWallet.address)
    console.log("spender", spenderAddress)
    console.log("value", valueToTransfer.toString())
    console.log("rawData", rawData)
    console.log("nonce", nonce)
    console.log("transaction", transaction)
    console.log("signedTransaction", signedTransaction)*/

    const txHash = await ownerWallet.provider.sendTransaction(signedTransaction)
    return txHash
}

module.exports = {
    getWallet, approve
}