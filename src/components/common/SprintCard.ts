import Component from "./Component";
import Utils from "../../services/Utils";
import Drawer from "../drawer/Drawer";
import Button from "./Button";
import Sprint from "../pages/Sprint";

export interface Card {
  word: string;
  translation: string;
  transcription: string;
  audio: string;
  image: string;
  meaning_english: string;
  example_english: string;
  meaning_russian: string;
  example_russian: string;
}

class SprintCard implements Component {
  private word: string;
  private variant: string;
  private answer: string;
  private result: boolean;

  public constructor(options: {
    word: string;
    variant: string;
    answer: string;
  }) {
    this.word = options.word;
    this.variant = options.variant;
    this.answer = options.answer;
    this.result = this.variant === this.answer ? true : false;
  }

  public async render(): Promise<string> {
    const btnTrue = await Drawer.drawComponent(Button, {
      id: "btnTrue",
      class: "sprint__btn_answer",
      text: `True`,
    });
    const btnFalse = await Drawer.drawComponent(Button, {
      id: "btnFalse",
      class: "sprint__btn_answer",
      text: `False`,
    });
    const view = `
      <div class="sprint__questions">
        <p>Total point - ${Sprint.totalPoint}</p>
        <div class="sprint__questions_rounds">
          <div class="sprint__questions_round"></div>
          <div class="sprint__questions_round"></div>
          <div class="sprint__questions_round"></div>
        </div>
        <p id="sprint-point">+${Sprint.point} per word</p>
        <h4 class="sprint__questions_quest">${this.word}</h4>
        <h5 class="sprint__questions_answ">${this.variant}</h5>
      </div>
      <div class="sprint__questions_btn-wrapper">
        ${btnTrue}
        ${btnFalse}
      </div>
    `;
    // console.log("render --> SprintCard");
    return view;
  }

  public async newQuestion() {
    setTimeout(async () => {
      await Drawer.reDrawComponents(new SprintCard(Sprint.arrayOfQuestions[Sprint.indexWord]), "game-layout__question_wrapper");
      Sprint.indexWord += 1;
    }, 250);
  }

  public async checkCombo() {
    const combo = document.querySelector('.sprint__questions_rounds');
    const arrCombo = (<HTMLElement>combo).querySelectorAll('.sprint__questions_round') as NodeListOf<HTMLElement>;
    if (Sprint.combo.length >= 4) {
      Sprint.combo = [];
      Sprint.point = Sprint.point * 2;
    };
    (<HTMLElement>document.getElementById('sprint-point')).textContent = `+${Sprint.point} per word`;
    Sprint.combo.forEach((el, index) => {
      arrCombo[index].style.backgroundColor = 'green';
    })
    // switch (true) {
    //   case Sprint.combo.length === 1: {
    //     arrCombo[0].style.backgroundColor = 'green';
    //     break;
    //   }
    //   case Sprint.combo.length === 2: {
    //     arrCombo[0].style.backgroundColor = 'green';
    //     break;
    //   }
    // }
  }

  public async checkQuestion(ev: HTMLElement) {
    switch (true) {
      case (this.result && ev.id === 'btnTrue'): {
        ev.classList.add('correct');
        Sprint.rightAnswer.push({
          word: this.word,
          variant: this.variant,
          answer: this.answer
        });
        await this.newQuestion();
        Sprint.combo.push(1);
        Sprint.totalPoint += Sprint.point;
        // await this.checkCombo();
        break;
      }
      case (!this.result && ev.id === 'btnFalse'): {
        ev.classList.add('correct');
        Sprint.rightAnswer.push({
          word: this.word,
          variant: this.variant,
          answer: this.answer
        });
        await this.newQuestion();
        Sprint.combo.push(1);
        Sprint.totalPoint += Sprint.point;
        // await this.checkCombo();
        break;
      }
    
      default: {
        ev.classList.add('wrong');
        Sprint.wrongAnswer.push({
          word: this.word,
          variant: this.variant,
          answer: this.answer
        });
        await this.newQuestion();
        Sprint.combo = [];
        Sprint.point = 10;
        break;
      }
    }
  }

  public async after_render(): Promise<void> {
    const wrapper = document.querySelector(".sprint__questions_btn-wrapper");
    const btnArr = (<HTMLElement>wrapper).querySelectorAll(
      "button"
    ) as NodeListOf<HTMLElement>;
    btnArr.forEach((btn) => {
      // btn.classList.add('wrong');
      btn.addEventListener("click", async () => this.checkQuestion(btn));
    });
    this.checkCombo();
  }
}

export default SprintCard;
