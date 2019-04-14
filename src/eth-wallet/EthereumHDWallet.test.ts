import EthereumHDWallet from "./EthereumHDWallet";

describe("EthereumHDWallet", async () => {

    // BIP32, BIP39 and BIP44 are tested against data from https://www.coinomi.com/recovery-phrase-tool.html and testVector below
    const testnetMnemonic = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";

    const ethereumHDWallet = new EthereumHDWallet(testnetMnemonic, "", true);
    it("Constructor", () => {
        expect(ethereumHDWallet.accounts.length).toBeGreaterThan(10);
    });

    // it("acceptCheque", async () => {
    //     console.log("txFee = ", ethereumHDWallet.getTxFee());
    //     const response = await ethereumHDWallet.acceptCheque("da79b40d985b2dc4ca5b42a0bbd826552a48db822b365fd501e6f947e7dabc18");
    //     console.log(response);
    //
    // });

    it("HD", () => {
       expect(ethereumHDWallet.accounts[0].privateKey.startsWith("7af65ba4dd53")).toBeTruthy();
    });

    it("getUsdPrice", async () => {
        let result = await ethereumHDWallet.getUsdPrice();
        expect(result).toBeGreaterThan(100);
    });

    it("getBalance", async () => {
        const balance = await ethereumHDWallet.getBalance("0x04EBB7c0C5179041f83844CE79118Dd11B1da7FB");
        expect(balance).toBeGreaterThan(0);
    });

    it("wasAddressUsed", async () => {
        expect(await ethereumHDWallet.wasAddressUsed("0xde0b295668a9fd93d5f28d9ec85e40f4cb697bae")).toBe(false);
        expect(await ethereumHDWallet.wasAddressUsed("0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae")).toBe(true);
    });

    it("accounts", ()=> {
       const privateKey =  "0x95b6bd1166f910c971efce5df57fbbc9df6a7aed70070d733a442a7fb850c7e8";
       const account = ethereumHDWallet.web3.eth.accounts.privateKeyToAccount(privateKey);
       expect(account.address.toLocaleLowerCase()).toBe("0x543289b0965eba079b277b344dd1c0c2ab47a4ba");
       expect(account.privateKey).toBe(privateKey);
    });

    // it("createCheque", async () => {
    //    const cheque = await ethereumHDWallet.createCheque(0.0001);
    //    console.log(cheque);
    // });




});