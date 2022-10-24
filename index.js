// in nodejs
// require()

// in front-end js you cant use require
// import

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

console.log(ethers)

const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Wallet Connected"
    } else {
        connectButton.innerHTML = "Please install Metamask"
    }
}

//fund function

const fund = async () => {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider /connection to the blockchain
        // signer / wallet / someone with some gas
        // contract that we are interacting with
        // ^ ABI & Address

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // hey, wait for this transaction to mine
            await listenForTransactionMine(transactionResponse, provider)
            getBalance
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    //listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionRecepit) => {
            console.log(
                `completed with ${transactionRecepit.confirmations} confirmations`
            )
            resolve()
        })
    })
}

const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        balanceText.innerText = ` ${ethers.utils.formatEther(balance)} ETH`

        console.log(ethers.utils.formatEther(balance))
    }
}
const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            getBalance
        } catch (error) {
            console.log(error)
        }
    }
}

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const balanceText = document.getElementById("balance")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
