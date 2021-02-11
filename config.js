'use strict';

import debugModule from '@capnajax/debug';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import _ from 'lodash';

const debug = debugModule('@capnajax/default-config');

let configFile;
let defaultConfigFile;
let envName;

function setupConfigFilenames() {
  let configFilename = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--config=')) {
      configFilename = process.argv[i].replace(/^--config=/, '');
      break;
    }
  }

  let entryPointDir = (file) => {
    let pathname = path.join(process.env.PWD, file);
    return fs.existsSync(pathname) ? pathname : null;
  };

  if (!configFilename) {
    configFilename = 
        process.env.CONFIG || 
        (process.env.NODE_ENV && entryPointDir(`process-${process.env.NODE_ENV}.yaml`)) ||
        entryPointDir('config.yaml');
  }

  return {configFilename, defaultConfigFilename: entryPointDir('default-config.yaml')};
}

function setupEnvName() {
  let envName = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--env=')) {
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
  let configs = setupConfigFilenames();
  let defaultConfigExists = fs.existsSync(configs.defaultConfigFilename);
  let parse = filename => {
    return YAML.parse(fs.readFileSync(filename).toString());
  }

  configFile = parse(configs.configFilename);

  defaultConfigFile = defaultConfigExists
    ? parse(configs.defaultConfigFilename)
    : {};

  envName = setupEnvName();

  debug('[setup] results:')
  debug({envName, configFile, defaultConfigFile});
}

function config(path, defaultValue) {
  let envPath = null;
  let result = defaultValue;
  if (envName) {
    envPath = _.get(_.find(configFile.environments, {name: envName}), `config`);
  }
  if(envPath && _.has(envPath, path)) {
    result = _.get(envPath, path);
  } else if (_.has(configFile.default, path)) {
    result = _.get(configFile.default, path);
  } else if (defaultConfigFile && _.has(defaultConfigFile.default, path)) {
    result = _.get(defaultConfigFile.default, path);
  }
  if (debug.enabled) {
    debug('[config] config for path', JSON.stringify(path),
        '==', JSON.stringify(result));
  }
  return result;
}

setup();

// mainly used for testing -- provides a way to redo setup, for example to rerun
// with different environment variables
config._setup = setup;

export default config;
