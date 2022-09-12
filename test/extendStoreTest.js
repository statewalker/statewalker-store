import { default as expect } from 'expect.js';
import newStore from '../src/newStore.js';
import extendStore from '../src/extendStore.js';

describe("extendStore", () => {
  it(`should add the "observe" method to the store`, async () => {
    const store = extendStore(newStore({ counter : 0 }));
    expect(typeof store.observe).to.be("function");

    const control = Array.from({ length: 10 }).map((_, id) => id + 1)
    let done = false;

    const list = [];
    const it = store.observe("counter");

    (async () => {
      try {
        for (let value of control) {
          await new Promise(r => setTimeout(r, 5 * Math.random()));
          store.set("counter", value);
        }
      } catch (error) {
        console.log(error);
      } finally {
        done = true;
      }
    })();


    for await (let value of it) {
      list.push(value);
      if (done) break;
    }
    expect(list).to.eql([0, ...control]);
  });

})
