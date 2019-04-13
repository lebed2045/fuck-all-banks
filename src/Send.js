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
    url: '',
    password: '',
  }

  createAndSendCheque() {
    return new Promise((res, rej) => {
      const url = this.props.wallet.createCheque(this.props.sendAmount, this.state.password);
      this.setState({ url: URL_PREFIX + url });
    });
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
        </div>
        
        <div className="share-buttons">
          <TelegramShareButton url={url} beforeOnClick={this.createAndSendCheque}>
            <TelegramIcon />
          </TelegramShareButton>
          <WhatsappShareButton url={url} beforeOnClick={this.createAndSendCheque}>
            <WhatsappIcon />
          </WhatsappShareButton>
          <EmailShareButton url={url} beforeOnClick={this.createAndSendCheque}>
            <EmailIcon />
          </EmailShareButton>
        </div>
      </div>
    );
  }
}

export default Send;
