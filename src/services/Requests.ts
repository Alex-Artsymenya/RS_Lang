import Utils from "./Utils";

const url = Utils.getFullURL("");

export enum Difficulty {
  CASUAL,
  NORMAL1,
  NORMAL2,
  HARD,
}
export class Request {
  // static createUser(arg0: { name: string; email: string; password: string }) {
  //   throw new Error("Method not implemented.");
  // }
  // static loginUser(arg0: { email: string; password: string }) {
  //   throw new Error("Method not implemented.");
  // }
  // 1. Получить слова определенной группы, определенной страницы
  static async getWordsList(options: { group?: number; page?: number }) {
    const rawResponse = await fetch(
      `${url}/words?group=${options.group || 0}&page=${options.page || 0}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const content = await rawResponse.json();
    return content;
  }

  // 2. Получить конкретное слово по id
  static async getWordById(id: string) {
    const rawResponse = await fetch(`${url}/words/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const content = await rawResponse.json();
    return content;
  }
}
export default Request;
