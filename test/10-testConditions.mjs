'use strict'

const expect = require('chai').expect;
const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');

const ALL_CONFIG_FILES = ['config.yaml', 'default-config.yaml'];
const ENTRY_POINT = 'runTest.js';

describe('Validate test run conditions', function() {

  it('Correct end point', function(done) {
    let entry = require.main.filename;
    try {
      expect(path.dirname(entry)).to.equal(__dirname);
      expect(path.basename(entry)).to.equal(ENTRY_POINT);
    } catch(e) {
      done({
        error: 'Wrong entry point',
        message: 'Run using test/runTest.js. Do not call mocha directly',
        reason: e
      });
      return;
    }
    done();
  });

  ALL_CONFIG_FILES.forEach(function(file) {
    it (`Config file ${file} exists and is parseable`, function() {
      let pathname = path.join(__dirname, file);
      return Promise.resolve()
        .then(() => {
          return fs.stat(pathname);
        })
        .then(stat => {
          expect(stat.isFile()).to.be.true;
          return fs.readFile(pathname);
        })
        .then(content => {
          expect(content).to.not.be.null;
          let parsed = yaml.parse(content.toString());
          expect(parsed).to.not.be.null;
        });
    })
  });

});



