import { newEventEmitter } from "@statewalker/utils";

export default function newStore(data = {}, { equals = (a, b) => a === b } = {}) {
  function f(d) {
    return arguments.length === 0 ? data : ((data = d), f);
  }

  const events = (f.events = newEventEmitter());

  function _toKeys(keys) {
    if (typeof keys === "string")
      return keys
        .split(/[,;]/gim)
        .map((_) => _.trim())
        .filter((_) => !!_);
    else if (Array.isArray(keys)) return keys;
    else if (keys) return [keys];
    return [];
  }

  f.set = function set(key, value) {
    const r = !equals(data[key], value);
    r &&
      (value === undefined ? delete data[key] : (data[key] = value),
      events.emit("*", data, key),
      events.emit(key, value));
    return r;
  };
  f.setAll = function setAll(keys, values) {
    if (!keys) return;
    if (values === undefined) {
      values = keys;
      keys = Object.keys(values);
    }
    keys.forEach((key) => f.set(key, values[key]));
  };

  f.get = function get(key) {
    return data[key];
  };
  f.getAll = function getAll(keys) {
    return _toKeys(keys).reduce(
      (vals, key) => ((vals[key] = data[key]), vals),
      {}
    );
  };

  f.use = function use(key, listener, mute) {
    const notify = () => listener(f.get(key));
    !mute && notify();
    return events.on(key, notify);
  };
  f.useAll = function useAll(keys, listener, mute) {
    keys = _toKeys(keys);
    const notify = () => listener(f.getAll(keys));
    const registrations = keys.map((key) => events.on(key, notify));
    !mute && notify();
    return () => registrations.forEach((r) => r && r());
  };

  f.update = function update(key, action) {
    f.set(key, action(f.get(key)));
  };
  f.updateAll = function updateAll(keys, action) {
    let value = action(f.getAll(keys));

    f.setAll(value);
  };

  f.select = function select(key, dependencies, transform = (o) => o) {
    const r = f.useAll(dependencies, (values) =>
      f.set(key, transform(values, f.get(key)))
    );
    return () => {
      r();
      f.set(key);
    };
  };
  f.selectAll = function select(dependencies, transform = (o) => o) {
    return f.useAll(dependencies, (values) =>
      f.setAll(transform(values) || {})
    );
  };
  return f(data);
}