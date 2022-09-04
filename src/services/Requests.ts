import Utils from "./Utils";

const url = Utils.getFullURL("");

export enum Difficulty {
  LEARNED, // добавлено в изученное
  NORMAL, // Не добавлено в изученное/сложное
  HARD, // добавлено в сложное
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
  //3. Отредактировать слово в списке сложных слов
  static async editWordInUserWordsList(
    id: string,
    token: string,
    wordid: string,
    difficulty: Difficulty,
    correctInRow: number
  ) {
    const rawResponse = await fetch(`${url}/users/${id}/words/${wordid}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        difficulty: `${difficulty}`,
        optional: {
          correctInRow: `${correctInRow}`,
        },
      }),
    });
    const content = await rawResponse.json();
    return content;
  }
  //4. Получить слово из словаря сложных слов по айди
  static async getWordFromUserWordsList(
    id: string,
    token: string,
    wordid: string
  ) {
    const rawResponse = await fetch(`${url}/users/${id}/words/${wordid}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    return content;
  }
  //5.
  static async getAggregatedWordsList(options: {
    id: string;
    token: string;
    group?: number;
    page?: number;
    wordsPerPage?: number;
    filter?: string;
  }) {
    const filterGroup = options.group ? `&group=${options.group}` : "";
    const filterPage = options.page ? `&page=${options.page}` : "";
    const filterWordsPerPage = options.wordsPerPage
      ? `&wordsPerPage=${options.wordsPerPage}`
      : "";
    const filterFilter = options.filter ? `&filter=${options.filter}` : "";
    const sumFilter =
      filterGroup + filterPage + filterWordsPerPage + filterFilter;
    const finalFilter = sumFilter ? `?${sumFilter.slice(1)}` : "";
    const rawResponse = await fetch(
      `${url}/users/${options.id}/aggregatedWords${finalFilter}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${options.token}`,
        },
      }
    );
    const content = await rawResponse.json();
    return content;
  }
  static async SetWordInUsersList(
    id: string,
    token: string,
    wordid: string,
    difficulty: Difficulty
  ) {
    const rawResponse = await fetch(`${url}/users/${id}/words/${wordid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        difficulty: `${difficulty}`,
      }),
    });
    const content = await rawResponse.json();
    return content;
  }
}
export default Request;
