import { default as expect } from 'expect.js';
import newStore from '../src/newStore.js';
import observeStore from '../src/observeStore.js';

describe("observeStore", () => {
  it(`should be able notify asynchroniously about changes`, async () => {
    const store = newStore({ counter : 0 });
    const control = Array.from({ length: 10 }).map((_, id) => id + 1)
    let done = false;

    const list = [];
    const it = observeStore(store, "counter");

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
