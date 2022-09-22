import observeStore from "./observeStore.js";

export default function extendStore(store, completionCallback) {
  store.observe = store.observe || ((key) => observeStore(store, key, completionCallback));
  return store;
}