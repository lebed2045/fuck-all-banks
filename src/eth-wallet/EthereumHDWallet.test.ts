import EthereumHDWallet from "./EthereumHDWallet";

describe("EthereumHDWallet", () => {

    // BIP32, BIP39 and BIP44 are tested against data from https://www.coinomi.com/recovery-phrase-tool.html and testVector below
    const testnetMnemonic = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";

    const ethereumHDWallet = new EthereumHDWallet(testnetMnemonic, "", true);
    it("Constructor", () => {
        expect(ethereumHDWallet.accounts.length).toBeGreaterThan(10);
    });

    it("getUsdPrice", async () => {
        let result = await ethereumHDWallet.getUsdPrice();
        expect(result).toBeGreaterThan(100);
    });

    it("getBalance", async () => {
        const balance = await ethereumHDWallet.getBalance("0x04EBB7c0C5179041f83844CE79118Dd11B1da7FB");
       expect(balance).toBeGreaterThan(0);
    });

});