import Page from "./Page";
import '../../scss/layout/_audioChallenge.scss'
import { Request } from "../../services/Requests";
import { Card } from "../common/WordCard";
import { CardInfo } from "../common/interfaceList";
import Utils from "../../services/Utils";

class AudioChallenge implements Page {
  private hearts: number;
  private stateCard: CardInfo[];
  private stateCheck: number[];
  private stateResult: CardInfo[];
  private counter: number;
  private timer: number;

  constructor() {
    this.timer = 0;
    this.counter = 0;
    this.hearts = 5;
    this.stateCard = [];
    this.stateCheck = [];
    this.stateResult = []
  }

  public async render(): Promise<string> {
    const levelEnglish = [
      'A1',
      'A2',
      'B1',
      'B2',
      'C1',
      'C2',
    ];

    let buttons: string = '';
    const RSLangGroup = localStorage.getItem('rslang_current_group') as string;
    levelEnglish.forEach((elem, index) => {
      buttons += `
        <li>
          <a class="${parseInt(RSLangGroup) < 6 ?
          index === parseInt(RSLangGroup) ?
            'button' :
            'button_grey' :
          index === 0 ?
            'button' :
            'button_grey'
        }" data-index="${index}" >${elem}</a>
        </li>
      `;
    })

    const view = `
      <section class="section-audiochallenge">
          <h1>Audio Challenge</h1>
      <div class="block_audiochallenge">
        <h3> Listen to the word, then choose the correct option. </h3>
        <a class="start_audiochallenge">
          <img src="./assets/svg/sound-system.svg" alt="audio logo">
          <h4> START GAME </h4>
        </a>
      </div>
      <div class="test-audiochalenge">
      <p> You can change your level </p>
        <ul>
          ${buttons}
        </ul>
      </div>
    </section>
    `;
    return view;
  }

  public async changeBtn() {
    const arrBtn = Array.from(document.querySelectorAll('.test-audiochalenge a')) as Array<HTMLElement>
    arrBtn.forEach(el => {
      el.onclick = (event: Event) => {
        arrBtn.forEach(item => {
          item.classList.add('button_grey');
          item.classList.remove('button')
        })
        localStorage.setItem('rslang_current_group', el.dataset.index as string)
        el.classList.remove('button_grey');
        el.classList.add('button')
      }
    })
  }

  public async startAudioChallenge() {
    const startBtn = document.querySelector('.start_audiochallenge') as HTMLElement;
    startBtn.onclick = () => {
      const elem = document.createElement('div');
      elem.classList.add('layoutForAudioChallenge');
      const img = new Image();
      img.src = './assets/svg/close.svg'
      img.classList.add('img-close-btn')
      img.onclick = () => {
        elem.remove();
        clearTimeout(this.timer)
      }
      elem.append(img)
      const activeBtn = document.querySelector('.test-audiochalenge .button') as HTMLElement;
      document.querySelector('#page_container')?.append(elem)
      this.CreateStateCard(parseInt(activeBtn.dataset.index as string))
    }
  }

  veiwRigthChoose() {
    const sound = document.querySelector('.logo-sound_audio-chellenge') as HTMLElement;
    const arrTextCards = document.querySelectorAll('.text_audio-chellenge') as NodeListOf<Element>
    arrTextCards.forEach(el => {
      if((el as HTMLElement).dataset.infoID === sound.dataset.infoID){
        el.classList.add('right_audio-chellenge')
      } else {
        el.classList.add('false_audio-chellenge')
      }
    })
    setTimeout(() => {
      arrTextCards.forEach(el => {
        el.classList.remove('right_audio-chellenge')
        el.classList.remove('false_audio-chellenge')
      })
      this.addLogicForGame()
    }, 1000);
  }

  public async CreateStateCard(num: number) {
    this.clearState();
    for (let i = 0; i < 30; i++) {
      const arrayCards = await Request.getWordsList({ group: num, page: i });
      this.stateCard.push(...arrayCards);
    }
    this.createViewAudioChallenge();
    this.shuffleArr(this.stateCard);
    this.addLogicForGame()

  }

