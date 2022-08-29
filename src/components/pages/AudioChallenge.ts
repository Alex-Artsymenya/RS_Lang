import Page from "./Page";
import '../../scss/layout/_audioChallenge.scss'
import { Request } from "../../services/Requests";
import { Card } from "../common/WordCard";

class AudioChallenge implements Page {
  private hearts: number;

  constructor(){
    this.hearts = 5;
  }

  public async render(): Promise<string> {
    const levelEnglish = [
      'A1',
      'A2',
      'B1',
      'B2',
      'C1',
      'C2',
      'User words'
    ];

    let buttons:string = '';
    const RSLangGroup = localStorage.getItem('rslang_current_group') as string;
    levelEnglish.forEach((elem, index) => {
      buttons += `
        <li>
          <a class="${
            parseInt(RSLangGroup) < 7 ? 
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

  public async changeBtn(){
    const arrBtn = Array.from(document.querySelectorAll('.test-audiochalenge a')) as Array<HTMLElement>
    arrBtn.forEach(el=>{
      el.onclick = (event:Event) => {
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

  public async startAudioChallenge(){
    const startBtn = document.querySelector('.start_audiochallenge') as HTMLElement;
    startBtn.onclick = () => {
      const elem = document.createElement('div');
      elem.classList.add('layoutForAudioChallenge');
      const img = new Image();
      img.src = './assets/svg/close.svg'
      img.classList.add('img-close-btn')
      img.onclick = () => {
        elem.remove()
      }
      elem.append(img)

      document.querySelector('#page_container')?.append(elem)
      this.startGame()

    }
  }

  public async startGame(){
    console.log('start game')
    const card = await Request.getWordById('5e9f5ee35eb9e72bc21af4a0')
    console.log(card)
    return card
  }

  public async after_render(): Promise<void> {
    this.changeBtn()
    this.startAudioChallenge();
    return;
  }
}

export default AudioChallenge;
