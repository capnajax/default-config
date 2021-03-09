'use strict';

import debugModule from '@capnajax/debug';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import _ from 'lodash';

const debug = debugModule('@capnajax/default-config');

let configs;
let envName;

function setupConfigPath() {
  let configPath = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--config=')) {
      configPath = process.argv[i].replace(/^--config=/, '');
      break;
    }
  }

  let entryPointDir = (file) => {
    let pathname = path.join(process.env.PWD, file);
    return fs.existsSync(pathname) ? pathname : null;
  };

  if (!configPath) {
    configPath = 
        process.env.CONFIG_PATH || 
        (process.env.CONFIG_ENV && entryPointDir(`config-${process.env.CONFIG_ENV}.yaml`)) ||
        (process.env.NODE_ENV && entryPointDir(`config-${process.env.NODE_ENV}.yaml`)) ||
        entryPointDir('config.yaml');
  }

  debug('[setupConfigPath] configPath ==', configPath);

  return configPath;
}

function setupEnvName() {
  let envName = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--env=')) {
      result = process.argv[i].replace(/^--env=/, '');
      break;
    }
  }

  if (!envName && _.has(process.env, 'CONFIG_ENV')) {
    envName = process.env.CONFIG_ENV || 'local';
  }

  if (!envName) {
    envName = process.env.NODE_ENV || 'local';
  }

  return envName;
}

function setup() {
  let configFiles = setupConfigPath().split(path.delimiter);

  debug('[setup] configFiles ==', configFiles);

  configs = _.map(configFiles, filename => {
    let contentBuffer = fs.readFileSync(filename);
    let result = YAML.parse(contentBuffer.toString());
    return result;
  })

  envName = setupEnvName();

  debug('[setup] results:')
  debug({envName, configs});
}

function config(path, defaultValue) {
  debug('[config] called on path, defaultValue ==', path, defaultValue);
  let envPath = null;
  let result = _.reduce(
      configs,
      (value, config) => {
        debug('[config] {path, envName, value, config}:');
        debug({path, envName, value, config});
        envPath = _.get(_.find(_.get(config, 'environments'), {name: envName}), `config`);
        debug('[config] envPath == ', envPath);
        if (envPath && _.has(envPath, path)) {
          return _.get(envPath, path);
        } else if(_.has(config.default, path)) {
          return _.get(config.default, path);
        } else {
          // value not found, keep previous value
          return value;
        }
      },
      defaultValue
    );

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
