import React, { Component } from 'react';
import {
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
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

  render() {
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
        <div className="send">
          <div>Send Amount</div>
          <input
            type="number"
            onChange={(e) => {this.setState({sendAmount: e.target.value})}}>
          </input>
          <input
            type="string"
            placeholder="password"
            onChange={(e) => {this.setState({password: e.target.value})}}>
          </input>
          <div className="share-buttons">
            <TelegramShareButton url={url} >
              <TelegramIcon />
            </TelegramShareButton>
            <WhatsappShareButton url={url}>
              <WhatsappIcon />
            </WhatsappShareButton>
            <EmailShareButton url={url}>
              <EmailIcon />
            </EmailShareButton>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
