import { default as expect } from 'expect.js';
import newStore from '../src/newStore.js';

describe("newStore - get/set values", () => {
  it(`#set/#get - methods should be able to get/set store values`, async () => {
    const store = newStore({ counter: 0 });
    expect(store.get("counter")).eql(0);
    store.set("counter", 3);
    expect(store.get("counter")).eql(3);
  });

  it(`#setAll - methods should be able to update multiple store fields at once`, async () => {
    const store = newStore({});
    expect(store()).eql({});
    store.setAll({ a: 3, b: 5, d: 10 });
    expect(store()).eql({ a: 3, b: 5, d: 10 });
  });

  it(`#getAll - methods should be able to load multiple store fields at once`, async () => {
    const store = newStore({ a: 3, b: 5, d: 10 });
    expect(store.getAll(["a", "b"])).eql({ a: 3, b: 5 });
    expect(store.getAll(["b", "d"])).eql({ b: 5, d: 10 });
  });
})

describe("newStore - use values", () => {
  it(`#useAll - should be notified when dependencies are changed`, async () => {
    const store = newStore({ a: 5, b: 4, d: 6 });
    let obj;
    const r = store.useAll(["a", "b"], (o) => (obj = o));
    expect(obj).eql({ a: 5, b: 4 });
    store.set("a", 10);
    expect(obj).eql({ a: 10, b: 4 });
    store.set("b", 15);
    expect(obj).eql({ a: 10, b: 15 });

    // Other fields don't change anything
    const o = obj;
    store.set("d", 25);
    expect(obj).eql({ a: 10, b: 15 });
    expect(obj).be(o);

    // Updating fields to the same values don't change dependencies
    store.set("a", 10);
    expect(obj).eql({ a: 10, b: 15 });
    expect(obj).be(o);
    store.set("b", 15);
    expect(obj).eql({ a: 10, b: 15 });
    expect(obj).be(o);

    r();
    // Now the obj is not updated
    store.set("b", 1);
    expect(obj).eql({ a: 10, b: 15 });
    store.set("a", 0);
    expect(obj).eql({ a: 10, b: 15 });
  });
})

describe("newStore - updates", () => {
  it(`#update - should be able to update values`, async () => {
    const store = newStore({ counter: 5 });
    store.update("counter", (value) => value + 2);
    expect(store.get("counter")).be(7);
  });

  it(`#updateAll - should be able to update all values`, async () => {
    const store = newStore({ a: 5, b: 3 });
    store.updateAll(["a", "b"], ({ a, b }) => ({ a: a + 1, b: b + 1 }));
    expect(store.getAll(["a", "b"])).eql({ a: 6, b: 4 });
  });
})

describe("newStore - selects (derived values)", () => {

  it(`#select - should return calculated values`, async () => {
    const store = newStore({ a: 5, b: 4 });
    const r = store.select("sum", ["a", "b"], ({ a, b }) => a + b);
    expect(store.get("sum")).be(9);
    store.set("a", 10);
    expect(store.get("sum")).be(14);
    store.set("b", 15);
    r();
    // Now the sum is unregistred
    expect(store.get("sum")).be(undefined);
    store.set("a", 1);
    expect(store.get("sum")).be(undefined);
  });

  it(`#select/#use - should notify about calculated values`, async () => {
    const store = newStore({ a: 5, b: 4 });
    const r = store.select("sum", ["a", "b"], ({ a, b }) => a + b);
    let sum;
    store.use("sum", (s) => (sum = s));
    expect(sum).be(9);
    store.set("a", 10);
    expect(sum).be(14);
    store.set("b", 15);
    expect(sum).be(25);
    r();
    // Now the sum is unregistred
    expect(sum).be(undefined);
    store.set("a", 1);
    expect(sum).be(undefined);
  });
})