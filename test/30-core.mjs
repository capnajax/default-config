'use strict'

import c from '../config.js';
import chai from 'chai';

const { expect } = chai;

describe('Core functionality', function() {

  before(function(next) {
    process.env.CONFIG_ENV = 'prod';
    c._setup();
    next();
  });

  it('Values that do not require defaulting',
    function(done) {
      expect(c('animal')).to.be.equal('wildebeest');
      expect(c('plural')).to.be.equal('wildebeests');
      done();
    }
  );

  it('Values that default to config file default section',
    function(done) {
      expect(c('class')).to.be.equal('mammal');
      done();
    }
  );

  it('Values that default to default-config file',
    function(done) {
      expect(c('collective-noun')).to.be.equal('herd');
      done();
    }
  );

});
