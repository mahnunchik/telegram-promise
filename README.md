# telegram-promise [![Build Status](https://travis-ci.org/mahnunchik/telegram-promise.svg?branch=master)](https://travis-ci.org/mahnunchik/telegram-promise)

This is a simple implementation of [Telegram Bot API](https://core.telegram.org/bots/api).

#### Key features:
* ES2015
* Promise based
* Easy customizable

Supports Node.js versions greater than 4.

#### What isn't included:
* Handling updates (webhook or long polling). It is business of your application.

## Installation

```bash
$ npm install telegram-promise
```

## Usage

```js
const TelegramBotAPI = require('telegram-promise');

const api = new TelegramBotAPI(ACCESS_TOKEN);

api.getMe()
  .then(res => {
    console.log(res.result);
  })
  .catch(err => {
    console.error(err);
  });

api.sendPhoto({
  chat_id: CHAT_ID,
  photo: fs.createReadStream('cats.png'),
}).then(res => {
    console.log('Done!');
  }).catch(err => {
    console.log('Error:', err);
  });
```

## API

Module API follows the official Telegram Bot API: https://core.telegram.org/bots/api

Implemented API verion: [January 4, 2016](https://core.telegram.org/bots/api-changelog#january-4-2016)

All methods have the last parameter `options`. It can be used for request customization. See more: [node-fetch](https://www.npmjs.com/package/node-fetch#api).

## More info

* [Telegram Bot API](https://core.telegram.org/bots/api)
* [Telegram Bot API changelog](https://core.telegram.org/bots/api-changelog)
* [ECMAScript® 2015 Language Specification](http://www.ecma-international.org/ecma-262/6.0/)
* [A detailed overview of ECMAScript 6 features](https://babeljs.io/docs/learn-es2015/)
* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## License

MIT
