import { default as expect } from 'expect.js';
import newStore from '../src/newStore.js';
import sync from '../src/sync.js';

describe("sync", () => {
  it(`should be able to synchronize different stores`, async () => {
    const store1 = newStore({
      name: 'Store 1'
    })
    const store2 = newStore({
      name: 'Store 2'
    })
    const store3 = newStore({
      name: 'Store 3'
    })

    expect(store1()).to.eql({
      name: 'Store 1'
    })
    expect(store2()).to.eql({
      name: 'Store 2'
    })
    expect(store3()).to.eql({
      name: 'Store 3'
    })
    sync("message", store1, store2, store3);

    store1.set("message", "Hello, world");

    expect(store1()).to.eql({
      name: 'Store 1',
      message: "Hello, world"
    })
    expect(store2()).to.eql({
      name: 'Store 2',
      message: "Hello, world"
    })
    expect(store3()).to.eql({
      name: 'Store 3',
      message: "Hello, world"
    })

    store3.set("message", "Hello, WORLD!");

    expect(store1()).to.eql({
      name: 'Store 1',
      message: "Hello, WORLD!"
    })
    expect(store2()).to.eql({
      name: 'Store 2',
      message: "Hello, WORLD!"
    })
    expect(store3()).to.eql({
      name: 'Store 3',
      message: "Hello, WORLD!"
    })


  });

})