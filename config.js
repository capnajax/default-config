'use strict';

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import _ from 'lodash';

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

  return configPath;
}

function setupEnvName() {
  let envName = null;
  for(let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--env=')) {
      envName = process.argv[i].replace(/^--env=/, '');
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

  configs = _.map(configFiles, filename => {
    let contentBuffer = fs.readFileSync(filename);
    let result = YAML.parse(contentBuffer.toString());
    return result;
  });

  envName = setupEnvName();
}

function config(path, defaultValue) {
  let envPath = null;
  let result = _.reduce(
      configs,
      (value, config) => {
        envPath = _.get(_.find(_.get(config, 'environments'), {name: envName}), `config`);
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

  return result;
}

setup();

// mainly used for testing -- provides a way to redo setup, for example to rerun
// with different environment variables
config._setup = setup;

export default config;
