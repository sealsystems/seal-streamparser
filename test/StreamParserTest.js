'use strict';

const path = require('path');

const assert = require('assertthat');
const requireAll = require('require-all');

const StreamParser = require('../lib/StreamParser');
const transitions = requireAll(path.join(__dirname, 'transitions'));

suite('StreamParser', () => {
  test('throws an error when no options are specified.', (done) => {
    assert
      .that(() => {
        /* eslint-disable no-new */
        new StreamParser();
        /* eslint-enable no-new */
      })
      .is.throwing();
    done();
  });

  test('throws an error when no transitions are specified.', (done) => {
    assert
      .that(() => {
        /* eslint-disable no-new */
        new StreamParser({});
        /* eslint-enable no-new */
      })
      .is.throwing();
    done();
  });

  test('throws and error when no startWithState is specified.', (done) => {
    assert
      .that(() => {
        /* eslint-disable no-new */
        new StreamParser({ transitions });
        /* eslint-enable no-new */
      })
      .is.throwing();
    done();
  });

  test('initially has state ready.', (done) => {
    const streamParser = new StreamParser({ transitions, startWithState: 'ready' });

    assert.that(streamParser.currentState).is.equalTo('ready');
    done();
  });

  suite('integration tests', () => {
    test('Emits printer event.', (done) => {
      const streamParser = new StreamParser({ transitions, startWithState: 'ready' });

      streamParser.once('printer', (printerName) => {
        assert.that(printerName).is.equalTo('LaserJet');
        done();
      });

      streamParser.write('\u0002LaserJ');
      streamParser.write('et\n');
    });

    test('Throws error if data after finished.', (done) => {
      const streamParser = new StreamParser({ transitions, startWithState: 'ready' });

      streamParser.once('printer', (printerName) => {
        assert.that(printerName).is.equalTo('LaserJet');
        done();
      });

      streamParser.write('\u0002LaserJ');
      streamParser.write('et\n');
      assert
        .that(() => {
          streamParser.write('too_much');
        })
        .is.throwing();
    });
  });
});
