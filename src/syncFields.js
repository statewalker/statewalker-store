import { newRegistry, newMutex } from "@statewalker/utils";

export default function syncFields(store1, store2, key1, key2 = key1) {
  const [register, clean] = newRegistry();
  const mutex = newMutex();
  const update = (store, key, action) =>
    store.use(key, (value) => mutex(() => action(value)));
  register(update(store1, key1, (value) => store2.set(key2, value)));
  register(update(store2, key2, (value) => store1.set(key1, value)));
  return clean;
}