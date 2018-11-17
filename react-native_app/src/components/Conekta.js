import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Constants } from 'expo';
import { WebView, Alert } from 'react-native';
import {decode as atob, encode as btoa} from 'base-64'


class Conekta extends Component {
  deviceId = Constants.deviceId.replace(/-/g, '');
  conekta_key = 'key_KoqjzW5XMEVcwxdqHsCFY4Q';
  encoded_key = btoa(this.conekta_key);

  tokenizeCard = card =>
    new Promise(async (resolve, reject) => {
      console.log("ALL THE WAY HERE, ", card)
      try {
        const tokenRes = await fetch('https://api.conekta.io/tokens', {
          method: 'POST',
          body: JSON.stringify({ card }),
          headers: {
            Accept: 'application/vnd.conekta-v0.3.0+json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${`${this.encoded_key}:`}`,
            'Accept-Language': 'en', // TODO: Change this to get language from translation
            'Conekta-Client-User-Agent': JSON.stringify({
              agent: 'Conekta iOS SDK',
            }),
          },
        });
        console.log("DID FETCH");
        const token = await tokenRes.json();
        console.log("GOT MF TOKEN! ", token);
        //Alert.alert("GOT MF TOKEN", token);
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });

  render() {
    const html = `
      <html style="background: blue;">
        <head></head>
        <body>
          <script type="text/javascript" src="https://conektaapi.s3.amazonaws.com/v0.5.0/js/conekta.js" data-conekta-public-key="${this.conekta_key}" data-conekta-session-id="${
      this.deviceId
    }"></script>
        </body>
      </html>
    `;
    const { children } = this.props;
    children({ tokenizeCard: this.tokenizeCard });
    return (
      <WebView
        source={{ html, baseUrl: 'web/' }}
        style={{ height: 0, width: 0 }}
        mixedContentMode="always"
      />
    );
  }
}

Conekta.propTypes = { children: PropTypes.func.isRequired };

export default Conekta;
