#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');

const Mocha = require('mocha');
const mocha = new Mocha({});

Promise.resolve()
.then(() => {
  return fs.readdir(__dirname);
})
.then(files => {
  files.forEach(file => {
    if (file.match(/^\d\d-/)) {
      mocha.addFile(path.join(__dirname, file));
    }
  })
  mocha.run();
});
