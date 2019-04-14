import Bip39 from "bip39";
// import {hdkey} from "ethereumjs-wallet/hdkey";
import Axios from "axios";
import Web3 from "web3";
import EthTx from "ethereumjs-tx";

export default class EthereumHDWallet {
    // BIP44 https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
    static BIP44_DERIVE_PATH = "m/44'/60'/0'/0";
    static DEFAULT_USD_PRICE = 150;
    static RPC_URL = "https://ropsten.infura.io/v3/f3b38f25c98e44aebb3f047a9c66d3d6";

    usdPrice: number;
    accounts: Array<{ address: string, privateKey: string }>;

    isTestnet: boolean;
    seed: Buffer;
    nextUnusedAddressIndex: number;
    web3: Web3;


    constructor(bip39SeedPhrase: string, password?: string, testnet?: boolean) {
        this.usdPrice = EthereumHDWallet.DEFAULT_USD_PRICE;

        // console.log(bip39SeedPhrase);

        if (!Bip39.validateMnemonic(bip39SeedPhrase)) {
            throw new Error("Not valid seed phrase. Expected string with Bip39 12-24 words mnemonic phrase");
        }

        this.seed = Bip39.mnemonicToSeed(bip39SeedPhrase, password);

        this.isTestnet = testnet || true;

        let hdkey = require('ethereumjs-wallet/hdkey');
        let hdwallet = hdkey.fromMasterSeed(this.seed);
        let wallet_hdpath = "m/44'/60'/0'/0/";

        this.accounts = [];
        for (let i = 0; i < 100; i++) {

            let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
            let address = '0x' + wallet.getAddress().toString("hex");
            let privateKey = wallet.getPrivateKey().toString("hex");
            this.accounts.push({address: address, privateKey: privateKey});
        }

        // we consider that address_index = 0 is always used,
        // even if it's new address, because it's our actual wallet address
        this.nextUnusedAddressIndex = 1;

        this.web3 = new Web3(EthereumHDWallet.RPC_URL)
    }

    static generateSeedPhrase(): string {
        return Bip39.generateMnemonic();
    }


    getAddress(): string {
        return this.accounts[0].address;
    }

    async wasAddressUsed(address: string): Promise<boolean> {
        // http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=0xde0b295668a9fd93d5f28d9ec85e40f4cb697bae
        const response = await Axios.get("http://api-ropsten.etherscan.io/api?module=account&action=txlist&address="+address);
        const responseJson = response.data;
        // console.log(address, responseJson["status"]);
        return responseJson["status"] !== "0";
    }
    async getBalance(address?: string): Promise<number> {
        address = address || this.accounts[0].address;
        const balance = await this.web3.eth.getBalance(address);
        return Number(balance);
    }

    async signTransactionToIndex(index: number, amountWei: number) {
        const account_1 = this.web3.eth.accounts.privateKeyToAccount("0x" + this.accounts[0].privateKey);
        // console.log(index, this.accounts[index]);
        const account_2 = this.web3.eth.accounts.privateKeyToAccount("0x" + this.accounts[index].privateKey);
        // console.log(account_2.address);
        const toAddress = account_2.address;
        const fromPrivateKey = this.accounts[0].privateKey;
        return await this.signTransaction(fromPrivateKey, toAddress, amountWei);
    }

    getGasPrise() {
        return Number(this.web3.utils.toWei("2", "gwei"));
    }

    getGasLimit() {
        return 21000;
    }

    getTxFee() {
        return this.getGasPrise() * this.getGasLimit();
    }

    async signTransaction(fromPrivateKey: string, toAddress: string, amountWei: number) {
        console.log("sign tx to", toAddress, amountWei);
        // console.log("aa");
        const account_1 = this.web3.eth.accounts.privateKeyToAccount("0x" + fromPrivateKey);
        const txObject = {
            nonce: this.web3.utils.toHex(await this.web3.eth.getTransactionCount(account_1.address)),
            to: toAddress,
            value: this.web3.utils.toHex(amountWei),
            gasLimit: this.web3.utils.toHex(this.getGasLimit()),
            gasPrice: this.web3.utils.toHex(this.getGasPrise())
        };
        // Sign transaction
        // console.log("a");
        const tx = new EthTx(txObject);
        // console.log("b");
        const bufferPrivateKey1 = Buffer.from(fromPrivateKey, "hex");
        // console.log("c");
        tx.sign(bufferPrivateKey1);
        // Serialize tx for sending it to the network
        const serializedTx = tx.serialize();
        // console.log("d");
        const rawTx = "0x" + serializedTx.toString("hex");
        // console.log("e");

        return await this.sendRawTransaction(rawTx);
    }

    async sendRawTransaction(rawtx: string) {
        console.log("sending rawTx", rawtx);
        return new Promise((resolve, reject) => {
            this.web3.eth.sendSignedTransaction(rawtx)
                .on("transactionHash", (txHash) => {
                    resolve(txHash);
                })
                .on("error", (e) => {
                    reject(e);
                })
                .on("receipt", (m) => {
                    console.log("receipt = ", m);
                });
        });
    }

    etherToWei(amountEther: number) : number {
        return Number(this.web3.utils.toWei("" + amountEther, "ether"));
    }

    async getNextUnusedAccountIndex() {
        let accountIndex = this.nextUnusedAddressIndex;
        while (await this.wasAddressUsed(this.accounts[accountIndex].address) ) {
            accountIndex += 1;
            // console.log(accountIndex, this.accounts[accountIndex]);
        }
        this.nextUnusedAddressIndex = accountIndex;
        console.log("nextUnusedAddressIndex", accountIndex);
        return accountIndex;
    }
    async createCheque(amountEther: number, password = ""): Promise<string> {
        const amountOfWei = this.etherToWei(amountEther);
        // get new unused temp account
        let accountIndex = await this.getNextUnusedAccountIndex();
        // create tx account -> temp account
        const response = await this.signTransactionToIndex(accountIndex, amountOfWei);
        // send sendTransaction
        return encodeURI(this.accounts[accountIndex].privateKey);
        // encrypt private-key
        // return serialized
    }

    async acceptCheque(serializedCheque: string, password = ""): Promise<string> {
        const stringifyObject = decodeURI(serializedCheque);
        // console.log(stringifyObject);
        const privateKey = stringifyObject;
        const chequeAccount = this.web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
        const balance = await this.getBalance(chequeAccount.address);
        console.log("cheque Balance and privateKey= ", balance, privateKey);
        if (balance < 10000) {
            return "Empty cheque";
        }
        const chequeAmountWei = balance - this.getTxFee() - 0;
        try {
            const response = await this.signTransaction(privateKey, this.getAddress(), chequeAmountWei);
            console.log(response);
        } catch (e) {

        }
        return "Accepted " + chequeAmountWei + " wei";
    }

    async getUsdPrice(): Promise<number> {
        let response = await Axios.get("https://api.infura.io/v1/ticker/ethusd");
        // console.log(response);
        const responseJson = response.data;
        // console.log(responseJson);
        try {
            this.usdPrice = responseJson["bid"];
        } catch (e) {
            this.usdPrice = EthereumHDWallet.DEFAULT_USD_PRICE;
        }
        return this.usdPrice;
    }

};