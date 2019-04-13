import React, { Component } from 'react';
import EthereumHDWallet from './eth-wallet/EthereumHDWallet';
import './App.css';


class Receive extends Component {
  state = {
    acceptStatus: false,
    password: '',
  }

  claimFunds = async () => {
    let { wallet, serializedCheque } = this.props;
    let { password } = this.state;
    const acceptStatus = await wallet.acceptCheque(serializedCheque, password)
    // console.log("acceptStatus: " + acceptStatus)
    this.setState({ acceptStatus: acceptStatus === 'ok' })
  }

  render() {
    let { wallet, serializedCheque } = this.props;
    let { acceptStatus, password } = this.state;
    return (
      <div className="receive">
        <div>
          <div className="pwd">Password: </div>
          <input
            className="pwd-amt"
            type="password"
            placeholder="password"
            onChange={(e) => { this.setState({password: e.target.value}) }}>
          </input>
          <button onClick={this.claimFunds}>
            Submit password.
          </button>
        </div>
        {(acceptStatus) ? <div>Money received</div> : <div>Not started/Unsuccessful</div>}
      </div>
    );
  }
}

export default Receive;
