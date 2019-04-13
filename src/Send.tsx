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


class Send extends Component {
  createSendURL() {
    const url = '';
    this.setState({ url });
  }

  async createAndSendCheque(amt: number, password?: string) {
    // await status = createCheque(amt, password);
    // return status;
  }

  render() {
    let { wallet, balance, sendAmount, url } = this.state;
    return (
      <div className="send">
        <div>Send Amount</div>
        <input
          type="number"
          onChange={(e) => {
            this.setState({sendAmount: e.target.value})
            this.createSendURL();
          }}>
        </input>
        <input
          type="string"
          placeholder="password"
          onChange={(e) => {
            this.setState({password: e.target.value});
            this.createSendURL();
          }}>
        </input>
        <div className="share-buttons">
          <TelegramShareButton url={url}>
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
    );
  }
}

export default Send;
