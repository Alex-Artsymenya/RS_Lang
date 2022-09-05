import Page from "./Page";
import "../../scss/layout/_sprint.scss";
import { Card } from "../common/WordCard";
import Request from "../../services/Requests";
import SprintCard from "../common/SprintCard";
import Drawer from "../drawer/Drawer";
import GameLayout from "../common/GameLayout";
import ResultLayout from "../common/ResultLayout";
// import "./../../assets/svg/close.svg"

export interface IQuestions {
  word: string;
  variant: string;
  answer: string;
  audio: string;
}

class Sprint implements Page {
  // static indexWord: number;
  // static arrayOfQuestions: IQuestions[];

  static indexWord = 0;
  static arrayOfQuestions: IQuestions[] = [];
  static combo: number[] = [];
  static totalPoint = 0;
  static point = 10;
  static time = 60;
  static rightAnswer: IQuestions[] = [];
  static wrongAnswer: IQuestions[] = [];

  public static restore() {
    Sprint.indexWord = 0;
    Sprint.arrayOfQuestions = [];
    Sprint.combo = [];
    Sprint.totalPoint = 0;
    Sprint.point = 10;
  }

  public async render(): Promise<string> {
    // console.log(Sprint.arrayOfQuestions);
    // console.log(Sprint.indexWord);
    const levelEnglish = ["A1", "A2", "B1", "B2", "C1", "C2"];

    let buttons = "";
    const RSLangGroup = localStorage.getItem("rslang_current_group") as string;
    levelEnglish.forEach((elem, index) => {
      buttons += `
        <li>
          <a class="${
            parseInt(RSLangGroup) < 6
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
      el.onclick = () => {
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

  private timer(distance: number) {
    (<HTMLElement>document.querySelector(".timer-wrapper")).style.visibility =
      "visible";
    let r = 0;
    let g = 255;
    let b = 255;
    const colorInterval = 4.3;
    const idInterval = setInterval(async function () {
      (<HTMLElement>document.getElementById("timer__count")).innerHTML =
        distance + "s ";
      (<HTMLElement>(
        document.querySelector(".timer-wrapper")
      )).style.border = `0.2rem solid rgb(${(r += colorInterval)}, ${(g -=
        colorInterval)}, ${(b -= colorInterval)})`;
      distance -= 1;
      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(idInterval);
        (<HTMLElement>document.getElementById("timer__count")).innerHTML =
          "EXPIRED";
        const gameLayout = document.querySelector(
          ".game-layout"
        ) as HTMLElement;
        gameLayout.remove();
        Sprint.restore();
        // Drawer.drawPage(new Sprint());
        await Drawer.reDrawComponents(new ResultLayout(), "sprint-section");
        // console.log("SPRINT--> RightAnsw -->", Sprint.rightAnswer);
        // console.log("SPRINT--> WrongAnsw -->", Sprint.wrongAnswer);
      }
    }, 1000);
    localStorage.setItem("idIntervalSprint", JSON.stringify(idInterval));
    // return x;
    // let x = setInterval(function() {

    //   // Get today's date and time
    //   // var now = new Date().getTime();

    //   // Find the distance between now and the count down date
    //   var distance = 60000;

    //   // Time calculations for days, hours, minutes and seconds
    //   // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //   // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //   // Output the result in an element with id="demo"
    //   (<HTMLElement>document.getElementById("timer__count")).innerHTML = seconds + "s ";

    //   // If the count down is over, write some text
    //   if (distance < 0) {
    //     clearInterval(x);
    //     (<HTMLElement>document.getElementById("timer__count")).innerHTML = "EXPIRED";
    //   }
    // }, 1000);
  }

  public async startSprint() {
    const startBtn = document.querySelector(
      ".sprint__btn_start"
    ) as HTMLElement;
    startBtn.onclick = async () => {
      const level = this.getWordsLevel();
      await Drawer.reDrawComponents(new GameLayout(), "sprint-section");
      await this.questionsGenerator(level).then(() => {
        const loader = document.querySelector(".loader-wrapper") as HTMLElement;
        this.timer(Sprint.time);
        loader.remove();
      });
      await Drawer.reDrawComponents(
        new SprintCard(Sprint.arrayOfQuestions[Sprint.indexWord]),
        "game-layout__question_wrapper"
      );
      Sprint.indexWord += 1;
    };
  }

  public async questionsGenerator(level: string) {
    const words = await this.getWords(parseInt(level));
    const arrQuestions: IQuestions[] = [];
    words.forEach((arr) => {
      let indexRand = 0;
      let lengthRand = 0;
      arr.forEach((el, index) => {
        switch (true) {
          case index <= 4: {
            indexRand = 0;
            lengthRand = 4;
            break;
          }
          case 4 < index && index <= 8: {
            indexRand = 4;
            lengthRand = 8;
            break;
          }
          case 8 < index && index <= 12: {
            indexRand = 8;
            lengthRand = 12;
            break;
          }
          case 12 < index && index <= 16: {
            indexRand = 12;
            lengthRand = 16;
            break;
          }
          case index > 16: {
            indexRand = 16;
            lengthRand = 20;
            break;
          }
        }
        // switch (true) {
        //   case index <= 5: {
        //     indexRand = 0;
        //     lengthRand = 5;
        //     break;
        //   }
        //   case (5 < index && index <= 10): {
        //     indexRand = 5;
        //     lengthRand = 10;
        //     break;
        //   }
        //   case (10 < index && index <= 15): {
        //     indexRand = 10;
        //     lengthRand = 15;
        //     break;
        //   }
        //   case (index > 15): {
        //     indexRand = 15;
        //     lengthRand = 20;
        //     break;
        //   }
        // }
        arrQuestions.push({
          word: el.word,
          variant:
            arr[
              Math.floor(Math.random() * (lengthRand - indexRand)) + indexRand
            ].wordTranslate,
          answer: el.wordTranslate,
          audio: el.audio,
        });
      });
    });
    Sprint.arrayOfQuestions = arrQuestions;
    // console.log(arrQuestions);
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

  private getWordsLevel() {
    const activeBtn = document.querySelector(
      ".sprint__level .button"
    ) as HTMLElement;
    return activeBtn.dataset.index as string;
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
