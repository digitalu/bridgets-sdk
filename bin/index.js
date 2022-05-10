#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');

const runCommand = (command) => {
  try {
    require('child_process').execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

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

if (fs.existsSync('./sdk')) fs.rmSync('./sdk', { recursive: true });

axios(config)
  .then(function (response) {
    const zipFolder = new AdmZip(response.data);
    zipFolder.extractAllTo(directory, true);
  })
  .catch(function (error) {
    console.log(error);
  });

// runCommand(`echo Installing axios...\n`);

// runCommand(`npm install axios`);
