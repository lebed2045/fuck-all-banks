import React, { Component } from 'react';
import EthereumHDWallet from './eth-wallet/EthereumHDWallet';
import './App.css';


class Receive extends Component {
  render() {
    let { wallet, balance, sendAmount, url } = this.props;
    return (
      <div className="receive">
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
    );
  }
}

export default Receive;
