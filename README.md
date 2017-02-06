# seal-streamparser

[![Circle CI](https://circleci.com/gh/plossys/seal-streamparser.svg?style=svg&circle-token=1776f32c60ecfa0403ba145ddd56492e3f0e3ad4)](https://circleci.com/gh/plossys/seal-streamparser)
[![Build status](https://ci.appveyor.com/api/projects/status/138lnaf1vgqi92qw?svg=true)](https://ci.appveyor.com/project/Plossys/seal-streamparser)

seal-streamparser is a generic stream parser for Node.js.

This is module parses streams in a generic way. You can add your own transitions and emit events while the stream is parsed.

## Installation

```bash
$ npm install seal-streamparser
```

## Quick start

First you need to integrate seal-streamparser into your application.

```javascript
const StreamParser = require('seal-streamparser');
```

To use the generic stream parser you may use this code block. Put all your transition code into a directory `transitions` and require all of them with `requireAll`. Tell the stream parser which state to start with.

```javascript
const path = require('path');

const requireAll = require('require-all');
const StreamParser = require('seal-streamparser');

const transitions = requireAll(path.join(__dirname, 'transitions'));

const streamparser = new StreamParser({ transitions, startWithState: 'ready' });

streamparser.on('myEvent', (data) => {
  console.log('myEvent:', data);
  done();
});
```

In each of your transitions you have to export one function named as you like (e.g transition). Within this function you have to call the `done` function with an object that contains at least the next state and if you have handled bytes the number of handled bytes. In the case that you are in the last state you must not pass an object to the done function.

```javascript
const ready = function (data) {
  this.emit('myEvent', data);
  this.done({
    nextState: 'myNextState',
    bytesHandled: 1
  });
};

module.exports = ready;
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```bash
$ bot
```
