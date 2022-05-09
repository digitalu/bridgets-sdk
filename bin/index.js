#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
const axios = require('axios');
const AdmZip = require('adm-zip');

console.log('url: ', argv._[0]);

const url = `${argv._[0].replace(/\/$/, '')}/fetchBridgeSDK`;
const directory = './sdk';

const config = {
  method: 'get',
  url,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'arraybuffer',
};

axios(config)
  .then(function (response) {
    const zipFolder = new AdmZip(response.data);
    zipFolder.extractAllTo(directory, true);
  })
  .catch(function (error) {
    console.log(error);
  });
