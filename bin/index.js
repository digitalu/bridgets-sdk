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

    const fetchFile = fs.readFileSync('./sdk/fetchBridgeTS.ts', 'utf-8');
    fetchFile.replace(`const urlServer = '';`, `const urlServer = '${url}';`);
    fs.writeFileSync('./sdk/fetchBridgeTS.ts', fetchFile);
  })
  .catch(function (error) {
    console.log(error);
  });

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

if (!packageJSON) throw new Error('package.json not found.');

if (!packageJSON.dependencies.axios) runCommand(`echo Installing axios`) & runCommand(`npm install axios`);
if (!packageJSON.dependencies['form-data']) runCommand(`echo Installing form-data`) & runCommand(`npm install form-data`);
