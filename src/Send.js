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

const URL_PREFIX = 'localhost:3000/?transfer='

class Send extends Component {
  state = {
    url: 'empty',
    password: '',
  }

  createAndSendCheque = async () => {
    let { wallet, sendAmount } = this.props;
    const result = await wallet.createCheque(sendAmount, this.state.password);
      console.log("thing is: " + result)
      this.setState(() => ({ url: URL_PREFIX + result }));

  }

  render() {
    let { wallet, balance, sendAmount } = this.props;
    let url = this.state.url
    return (
      <div className="send">
        <div>
          <div className="send-amt">Send Amount</div>
          <input
            className="send-amt-input"
            type="number"
            onChange={(e) => { this.setState({sendAmount: e.target.value}) }}>
          </input>
        </div>
        <div>
          <div className="pwd">Password: </div>
          <input
            className="pwd-amt"
            type="password"
            placeholder="password"
            onChange={(e) => { this.setState({password: e.target.value}) }}>
          </input>
          <button onClick={this.createAndSendCheque}>
            Submit password.
          </button>
        </div>
        
        <div className="share-buttons">
          <TelegramShareButton title={'test'} url={url}>
            <TelegramIcon />
          </TelegramShareButton>
          {/*
          <WhatsappShareButton title={'Github'} url={url}>
            <WhatsappIcon />
          </WhatsappShareButton>
          */}
          <EmailShareButton title={'test'} url={url}>
            <EmailIcon />
          </EmailShareButton>
        </div>
      </div>
    );
  }
}

export default Send;
