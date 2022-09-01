import { Request } from "../components/router/Router";
const url = "https://react-learnwords-example.herokuapp.com";

const Utils = {
  parseRequestURL: () => {
    const url = window.location.hash.slice(1).toLowerCase() || "/";
    const r = url.split("/");
    const request: Request = {
      resource: r[1],
      id: r[2],
      verb: r[3],
    };

    return request;
  },

  getFullURL: (hash: string) => {
    return url + hash;
  },

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
};

export default Utils;
