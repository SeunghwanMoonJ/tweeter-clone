export default function Test() {
  type Words = {
    [key: string]: string;
  };
  class Word {
    constructor(public term: string, public def: string) {}
  }
  class Dict {
    private words: Words;
    constructor() {
      this.words = {};
    }
    add(word: Word) {
      if (this.words[word.term] === undefined) {
        this.words[word.term] = word.def;
      }
    }
    get(term: string) {
      return this.words[term];
    }
    update(word: Word) {
      if (this.words[word.term] !== undefined) {
        this.words[word.term] = word.def;
      }
    }
    delete(term: string) {
      if (this.words[term] !== undefined) {
        delete this.words[term];
      }
    }
    count() {
      return Object.keys(this.words).length;
    }
    showAll() {
      for (const key in this.words) {
        console.log(key, ":", this.words[key]);
      }
    }
  }

  const kimchi = new Word("kimchi", "배추 발효 음식 김치");
  const dict = new Dict();

  dict.add(kimchi);
  console.log(dict.get("kimchi"));
  dict.delete("kimchi");
  console.log(dict.get("kimchi"));
  dict.add(kimchi);
  console.log(dict.count());
  dict.showAll();
  return null;
}
