
require('dotenv').config({ path: '../.env' })

const { utils, BigNumber, Wallet, providers, getDefaultProvider, constants } = require("ethers")
const { getWallet, approve } = require('./functions')


const S_WALLET = getWallet(process.env.SOURCE_PK)
const T_WALLET = getWallet(process.env.TARGET_PK)


const execute = async () => {
    try {
        const txHash = await approve(
            S_WALLET, //Source wallet
            T_WALLET.address, //Target wallet address
            5000, //Token amount
            TOKENS.metaUFO.address, //Token address
            TOKENS.metaUFO.decimals, //Token decimals
            66355, //gasLimit
            5 //gasPrice (Gwei)
        )
        console.info("Transaction executed", txHash.hash)
        
    } catch(e) {
        console.error("Transaction error", e.message.substring(0, 49))
        console.log("----------------------------------------\n")
        execute()
    }
}
const TOKENS = {
    metaUFO: {
        address: "0x2ad7F18DcFA131e33411770A9c6c4fe49b187Bc2",//"0xA7b7b44194Cb5b339022B7C36AfAcAa323a4d248",//
        decimals: 18
    }
}

execute()
