"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  "use strict";

  var CeicomMusicPlayer =
  /*#__PURE__*/
  function () {
    function CeicomMusicPlayer(musics) {
      _classCallCheck(this, CeicomMusicPlayer);

      this._musics = musics;
      this._fakePlayer = $('.cmp-player');
      this._$playBtn = this._fakePlayer.find('.play-btn');
      this._$progressBar = this._fakePlayer.find('.progress-bar');
      this._$nextBtn = this._fakePlayer.find('.next-btn');
      this._$time = this._fakePlayer.find('.time');
      this._$volumeWrapper = this._fakePlayer.find('.volume-wrapper');
      this._$volumeInput = this._fakePlayer.find('.volume-input');
      this._currentMusic = 0;
      this._currentVolume = 0.1;
      this.init();
    }

    _createClass(CeicomMusicPlayer, [{
      key: "_createPlayer",
      value: function _createPlayer() {
        var music = this._musics[this._currentMusic];

        if (this._player) {
          this._$nextBtn.toggleClass('disabled', music.typemedia === 'comercial' || music.typemedia === 'vinheta');

          this._player.setAttribute('src', music.mp3);

          this._player.load();

          this._player.play();

          return;
        }

        var audio = document.createElement('audio');
        audio.src = music.mp3;
        audio.preload = 'none';
        audio.volume = this._currentVolume;
        this._player = audio;
      }
    }, {
      key: "_musicEnded",
      value: function _musicEnded() {
        var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        this._fakePlayer.removeClass('playing');

        this._resetProgressBar();

        this._currentMusic++;
        if (this._currentMusic >= this._musics.length) this._currentMusic = 0;
        $(document).trigger('cmp-media-end', [this._currentMusic, error]);

        this._makePlayer();
      }
    }, {
      key: "_initPlayerListeners",
      value: function _initPlayerListeners() {
        var _this = this;

        $(this._player).on('timeupdate', function () {
          _this._updateTime(_this._player.currentTime, _this._player.duration);

          _this._updateProgressBar(_this._player.currentTime, _this._player.duration);
        });
        $(this._player).on('play pause', function () {
          return _this._isPlaying() ? _this._fakePlayer.addClass('playing') : _this._fakePlayer.removeClass('playing');
        });
        $(this._player).on('ended', function () {
          return _this._musicEnded();
        });
        $(this._player).on('loadstart', function () {
          var playPromise = _this._player.play();

          if (playPromise !== null) playPromise["catch"](function () {
            return _this._makePlayer();
          });
        });
        $(this._player).on('error', function () {
          if (!navigator.onLine) return;

          _this._musicEnded(true);
        });
      }
    }, {
      key: "_makePlayer",
      value: function _makePlayer() {
        if (!this._musics.length) {
          $(this._fakePlayer).html('<span class="error-msg">Nenhuma música detectada na lista atual.</span>');
          return;
        }

        $(this._player).off('timeupdate');
        $(this._player).off('play pause');
        $(this._player).off('ended');
        $(this._player).off('canplaythrough');

        this._createPlayer();

        this._initPlayerListeners();
      }
    }, {
      key: "_initFakePlayerActions",
      value: function _initFakePlayerActions() {
        var _this2 = this;

        this._$playBtn.on('click', function () {
          return _this2._isPlaying() ? _this2._player.pause() : _this2._player.play();
        });

        this._$nextBtn.on('click', function () {
          if (_this2._$nextBtn.hasClass('disabled')) return;

          _this2._musicEnded();
        });

        this._$volumeWrapper.on('click', function (e) {
          if (!$(e.target).hasClass('volume-wrapper')) return;

          _this2._$volumeWrapper.toggleClass('active');
        });

        this._$volumeInput.on('input', function () {
          return _this2.setVolume(_this2._$volumeInput.val() / 10);
        });
      }
    }, {
      key: "_isPlaying",
      value: function _isPlaying() {
        return !this._player.paused;
      }
    }, {
      key: "_resetProgressBar",
      value: function _resetProgressBar() {
        this._$progressBar.css('transform', "scaleX(0)");
      }
    }, {
      key: "_updateProgressBar",
      value: function _updateProgressBar(currentTime, musicDuration) {
        this._$progressBar.css('transform', "scaleX(".concat(Math.floor(currentTime) / Math.floor(musicDuration), ")"));
      }
    }, {
      key: "_updateTime",
      value: function _updateTime(currentTime, musicDuration) {
        var extraZero = function extraZero(n) {
          return n < 10 ? '0' + n : n;
        };

        var formatedTime = function formatedTime(time) {
          var s = parseInt(time % 60);
          var m = parseInt(time / 60 % 60);
          return extraZero(m) + ':' + extraZero(s);
        };

        this._$time.text(formatedTime(currentTime) + ' / ' + formatedTime(musicDuration));
      }
    }, {
      key: "init",
      value: function init() {
        var _this3 = this;

        $(window).on('offline', function () {
          return _this3._fakePlayer.addClass('offline');
        });
        $(window).on('online', function () {
          _this3._fakePlayer.removeClass('offline');

          var playPromise = _this3._player.play();

          if (playPromise !== null) playPromise["catch"](function () {
            return _this3._makePlayer();
          });
        });

        this._initFakePlayerActions();

        this._makePlayer();
      }
    }, {
      key: "getVolume",
      value: function getVolume() {
        return this._currentVolume;
      }
    }, {
      key: "setVolume",
      value: function setVolume(value) {
        this._currentVolume = value;
        this._player.volume = this._currentVolume;

        this._$volumeInput.val(value * 10);
      }
    }]);

    return CeicomMusicPlayer;
  }();
  /**********************************/
  // commonjs


  if (typeof exports !== "undefined") exports.CeicomMusicPlayer = CeicomMusicPlayer;else window.CeicomMusicPlayer = CeicomMusicPlayer;
})(typeof global !== "undefined" ? global : void 0);
