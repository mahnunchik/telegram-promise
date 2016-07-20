'use strict';

const fetch = require('node-fetch');
const FormData = require('form-data');

class TelegramBotAPI {
  constructor(token, options) {
    if (!token) {
      throw new Error('"token" must be specified');
    }
    this.token = token;
    this.options = Object.assign({ endpoint: 'https://api.telegram.org' }, options);
  }

  endpoint(method) {
    return `${this.options.endpoint}/bot${this.token}/${method}`;
  }

  request(method, options) {
    return Promise.resolve(options)
      .then(this._prepareRequestBody)
      .then(opts => fetch(this.endpoint(method), opts))
      .then(this._checkResponseType)
      .then(response => response.json())
      .then(this._checkResponseBody);
  }

  _required(parameters, required) {
    if (!parameters) {
      throw new Error('\'parameters\' object is required.');
    }
    required.forEach(prop => {
      if (!parameters[prop]) {
        throw new Error(`'${prop}' parameter is required.`);
      }
    });
  }

  _prepareRequestBody(options) {
    const opts = Object.assign({ method: 'POST', headers: {} }, options);

    if (opts.body && opts.body.reply_markup && typeof opts.body.reply_markup !== 'string') {
      opts.body.reply_markup = JSON.stringify(opts.body.reply_markup);
    }

    if (opts.formData && !(opts.body instanceof FormData)) {
      const formData = new FormData();
      Object.keys(opts.body).forEach(field => {
        formData.append(field, opts.body[field]);
      });
      delete opts.formData;
      opts.body = formData;
      Object.assign(opts.headers, formData.getHeaders());
    } else if (opts.body && typeof opts.body !== 'string') {
      opts.body = JSON.stringify(opts.body);
      opts.headers['content-type'] = 'application/json';
    }
    return opts;
  }

  _checkResponseType(response) {
    const contentType = response.headers.get('content-type');
    if (contentType !== 'application/json') {
      throw new Error(`Telegram API wrong type of response: '${contentType}'`);
    }
    return response;
  }

  _checkResponseBody(body) {
    if (body.ok !== true) {
      if (body.description != null && body.error_code != null) {
        const err = new Error(`Telegram API: '${body.description}'`);
        err.code = body.error_code;
        throw err;
      } else {
        throw new Error(`Telegram API error: '${JSON.stringify(body)}'`);
      }
    }
    return body;
  }

  getMe(options) {
    const opts = Object.assign({ method: 'GET' }, options);
    return this.request('getMe', opts);
  }

  sendMessage(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'text']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('sendMessage', opts));
  }

  forwardMessage(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'from_chat_id', 'message_id']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('forwardMessage', opts));
  }

  sendPhoto(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'photo']);

      const opts = Object.assign({
        formData: (typeof parameters.photo !== 'string'),
      }, options, { body: parameters });

      resolve(opts);
    })
    .then(opts => this.request('sendPhoto', opts));
  }

  sendAudio(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'audio']);

      const opts = Object.assign({
        formData: (typeof parameters.audio !== 'string'),
      }, options, { body: parameters });

      resolve(opts);
    })
    .then(opts => this.request('sendAudio', opts));
  }

  sendDocument(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'document']);

      const opts = Object.assign({
        formData: (typeof parameters.document !== 'string'),
      }, options, { body: parameters });

      resolve(opts);
    })
    .then(opts => this.request('sendDocument', opts));
  }

  sendSticker(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'sticker']);

      const opts = Object.assign({
        formData: (typeof parameters.sticker !== 'string'),
      }, options, { body: parameters });

      resolve(opts);
    })
    .then(opts => this.request('sendSticker', opts));
  }

  sendVideo(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'video']);

      const opts = Object.assign({
        formData: (typeof parameters.video !== 'string'),
      }, options, { body: parameters });

      resolve(opts);
    })
    .then(opts => this.request('sendVideo', opts));
  }

  sendVoice(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'voice']);

      const opts = Object.assign({
        formData: (typeof parameters.vioce !== 'string'),
      }, options, { body: parameters });

      resolve(opts);
    })
    .then(opts => this.request('sendVoice', opts));
  }

  sendLocation(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'latitude', 'longitude']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('sendLocation', opts));
  }

  sendVenue(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'latitude', 'longitude', 'title', 'address']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('sendVenue', opts));
  }

  sendContact(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'phone_number', 'first_name']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('sendContact', opts));
  }

  sendChatAction(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'action']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('sendChatAction', opts));
  }

  getUserProfilePhotos(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['user_id']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('getUserProfilePhotos', opts));
  }

  getFile(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['file_id']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('getFile', opts))
    .then(response => {
      const url = `${this.options.endpoint}/file/bot${this.token}/${response.result.file_path}`;
      response.result.file_url = url;
      return response;
    });
  }

  kickChatMember(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'user_id']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('kickChatMember', opts));
  }

  unbanChatMember(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['chat_id', 'user_id']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('unbanChatMember', opts));
  }

  getUpdates(parameters, options) {
    const opts = Object.assign({}, options, { body: parameters });
    return this.request('getUpdates', opts);
  }

  setWebhook(parameters, options) {
    return new Promise((resolve) => {
      const opts = Object.assign({}, options, { body: parameters });
      if (parameters && parameters.certificate) {
        opts.formData = true;
      }
      resolve(opts);
    })
    .then(opts => this.request('setWebhook', opts));
  }

  /* TODO tests for callback queries */
  answerCallbackQuery(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['callback_query_id']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('answerCallbackQuery', opts));
  }

  /* TODO tests for inline queries */
  answerInlineQuery(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['inline_query_id', 'results']);

      if (typeof parameters.results !== 'string') {
        parameters.results = JSON.strigify(parameters.results);
      }
      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('answerInlineQuery', opts));
  }

  /**
   * Updating messages
   * https://core.telegram.org/bots/api#updating-messages
   */

  /**
   * https://core.telegram.org/bots/api#editmessagetext
   */

  editMessageText(parameters, options) {
    return new Promise((resolve) => {
      this._required(parameters, ['text']);

      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('editMessageText', opts));
  }

  /**
   * https://core.telegram.org/bots/api#editmessagecaption
   */

  editMessageCaption(parameters, options) {
    return new Promise((resolve) => {
      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('editMessageCaption', opts));
  }

  /**
   * https://core.telegram.org/bots/api#editmessagereplymarkup
   */

  editMessageReplyMarkup(parameters, options) {
    return new Promise((resolve) => {
      resolve(Object.assign({}, options, { body: parameters }));
    })
    .then(opts => this.request('editMessageReplyMarkup', opts));
  }

}

module.exports = TelegramBotAPI;
