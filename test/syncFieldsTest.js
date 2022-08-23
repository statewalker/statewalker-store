import { default as expect } from 'expect.js';
import newStore from '../src/newStore.js';
import syncFields from '../src/syncFields.js';

describe("syncFields", () => {

  it(`should be able to synchronize different store fields`, async () => {
    const store1 = newStore({
      name: 'Store 1'
    })
    const store2 = newStore({
      name: 'Store 2'
    })

    expect(store1()).to.eql({
      name: 'Store 1'
    })
    expect(store2()).to.eql({
      name: 'Store 2'
    })

    syncFields(store1, store2, "x", "y");

    store1.set("x", "Hello, world");

    expect(store1()).to.eql({
      name: 'Store 1',
      x: "Hello, world"
    })
    expect(store2()).to.eql({
      name: 'Store 2',
      y: "Hello, world"
    })

    store2.set("y", "Hello, WORLD!");

    expect(store1()).to.eql({
      name: 'Store 1',
      x: "Hello, WORLD!"
    })
    expect(store2()).to.eql({
      name: 'Store 2',
      y: "Hello, WORLD!"
    })

  });

})