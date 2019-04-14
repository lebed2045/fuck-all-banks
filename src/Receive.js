import React, { Component } from 'react';
import './App.css';


class Receive extends Component {
  state = {
    acceptStatus: 'Not started',
    password: '',
    balance: '', 
    address: '', 
  }

  claimFunds = async () => {
    let { wallet, serializedCheque } = this.props;
    let { password } = this.state;

    console.log("url " + serializedCheque)
    const acceptStatus = await wallet.acceptCheque(serializedCheque, password)
    this.setState({ acceptStatus,  })
  }

  getFunds = async () => {
    let { wallet, serializedCheque } = this.props;
    console.log(wallet)
    const balance = await wallet.balanceOfCheque(serializedCheque)
    // const address = this.props.wallet.addressOfCheque(this.props.serializedCheque)
    this.setState({ balance: balance })
  }


  render() {
    let { acceptStatus, balance, address } = this.state;
    this.getFunds()
    console.log(this.props.serializedCheque)
    return (
      <div className="receive">
        <div>{"chequeBalance: " + balance}</div>
        <div>
          <div className="pwd">Password: </div>
          <input
            className="pwd-amt"
            type="password"
            placeholder="password"
            onChange={(e) => { this.setState({password: e.target.value}) }}>
          </input>
          <button onClick={this.claimFunds}>
            Claim funds
          </button>
        </div>
        {(acceptStatus === 'ok') ? <div>Money received</div> : <div>{acceptStatus}</div>}
      </div>
    );
  }
}

export default Receive;
