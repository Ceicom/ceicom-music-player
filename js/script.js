(function () {
    "use strict";

    class CeicomMusicPlayer {
        constructor(musics) {
            this._musics = musics;
            this._fakePlayer = $('.cmp-player');
            this._$playBtn = this._fakePlayer.find('.play-btn');
            this._$progressBar = this._fakePlayer.find('.progress-bar');
            this._$nextBtn = this._fakePlayer.find('.next-btn');
            this._$time = this._fakePlayer.find('.time');
            this._$volumeWrapper = this._fakePlayer.find('.volume-wrapper');
            this._$volumeInput = this._fakePlayer.find('.volume-input');
            this._currentMusic = 0;
            this._currentVolume = 1;

            this.init();
        }

        _createPlayer() {
            const music = this._musics[this._currentMusic];

            if (this._player) {
                this._$nextBtn.toggleClass('disabled', music.typemedia === 'comercial' || music.typemedia === 'vinheta');
                this._player.setAttribute('src', music.mp3);
                this._player.load();
                this._player.play();
                return;
            }

            const audio = new Audio(music.mp3);
            audio.preload = 'auto';
            audio.volume = this._currentVolume;

            this._player = audio;
            this._initPlayerListeners();
        }

        _musicEnded(error = false) {
            this._fakePlayer.removeClass('playing');
            this._resetProgressBar();
            this._currentMusic++;

            if (this._currentMusic >= this._musics.length) this._currentMusic = 0;

            $(document).trigger('cmp-media-end', [this._currentMusic, error]);

            this._makePlayer();
        }

        _initPlayerListeners() {

            $(this._player).on('timeupdate', () => {
                this._updateTime(this._player.currentTime, this._player.duration);
                this._updateProgressBar(this._player.currentTime, this._player.duration);
            });

            $(this._player).on('play pause', () =>
                this._isPlaying() ?
                    this._fakePlayer.addClass('playing') :
                    this._fakePlayer.removeClass('playing'));

            $(this._player).on('ended', () => this._musicEnded());

            $(this._player).on('canplay', () => {
                const playPromise = this._player.play();
                if (playPromise !== null) playPromise.catch(() => this._makePlayer());
            });

            $(this._player).on('error', () => {
                if (!navigator.onLine) return;
                this._musicEnded(true);
            });
        }

        _makePlayer() {
            if (!this._musics.length) {
                $(this._fakePlayer).html('<span class="error-msg">Nenhuma música detectada na lista atual.</span>');
                return;
            }

            this._createPlayer();
        }

        _initFakePlayerActions() {
            this._$playBtn.on('click', () => this._isPlaying() ? this._player.pause() : this._player.play());

            this._$nextBtn.on('click', () => {
                if (this._$nextBtn.hasClass('disabled')) return;
                this._musicEnded();
            });

            this._$volumeWrapper.on('click', e => {
                if (!$(e.target).hasClass('volume-wrapper')) return;
                this._$volumeWrapper.toggleClass('active');
            });

            this._$volumeInput.on('input', () => this.setVolume(this._$volumeInput.val() / 10));
        }

        _isPlaying() {
            return !this._player.paused;
        }

        _resetProgressBar() {
            this._$progressBar.css('transform', `scaleX(0)`);
        }

        _updateProgressBar(currentTime, musicDuration) {
            this._$progressBar.css('transform', `scaleX(${Math.floor(currentTime) / Math.floor(musicDuration)})`);
        }

        _updateTime(currentTime, musicDuration) {

            const extraZero = n => n < 10 ? '0' + n : n;

            const formatedTime = time => {
                const s = parseInt(time % 60);
                const m = parseInt((time / 60) % 60);

                return extraZero(m) + ':' + extraZero(s);
            }

            this._$time.text(formatedTime(currentTime) + ' / ' + formatedTime(musicDuration));
        }

        init() {

            $(window).on('offline', () => this._fakePlayer.addClass('offline'));

            $(window).on('online', () => {
                this._fakePlayer.removeClass('offline');

                const playPromise = this._player.play();
                if (playPromise !== null) playPromise.catch(() => this._makePlayer());
            });

            this._initFakePlayerActions();
            this._makePlayer();
        }

        getVolume() {
            return this._currentVolume;
        }

        setVolume(value) {
            this._currentVolume = value;
            this._player.volume = this._currentVolume;
            this._$volumeInput.val(value * 10);
        }

        destroy() {
            this._player.currentTime = 0;
            this._player.pause();

            // window events
            $(window).off('offline');
            $(window).off('online');

            // player events
            $(this._player).off('timeupdate');
            $(this._player).off('play pause');
            $(this._player).off('ended');
            $(this._player).off('canplay');
            $(this._player).off('error');

            // ui player buttons events
            this._$playBtn.off('click');
            this._$nextBtn.off('click');
            this._$volumeWrapper.off('click');
            this._$volumeInput.off('input');

            delete this._player;
            delete this._musics;
        }
    }

    /**********************************/

    // commonjs
    if (typeof exports !== "undefined")
        exports.CeicomMusicPlayer = CeicomMusicPlayer;
    else
        window.CeicomMusicPlayer = CeicomMusicPlayer;

}(typeof global !== "undefined" ? global : this));