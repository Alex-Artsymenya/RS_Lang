import Component from "./Component";
import "../../scss/components/_button.scss";
import Sprint, { IQuestions } from "../pages/Sprint";
import Drawer from "../drawer/Drawer";
import Utils from "../../services/Utils";

class ResultLayout implements Component {
  //   private class: string;
  //   private id: string;
  //   private text: string;

  //   public constructor(options: { class: string; id: string; text: string }) {
  //     this.class = options.class;
  //     this.id = options.id;
  //     this.text = options.text;
  //   }

  public createAudioFile(element: IQuestions) {
    const audio = document.createElement("audio");
    audio.src = Utils.getFullURL("/") + element.audio;
    audio.onload = () => {
      audio.play();
    };
    return {
      audio: audio,
      startPlay() {
        audio.play();
      },
    };
  }

  public async render(): Promise<string> {
    const audio = (question: IQuestions) => `
      <a class="link-to-sound_result">
        <img src="./assets/svg/volume-up.svg">
        <audio src="${Utils.getFullURL("/") + question.audio}">
      </a>
      `;

    const wrongAnswer = (question: IQuestions) => `
        <div class="result-layout__wrong-word">
          <p>${audio(question)} ${question.word} <span class="result-layout__word">- ${question.answer}</span></p>
        </div>
    `;
    let wrongAnswers = "";
    Sprint.wrongAnswer.forEach((el) => {
      wrongAnswers += wrongAnswer(el);
    });
    const correctAnswer = (question: IQuestions) => `
      <div class="result-layout__correct-word">
        <p class="result-layout__word-total">${audio(question)} ${question.word} <span class="result-layout__word">- ${question.answer}</span></p>
      </div>
    `;
    let correctAnswers = "";
    Sprint.rightAnswer.forEach((el) => {
      correctAnswers += correctAnswer(el);
    });
    const view = `
        <div class="result-layout" id="result-layout">
            <img src="./../../assets/svg/close.svg" class="img-close-btn">
            <div class="result-layout__wrapper">
              <p class="result-layout__title">Total wrong answer - <span class="result-layout__title_wrong">${Sprint.wrongAnswer.length}</span></p>
              <div class="result-layout__wrong">
                ${wrongAnswers}
              </div>
              <hr>
              <p class="result-layout__title">Total right answer - <span class="result-layout__title_correct">${Sprint.rightAnswer.length}</span></p>
              <div class="result-layout__correct">
                ${correctAnswers}
              </div>
            </div>
        </div>
    `;
    return view;
  }

  public async after_render(): Promise<void> {
    const img = document.querySelector(".img-close-btn") as HTMLElement;
    const gameLayout = document.querySelector(".result-layout") as HTMLElement;
    const linksAudio = gameLayout.querySelectorAll('.link-to-sound_result') as NodeListOf<HTMLElement>;
    linksAudio.forEach((element) => {
      element.onclick = function() {
        (<HTMLElement>this).querySelector('audio')?.play()}; 
    });
    img.onclick = () => {
      gameLayout.remove();
      Sprint.restore();
      Sprint.rightAnswer = [];
      Sprint.wrongAnswer = [];
      // clearInterval(localStorage.getItem('idIntervalSprint') ? localStorage.idIntervalSprint: null);
      Drawer.drawPage(new Sprint());
    };
    return;
  }
}

export default ResultLayout;
