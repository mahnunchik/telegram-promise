/* eslint-env mocha */
/* eslint no-new: 0 */
'use strict';

const assert = require('assert');
const TelegramBotAPI = require('../');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
const CHAT_ID = process.env.CHAT_ID || 123456;
const USER_ID = process.env.USER_ID || CHAT_ID;

describe('Telegram Bot API', function tests() {
  this.timeout(0);

  describe('constructor', () => {
    it('should throw the error when access token is not present', () => {
      assert.throws(() => {
        new TelegramBotAPI();
      });
    });

    it('should not throw the error when access token is present', () => {
      assert.doesNotThrow(() => {
        new TelegramBotAPI(ACCESS_TOKEN);
      });
    });
  });

  describe('method', () => {
    let api;

    beforeEach(() => {
      api = new TelegramBotAPI(ACCESS_TOKEN);
    });

    describe('#getMe', () => {
      it('should return basic information about the bot', done => {
        api.getMe()
          .then(res => {
            assert(res.result.id);
            assert(res.result.first_name);
            done();
            return;
          })
          .catch(done);
      });
    });

    describe('#sendMessage', () => {
      it('should send a message', done => {
        api.sendMessage({
          chat_id: CHAT_ID,
          text: 'test message',
        })
        .then(res => {
          assert(res.result.text);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendPhoto', () => {
      it('should send a photo', done => {
        api.sendPhoto({
          chat_id: CHAT_ID,
          photo: fs.createReadStream(path.join(__dirname, 'logo.png')),
        })
        .then(res => {
          assert(res.result.photo);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });

      it('should send a photo by file_id', done => {
        api.sendPhoto({
          chat_id: CHAT_ID,
          photo: fs.createReadStream(path.join(__dirname, 'logo.png')),
          caption: 'by file',
        })
        .then(res1 =>
          api.sendPhoto({
            chat_id: CHAT_ID,
            photo: res1.result.photo[0].file_id,
            caption: 'by file_id',
          })
          .then(res2 => {
            assert(res2.result.photo);
            assert(res2.result.from);
            assert(res2.result.chat);
            done();
            return;
          })
        )
        .catch(done);
      });
    });

    describe('#sendAudio', () => {
      it('should send an audio', done => {
        api.sendAudio({
          chat_id: CHAT_ID,
          audio: fs.createReadStream(path.join(__dirname, 'blackbird.mp3')),
        })
        .then(res => {
          assert(res.result.audio);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendDocument', () => {
      it('should send a document', done => {
        api.sendDocument({
          chat_id: CHAT_ID,
          document: fs.createReadStream(path.join(__dirname, 'document.txt')),
        })
        .then(res => {
          assert(res.result.document);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendSticker', () => {
      it('should send a sticker', done => {
        api.sendSticker({
          chat_id: CHAT_ID,
          sticker: fs.createReadStream(path.join(__dirname, 'sticker.webp')),
        })
        .then(res => {
          assert(res.result.sticker);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendVideo', () => {
      it('should send a video', done => {
        api.sendVideo({
          chat_id: CHAT_ID,
          video: fs.createReadStream(path.join(__dirname, 'video.mp4')),
        })
        .then(res => {
          assert(res.result.video);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendVoice', () => {
      it('should send a voice', done => {
        api.sendVoice({
          chat_id: CHAT_ID,
          voice: fs.createReadStream(path.join(__dirname, 'example.ogg')),
        })
        .then(res => {
          assert(res.result.voice);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendLocation', () => {
      it('should send a location', done => {
        api.sendLocation({
          chat_id: CHAT_ID,
          latitude: 13.75,
          longitude: 100.466667,
        })
        .then(res => {
          assert(res.result.location);
          assert(res.result.from);
          assert(res.result.chat);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#sendChatAction', () => {
      it('should notify about chat action', done => {
        api.sendChatAction({
          chat_id: CHAT_ID,
          action: 'typing',
        })
        .then(res => {
          assert(res.result);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#getUserProfilePhotos', () => {
      it('should get user photos', done => {
        api.getUserProfilePhotos({
          user_id: USER_ID,
        })
        .then(res => {
          assert(res.result.photos);
          done();
          return;
        })
        .catch(done);
      });
    });

    describe('#getFile', () => {
      it('should get file path', done => {
        api.sendPhoto({
          chat_id: CHAT_ID,
          photo: fs.createReadStream(path.join(__dirname, 'logo.png')),
        })
        .then(res1 =>
          api.getFile({
            file_id: res1.result.photo[0].file_id,
          })
          .then(res2 => {
            assert(res2.result.file_path);
            assert(res2.result.file_url);
            done();
            return;
          })
        )
        .catch(done);
      });
    });

    describe('#getUpdates', () => {
      it('should get updates', done => {
        api.getUpdates()
          .then(res => {
            assert(res.result);
            done();
            return;
          })
          .catch(done);
      });
    });

    describe('#setWebhook', () => {
      it('should set or unset webhook', done => {
        api.setWebhook()
          .then(res => {
            assert(res.result);
            done();
            return;
          })
          .catch(done);
      });
    });

    describe.skip('#answerInlineQuery', () => {
      it('should answer inline query', done => {
        done();
      });
    });
  });
});
