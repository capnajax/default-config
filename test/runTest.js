#!/usr/bin/env node

'use strict';

import { promises as fs } from 'fs';
import path from 'path';

import Mocha from 'mocha';
const mocha = new Mocha({});

const __dirname = path.resolve();

Promise.resolve()
.then(() => {
  return fs.readdir(path.join(__dirname, 'test'));
})
.then(files => {
  files.forEach(file => {
    if (file.match(/^\d\d-/)) {
      mocha.addFile(path.join(__dirname, 'test', file));
    }
  })
  mocha.run();
});
