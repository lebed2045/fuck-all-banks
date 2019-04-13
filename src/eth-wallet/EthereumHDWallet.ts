import Bip39 from "bip39";
// import {hdkey} from "ethereumjs-wallet/hdkey";
import Axios from "axios";
import Web3 from "web3";

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

    async getBalance(address?: string): Promise<number> {
        address = address || this.accounts[0].address;
        const balance = await this.web3.eth.getBalance(address);
        return Number(balance);
    }

    async createCheque(amount: number, password: string): Promise<string> {
        // // get new unused temp account
        // let accountIndex = 1;
        // while (this.getBalance(this.accounts[accountIndex].address))
        // // create tx account -> temp account
        // // send sendTransaction
        // // encrypt private-key
        // // return serialized

        return "";
    }

    async acceptCheque(serializedCheque: string, password: string): Promise<string> {
        return "";
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