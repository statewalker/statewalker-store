import { newRegistry, newMutex } from "@statewalker/utils";

export default function sync(key, ...stores) {
  const [register, clean] = newRegistry();
  const mutex = newMutex();
  stores.forEach((source) =>
    register(
      source.use(key, (value) =>
        mutex(() =>
          stores.forEach((store) => {
            if (store === source) return;
            store.set(key, value);
          })
        )
      )
    )
  );
  return clean;
}