import React, { Component } from 'react';
import './App.css';


class Receive extends Component {
  state = {
    acceptStatus: 'Not started',
    password: '',
  }

  claimFunds = async () => {
    let { wallet, serializedCheque } = this.props;
    let { password } = this.state;

    console.log("url " + serializedCheque)
    const acceptStatus = await wallet.acceptCheque(serializedCheque, password)
    this.setState({ acceptStatus })
  }

  render() {
    let { acceptStatus } = this.state;
    console.log(this.props.serializedCheque)
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
            Claim funds
          </button>
        </div>
        {(acceptStatus === 'ok') ? <div>Money received</div> : <div>{acceptStatus}</div>}
      </div>
    );
  }
}

export default Receive;
