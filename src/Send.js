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

const URL_PREFIX = 'https://lucid-bassi-46f537.netlify.com/?transfer='

class Send extends Component {
  state = {
    url: 'empty',
    password: '',
    status: '', 
    sendAmount: 0,
    showLink: false,
  }

  createAndSendCheque = async () => {
    let { wallet } = this.props;
    let { sendAmount, password } = this.state;

    try {
      const result = await wallet.createCheque(sendAmount, password);
      console.log("thing is: " + result)
      this.setState(() => ({ url: URL_PREFIX + result, showLink: true }));
    } catch(e) {
      console.log("asdasd" + e)
      this.setState({ status: e.message })
    }
  }

  render() {
    let { wallet, balance, sendAmount } = this.props;
    let { status, showLink, url} = this.state;
    return (
      <div className="send">
        <div>{'' + status}</div>
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
            Show link
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
          {showLink && <div>{url}</div>}
        </div>
      </div>
    );
  }
}

export default Send;
