import { observe } from "@statewalker/utils";

export default function observeStore(store, key) {
  return observe((notify) => {
    return key === undefined
      ? (notify(store()), store.events.on("*", notify))
      : Array.isArray(key)
        ? store.useAll(key, notify)
        : store.use(key, notify);
  });
}