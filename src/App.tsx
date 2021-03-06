import React, { Component } from 'react';
import {
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import Send from './Send';
import Receive from './Receive';
import EthereumHDWallet from './eth-wallet/EthereumHDWallet';
import './App.css';


/*
"createHDWallet()" 
"getWallet()"
"getWalletBalance()"
"createCheque(amt, password="") => serialized uri str". This gets sent to WA/telegram/etc
"acceptCheque(str, password="")" => deserialize from URI, not good for query string, might contain slashes. decrypt using password. If success, "ok". Can return errors, 

keep public key in localstorage

public key field
addr balance
ctor asks mnemonic gives me 12 words as the seed phrase

algo: if localstorage contains seed phrase, if localstorage doesn't have, call function "generateSeedPhrase" and put it in localstorage.

create a check for that amount, make sure it's >= amt in USD

look into wyre for receiving side
*/

class App extends Component {
  state = {
    wallet: {},
    balance: 100,
    address: '',
    url: '',
    password: '',
  }

  // if localstorage contains seed phrase
  // if localstorage doesn't have, call function "generateSeedPhrase" and put it in localstorage.
  async componentDidMount() {
    let localStorage = window.localStorage;
    let seed = localStorage.getItem('fuck-banks-seed');    

    if (!seed) {
      seed = EthereumHDWallet.generateSeedPhrase();
      localStorage.setItem('fuck-banks-seed', seed);
    }
    const wallet = new EthereumHDWallet(seed)
    const balance = await wallet.getBalanceEther()
    const address = await wallet.getAddress()
    this.setState(() => ({ wallet, balance, address }));
  }

  render() {
    let isReceiving = window.location.href.split('/')[3] !== 'send';
    let serializedCheque;
    if (!isReceiving) {
      serializedCheque = window.location.href.split('=')[1];
    }
    let { wallet, balance, address } = this.state;
    return (
      <div className="App">
        <div className="wallet">
          <div>
            <div className="address">Address:</div>
            <input className="address-input" type="text" value={address}></input>
          </div>
          <div>
            <div className="balance">Balance: {balance}</div>
          </div>
        </div>
        {(isReceiving) ?
          <Receive wallet={wallet} serializedCheque={serializedCheque} /> :
          <Send wallet={wallet} balance={balance} /> }
      </div>
    );
  }
}

export default App;

"0x29db1183309daa28dbf4260f3525c8117444ffb0"