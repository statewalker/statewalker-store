import observeStore from "./observeStore.js";

export default function extendStore(store) {
  store.observe = store.observe || ((key) => observeStore(store, key));
  return store;
}