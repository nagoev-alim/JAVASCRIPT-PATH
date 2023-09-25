import './style.scss';
import feather from 'feather-icons';
import mock from '../src/mock';
import { addZero } from './utils/addZero.ts';

/**
 * Класс MusicPlayer - это простой музыкальный плеер.
 */
class MusicPlayer {
  private musicIndex: number = Math.floor((Math.random() * mock.length) + 1);
  private DOM: {
    cover?: HTMLImageElement,
    details?: {
      name?: HTMLParagraphElement,
      artist?: HTMLParagraphElement,
    },
    audio?: {
      main?: HTMLAudioElement,
    },
    progress?: HTMLDivElement,
    timer?: {
      time?: HTMLSpanElement,
      duration?: HTMLSpanElement,
    },
    controls?: {
      repeat?: HTMLButtonElement,
      back?: HTMLButtonElement,
      play?: HTMLButtonElement,
      forward?: HTMLButtonElement,
      list?: HTMLButtonElement,
    },
    playlist?: {
      self?: HTMLDivElement,
      close?: HTMLButtonElement,
    },
    musicList?: HTMLUListElement,
  } = {};

  /**
   * Создает экземпляр MusicPlayer.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует плеер.
   */
  initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает структуру DOM для плеера.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='player'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'></h1>
        <div class='top-line'>
          ${feather.icons['chevron-down'].toSvg()}
          <span class='h6'>Now Playing</span>
          ${feather.icons['more-horizontal'].toSvg()}
        </div>

        <div class='cover'>
          <img data-cover src='#' alt='Cover'>
        </div>

        <div class='details'>
          <p class='h5' data-name></p>
          <p data-artist></p>
        </div>

        <div class='progress' data-progress>
          <div class='progress__bar'>
            <audio data-audio src></audio>
          </div>
          <div class='timer'>
            <span data-time>0:00</span>
            <span data-duration>0:00</span>
          </div>
        </div>

        <div class='controls'>
          <button data-repeat='repeat' title='Playlist looped'>${feather.icons.repeat.toSvg()}</button>
          <button data-back>${feather.icons['skip-back'].toSvg()}</button>
          <button data-play>${feather.icons.play.toSvg()}</button>
          <button data-forward>${feather.icons['skip-forward'].toSvg()}</button>
          <button data-list>${feather.icons.list.toSvg()}</button>
        </div>