  public startTimer(num: number = 5) {
    const timer = setTimeout(() => {
      // clearTimeout(timer)
      this.minusHeart()
      this.counter += 1;
      this.veiwRigthChoose()
    }, num * 1000);
    if(typeof timer === 'number'){this.timer = timer};
    return {stopTimer(){clearTimeout(timer)}}
  }

  public addLogicForGame() {
    this.stateCheck = [this.counter];
    if(this.timer){clearTimeout(this.timer)}
    const timer = this.startTimer(5)
    console.log(timer)
    const sound = document.querySelector('.logo-sound_audio-chellenge') as HTMLElement;
    const arrTextCards = document.querySelectorAll('.text_audio-chellenge') as NodeListOf<Element>
    sound.dataset.infoID = this.stateCard[this.counter].id;
    this.createAudioFile(this.stateCard[this.counter]).startPlay()
    sound.onclick = () => {
      this.createAudioFile(this.stateCard[this.counter]).audio.play()
    }
    while (this.stateCheck.length < 4) {
      const randomNumber = Utils.getRndInteger(0, 599);
      if (!this.stateCheck.includes(randomNumber)) {
        this.stateCheck.push(randomNumber)
      }
    }
    this.shuffleArr(this.stateCheck)
    this.stateCheck.forEach((el, index) => {
      arrTextCards[index].innerHTML = this.stateCard[el].wordTranslate;
      (arrTextCards[index] as HTMLElement).dataset.infoID = this.stateCard[el].id;
      (arrTextCards[index] as HTMLElement).onclick = (event: Event) => {
        const elem = event.target as HTMLElement;
        console.log('compare', elem.dataset.infoID === sound.dataset.infoID)
        if (elem.dataset.infoID === sound.dataset.infoID) {
          elem.classList.add('right_audio-chellenge')
        } else {
          elem.classList.add('false_audio-chellenge')
          const position = this.stateCheck.indexOf(this.counter)
          arrTextCards[position].classList.add('right_audio-chellenge')
          this.minusHeart()
        }
        timer.stopTimer();
        setTimeout(() => {
          arrTextCards.forEach(el => {
            el.classList.remove('right_audio-chellenge')
            el.classList.remove('false_audio-chellenge')
          })
          this.addLogicForGame()
        }, 1000);
        this.counter += 1;
      }
    })
  }

  public createViewAudioChallenge() {
    const element = document.querySelector('.layoutForAudioChallenge') as HTMLElement
    const blockForGame = document.createElement('div');
    blockForGame.classList.add('block-for-game');
    blockForGame.innerHTML += `
    <a class="logo-sound_audio-chellenge"><img src="./assets/svg/volume.svg" alt="logo sound"></a>
    <div class="minor-block_audio-chellenge">
      <a class="text_audio-chellenge"></a>
      <a class="text_audio-chellenge"></a>
      <a class="text_audio-chellenge"></a>
      <a class="text_audio-chellenge"></a>
    </div>
    `
    element.append(blockForGame)
    this.renderHeart()
  }

  public minusHeart() {
    this.hearts -= 1;
    document.querySelector('.heart_audio-chellenge')?.remove();
    this.renderHeart();
  }

  public renderHeart(num:number = 5) {
    const element = document.querySelector('.layoutForAudioChallenge') as HTMLElement
    const div = document.createElement('div');
    div.classList.add('heart_audio-chellenge');
    let counter = 0;
    while(counter < num){
      const img = new Image();
      if(this.hearts > counter){
        img.src = './assets/svg/heart_full.svg'
      } else {
        img.src = './assets/svg/heart.svg'
      }
      div.append(img);
      counter += 1;
    }
   element.append(div);
  }

  public createAudioFile(element: CardInfo) {
    let audio = document.createElement('audio');
    audio.src = Utils.getFullURL('/') + element.audio;
    audio.onload = () => { audio.play() }
    return { audio: audio, startPlay() { audio.play() } };
  }

  private clearState(): void {
    this.stateCard = [];
    this.stateCheck = [];
    this.stateResult = [];
  }

  private shuffleArr(array: unknown[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  public async after_render(): Promise<void> {
    this.changeBtn()
    this.startAudioChallenge();
    return;
  }
}

export default AudioChallenge;
