import Page from "./Page";
import "../../scss/layout/_sprint.scss";
import { Card } from "../common/WordCard";
import Request from "../../services/Requests";
import SprintCard from "../common/SprintCard";
import Drawer from "../drawer/Drawer";
import GameLayout from "../common/GameLayout";
// import "./../../assets/svg/close.svg"

interface IQuestions {
  word: string;
  variant: string;
  answer: string;
}

class Sprint implements Page {
  // static indexWord: number;
  // static arrayOfQuestions: IQuestions[];

  constructor() {

  }
  static indexWord: number = 0;
  static arrayOfQuestions: IQuestions[] = [];
  static combo: Number[] = [];
  static totalPoint = 0;
  static point = 10;

  public static restore() {
    Sprint.indexWord = 0;
    Sprint.arrayOfQuestions = [];
    Sprint.combo = [];
    Sprint.totalPoint = 0;
    Sprint.point = 10;
  }

  public async render(): Promise<string> {
    console.log(Sprint.arrayOfQuestions);
    console.log(Sprint.indexWord);
    const levelEnglish = ["A1", "A2", "B1", "B2", "C1", "C2"];

    let buttons = "";
    const RSLangGroup = localStorage.getItem("rslang_current_group") as string;
    levelEnglish.forEach((elem, index) => {
      buttons += `
        <li>
          <a class="${
            parseInt(RSLangGroup) < 7
              ? index === parseInt(RSLangGroup)
                ? "button"
                : "button_grey"
              : index === 0
              ? "button"
              : "button_grey"
          }" data-index="${index}" >${elem}</a>
        </li>
      `;
    });

    const view = `
      <section class="sprint" id="sprint-section">
          <h1>Sprint</h1>
      <div class="sprint__block">
        <h3>Choose answer</h3>
      </div>
      <div class="sprint__level">
      <p> You can change your level </p>
        <ul>
          ${buttons}
        </ul>
      </div>
      <a class="sprint__btn_start">
      <h4> START GAME </h4>
    </a>
    </section>
    `;
    return view;
  }

  public async changeBtn() {
    const arrBtn = Array.from(
      document.querySelectorAll(".sprint__level a")
    ) as Array<HTMLElement>;
    arrBtn.forEach((el) => {
      el.onclick = (event: Event) => {
        arrBtn.forEach((item) => {
          item.classList.add("button_grey");
          item.classList.remove("button");
        });
        localStorage.setItem(
          "rslang_current_group",
          el.dataset.index as string
        );
        el.classList.remove("button_grey");
        el.classList.add("button");
      };
    });
  }
  public async startSprint() {
    const startBtn = document.querySelector(
      ".sprint__btn_start"
    ) as HTMLElement;
    startBtn.onclick = async () => {
      await this.questionsGenerator();
      await Drawer.reDrawComponents(new GameLayout(), "sprint-section");
      await Drawer.reDrawComponents(new SprintCard(Sprint.arrayOfQuestions[Sprint.indexWord]), "game-layout__question_wrapper");
      Sprint.indexWord += 1;
    };
  }


  public async questionsGenerator() {
    const activeBtn = document.querySelector(
      ".sprint__level .button"
    ) as HTMLElement;
    const words = await this.getWords(
      parseInt(activeBtn.dataset.index as string)
    );
    const arrQuestions: IQuestions[] = [];
    words.forEach((arr) => {
      let indexRand = 0;
      let lengthRand = 0;
      arr.forEach((el, index) => {
        switch (true) {
          case index <= 5: {
            indexRand = 0;
            lengthRand = 5;
            break;
          }
          case (5 < index && index <= 10): {
            indexRand = 5;
            lengthRand = 10;
            break;
          }
          case (10 < index && index <= 15): {
            indexRand = 10;
            lengthRand = 15;
            break;
          }
          case (index > 15): {
            indexRand = 15;
            lengthRand = 20;
            break;
          }
        }
        arrQuestions.push({
          word: el.word,
          variant:
            arr[Math.floor(Math.random() * (lengthRand - indexRand)) + indexRand]
            .wordTranslate,
          answer: el.wordTranslate,
        });
      });
    });
    Sprint.arrayOfQuestions = arrQuestions;
    console.log(arrQuestions);
  }


  public async startAudioChallenge() {
    const startBtn = document.querySelector(
      ".sprint__btn_start"
    ) as HTMLElement;
    startBtn.onclick = async () => {
      const elem = document.createElement("div");
      elem.classList.add("layoutForAudioChallenge");
      const img = new Image();
      img.src = "./../../assets/svg/close.svg";
      img.classList.add("img-close-btn");
      img.onclick = () => {
        elem.remove();
      };
      elem.append(img);
      const activeBtn = document.querySelector(
        ".sprint__level .button"
      ) as HTMLElement;
      document.querySelector("#page_container")?.append(elem);
      const words = await this.getWords(
        parseInt(activeBtn.dataset.index as string)
      );
      const arrQuestions: IQuestions[] = [];
      words.forEach((arr) => {
        arr.forEach((el, index) => {
          arrQuestions.push({
            word: el.word,
            variant:
              words[0][Math.floor(Math.random() * (arr.length - index)) + index]
                .wordTranslate,
            answer: el.wordTranslate,
          });
        });
      });
      console.log(arrQuestions);
      let result = "";
      Promise.all(
        arrQuestions.map(async (el) => {
          const element = Drawer.drawComponent(SprintCard, el);
          return element;
        })
      ).then((value) => {
        result += value;
        // console.log('result', result);
        elem.innerHTML += result;
      });
    };
  }

  public async getWords(level: number) {
    // console.log("start game", level);
    const card: Card[][] = [];
    for (let i = 0; i < 30; i++) {
      card.push(await Request.getWordsList({ group: level, page: i }));
    }
    // console.log('with flat', card.flat())
    // console.log(localStorage);
    // console.log(card.flat())
    return card;
  }

  public async after_render(): Promise<void> {
    // console.log("after render --> Sprint");
    this.changeBtn();
    // this.startAudioChallenge();
    await this.startSprint();
    // const wrapper = document.querySelector('.sprint__questions_btn-wrapper');
    // const btnArr = wrapper?.querySelectorAll('sprint__btn_answer') as NodeListOf<HTMLButtonElement>;
    // btnArr.forEach((btn) => {
    //   console.log('btn -->', btn);
    //   btn.addEventListener('click', async () => await this.checkQuestion(btn));
    // })
    return;
  }
}

export default Sprint;
