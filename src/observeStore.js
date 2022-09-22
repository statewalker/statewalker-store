import { observe } from "@statewalker/utils";

export default function observeStore(store, key, completionCallback = () => { }) {
  return observe((notify, complete) => {
    const cleanup = key === undefined
      ? (notify(store()), store.events.on("*", notify))
      : Array.isArray(key)
        ? store.useAll(key, notify)
        : store.use(key, notify);
    completionCallback(() => complete && complete());
    return () => {
      complete = null;
      cleanup();
    }
  });
}