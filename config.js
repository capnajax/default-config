'use strict';

const debug = require('debug')('@capnajax/default-config');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const _ = require('lodash');

let configFile;
let envName;

function setupConfigFilename() {
  let configFilename = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.arv[i].startsWith('--config=')) {
      configFilename = process.argv[i].replace(/^--config=/, '');
      break;
    }
  }

  if (!configFilename) {
    configFilename = 
        process.env.CONFIG || path.join(__dirname, '..', 'config.yaml');
  }

  return configFilename;
}

function setupEnvName() {
  let envName = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.arv[i].startsWith('--env=')) {
      result = process.argv[i].replace(/^--env=/, '');
      break;
    }
  }

  if (!envName) {
    envName = process.env.NODE_ENV || 'local';
  }

  return envName;
}

function setup() {
  let configFilename = setupConfigFilename();

  configFile = YAML.parse(fs.readFileSync(configFilename).toString());
  envName = setupEnvName();
}

function config(path, defaultValue) {
  let envPath = `${envName}.${path}`;
  let result = defaultValue;
  if(envName && _.has(configFile.environments, envPath)) {
    result = _.get(configFile.environments, envPath);
  } else if (_.has(configFile.default, path)) {
    result = _.get(configFile.default, path);
  }
  if (debug.enabled) {
    debug('config for path', JSON.stringify(path),
        '==', JSON.stringify(result));
  }
  return result;
}

setup();
module.exports = config;
