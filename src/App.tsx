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
    wallet: {
      "address": "0x0",
      "amount": 100,
    },
    balance: 100,
    sendAmount: 0,
    url: '',
    password: '',
  }

  constructor() {
    super({});
    // if localstorage contains seed phrase, if localstorage doesn't have, call function "generateSeedPhrase" and put it in localstorage.
    let localStorage = window.localStorage;
    let seed = localStorage.getItem('fuck-banks-seed');
    // if (!seed) {
    //   seed = generateSeedPhrase();
    //   // HDWallet wallet = createHDWallet(seed);
    //   localStorage.setItem('fuck-banks-seed', seed);
    // }
    // 
    // this.setState({
    //   wallet: getWallet(seed),
    //   balance: getBalance(),
    // });
    
  }

  createSendURL() {
    const url = '';
    this.setState({ url });
  }

  async createAndSendCheque(amt: number, password?: string) {
    // await status = createCheque(amt, password);
    // return status;
  }

  render() {
    let isSending = true;
    let { wallet, balance, sendAmount, url } = this.state;
    return (
      <div className="App">
        <div className="wallet">
          <div>
            <div>Address</div>
            <input type="text" value={wallet.address || '0x0'}></input>
            <a href="TODO"><div>Add funds</div></a>
          </div>
          <div>
            <div>Balance: {balance}</div>
            <a href="TODO"><div>Withdraw funds</div></a>
          </div>
        </div>
        { (isSending) ? <Send /> : <Receive /> }
      </div>
    );
  }
}

export default App;