        <div class='list' data-playlist>
          <div class='header'>
            ${feather.icons.music.toSvg()}
            <span>Music list</span>
            <button data-close>${feather.icons.x.toSvg()}</button>
          </div>
          <ul data-music-list></ul>
        </div>
      </div>
    `;

    this.DOM = {
      cover: document.querySelector('[data-cover]') as HTMLImageElement,
      details: {
        name: document.querySelector('[data-name]') as HTMLParagraphElement,
        artist: document.querySelector('[data-artist]') as HTMLParagraphElement,
      },
      audio: {
        main: document.querySelector('[data-audio]') as HTMLAudioElement,
      },
      progress: document.querySelector('[data-progress]') as HTMLDivElement,
      timer: {
        time: document.querySelector('[data-time]') as HTMLSpanElement,
        duration: document.querySelector('[data-duration]') as HTMLSpanElement,
      },
      controls: {
        repeat: document.querySelector('[data-repeat]') as HTMLButtonElement,
        back: document.querySelector('[data-back]') as HTMLButtonElement,
        play: document.querySelector('[data-play]') as HTMLButtonElement,
        forward: document.querySelector('[data-forward]') as HTMLButtonElement,
        list: document.querySelector('[data-list]') as HTMLButtonElement,
      },
      playlist: {
        self: document.querySelector('[data-playlist]') as HTMLDivElement,
        close: document.querySelector('[data-close]') as HTMLButtonElement,
      },
      musicList: document.querySelector('[data-music-list]') as HTMLUListElement,
    };
  }

  /**
   * Устанавливает обработчики событий.
   */
  private setupEventListeners(): void {
    window.addEventListener('load', this.initApp.bind(this));
    this.DOM.controls.play.addEventListener('click', this.onPlayClick.bind(this));
    this.DOM.controls.forward.addEventListener('click', this.nextMusic.bind(this));
    this.DOM.controls.back.addEventListener('click', this.prevMusic.bind(this));
    this.DOM.controls.repeat.addEventListener('click', this.onRepeat.bind(this));
    this.DOM.controls.list.addEventListener('click', this.onSongsList.bind(this));
    this.DOM.playlist.close.addEventListener('click', this.onSongsList.bind(this));
    this.DOM.progress.addEventListener('click', this.onProgressClick.bind(this));
    this.DOM.audio.main.addEventListener('timeupdate', this.onMainAudio.bind(this));
    this.DOM.audio.main.addEventListener('ended', this.onMainAudioEnd.bind(this));
  }

  /**
   * Инициализирует приложение и начинает воспроизведение музыки.
   */
  private initApp() {
    this.renderMusics();
    this.loadMusic(this.musicIndex);
    this.playingSong();
  }

  /**
   * Рендерит список музыки.
   */
  private renderMusics() {
    for (const [index, value] of mock.entries()) {
      const li = document.createElement('li');
      li.setAttribute('data-index', index + 1);
      li.innerHTML = `
        <div>
          <p class='h6'>${value.name}</p>
          <p>${value.artist}</p>
        </div>
        <span data-duration='${value.src}' data-total-duration>3:36</span>
        <audio data-song='${value.src}' class='visually-hidden' src='${value.src}'></audio>
      `;
      this.DOM.musicList.append(li);
      const duration = li.querySelector('[data-duration]')!;
      const song = li.querySelector('[data-song]')!;
      song.addEventListener('loadeddata', () => {
        const durationText = `${Math.floor(song.duration / 60)}:${addZero(Math.floor(song.duration % 60))}`;
        duration.textContent = `${Math.floor(song.duration / 60)}:${addZero(Math.floor(song.duration % 60))}`;
        duration.setAttribute('data-total-duration', durationText);
      });
    }
  }

  /**
   * Загружает выбранную музыку по индексу.
   *
   * @param {number} index - Индекс музыки для загрузки.
   */
  private loadMusic(index: number): void {
    this.DOM.details.name.textContent = mock[index - 1].name;
    this.DOM.details.artist.textContent = mock[index - 1].artist;
    this.DOM.cover.src = mock[index - 1].img;
    this.DOM.audio.main.src = mock[index - 1].src;
  }

  /**
   * Обновляет отображение текущей играющей песни и устанавливает обработчики кликов.
   */
  private playingSong(): void {
    this.DOM.musicList.querySelectorAll('li').forEach((song, idx) => {
      const durationTag = song.querySelector('[data-duration]')!;
      if (song.classList.contains('playing')) {
        song.classList.remove('playing');
        durationTag.innerText = durationTag.dataset.totalDuration;
      }
      if (parseInt(song.dataset.index) === this.musicIndex) {
        song.classList.add('playing');
        durationTag.innerText = 'Playing';
      }
      song.addEventListener('click', ({ target }) => {
        this.musicIndex = parseInt(target!.dataset.index);
        this.loadMusic(this.musicIndex);
        this.playMusic();
        this.playingSong();
      });
    });
  }

  /**
   * Асинхронно начинает воспроизведение текущей музыки, обновляет интерфейс и обрабатывает ошибки воспроизведения.
   *
   * @returns {Promise<void>} Промис, который завершится после начала воспроизведения музыки.
   */
  private async playMusic(): Promise<void> {
    document.querySelector('.player')!.classList.add('paused');
    this.DOM.controls.play.innerHTML = feather.icons.pause.toSvg();
    let promise = this.DOM.audio.main.play();
    if (promise !== undefined) promise.then(_ => {
    }).catch(() => {
    });
  }

  /**
   * Обрабатывает клик на кнопке воспроизведения/паузы.
   */
  private onPlayClick(): void {
    document.querySelector('.player')!.classList.contains('paused') ? this.pauseMusic() : this.playMusic();
    this.playingSong();
  }

  /**
   * Приостанавливает воспроизведение музыки.
   */
  private pauseMusic(): void {
    document.querySelector('.player')!.classList.remove('paused');
    this.DOM.controls.play.innerHTML = feather.icons.play.toSvg();
    this.DOM.audio.main.pause();
  }

  /**
   * Переключает на следующий трек.
   */
  private nextMusic(): void {
    this.musicIndex++;
    this.musicIndex = this.musicIndex > mock.length ? 1 : this.musicIndex;
    this.loadMusic(this.musicIndex);
    this.playMusic();
    this.playingSong();
  }

  /**
   * Переключает на предыдущий трек.
   */
  private prevMusic(): void {
    this.musicIndex--;
    this.musicIndex = this.musicIndex < 1 ? mock.length : this.musicIndex;
    this.loadMusic(this.musicIndex);
    this.playMusic();
    this.playingSong();
  }

  /**
   * Обрабатывает клик на кнопке переключения режима воспроизведения.
   *
   * @param {HTMLElement} target - Целевой HTML-элемент.
   */
  private onRepeat({ target }: { target: HTMLElement }): void {
    let type = target.dataset.repeat;
    switch (type) {
      case 'repeat':
        target.innerHTML = feather.icons['rotate-cw'].toSvg();
        target.setAttribute('title', 'Song looped');
        target.setAttribute('data-repeat', 'repeat_one');
        break;
      case 'repeat_one':
        target.innerHTML = feather.icons.shuffle.toSvg();
        target.setAttribute('title', 'Playback shuffled');
        target.setAttribute('data-repeat', 'shuffle');
        break;
      case 'shuffle':
        target.innerHTML = feather.icons.repeat.toSvg();
        target.setAttribute('title', 'Playlist looped');
        target.setAttribute('data-repeat', 'repeat');
        break;
      default:
        break;
    }
  }

  /**
   * Обрабатывает клик на кнопке отображения списка песен.
   */
  private onSongsList(): void {
    this.DOM.playlist.self.classList.toggle('open');
  }

  /**
   * Обрабатывает клик на прогресс-баре для перехода к определенному моменту воспроизведения.
   *
   * @param {MouseEvent} event - Событие клика мышью.
   */
  private onProgressClick({ offsetX }: MouseEvent): void {
    this.DOM.audio.main.currentTime = (offsetX / this.DOM.progress.clientWidth) * this.DOM.audio.main.duration;
    this.playMusic();
    this.playingSong();
  }

  /**
   * Обрабатывает событие обновления времени воспроизведения музыки.
   *
   * @param {Object} target - HTML-элемент, представляющий аудио.
   */
  private onMainAudio({ target }: { target: { currentTime: number, duration: number } }): void {
    this.DOM.progress.querySelector('.progress__bar')!.style.width = `${(currentTime / duration) * 100}%`;
    this.DOM.audio.main.addEventListener('loadeddata', () => this.DOM.timer.duration.innerText = `${Math.floor(this.DOM.audio.main.duration / 60)}:${addZero(Math.floor(this.DOM.audio.main.duration % 60))}`);
    this.DOM.timer.time.innerText = `${Math.floor(currentTime / 60)}:${addZero(Math.floor(currentTime % 60))}`;
  }

  /**
   * Обрабатывает завершение воспроизведения текущей музыки.
   */
  private onMainAudioEnd(): void {
    let type = this.DOM.controls.repeat.dataset.repeat;
    switch (type) {
      case 'repeat':
        this.nextMusic();
        break;
      case 'repeat_one':
        this.DOM.audio.main.currentTime = 0;
        this.loadMusic(this.musicIndex);
        this.playMusic();
        break;
      case 'shuffle':
        let rndIdx = Math.floor((Math.random() * mock.length) + 1);
        do {
          rndIdx = Math.floor((Math.random() * mock.length) + 1);
        } while (this.musicIndex === rndIdx);
        this.musicIndex = rndIdx;
        this.loadMusic(this.musicIndex);
        this.playMusic();
        this.playingSong();
        break;
    }
  }
}

new MusicPlayer();
