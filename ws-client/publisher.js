// @flow strict
/*::
export type Publisher<T> = {
  subscribe: (subscriber: (payload: T) => mixed) => { unsubscribe: () => void },
};
*/

/*::
export type EventPublisher<T> = {
  ...Publisher<T>,
  publish: T => void,
}
*/

export const createEventPublisher = /*:: <T>*/()/*: EventPublisher<T>*/ => {
  const subscribers = new Map();
  const subscribe = (subscriber/*: T => mixed*/) => {
    const key = Symbol();
    subscribers.set(key, subscriber)
    const unsubscribe = () => {
      subscribers.delete(key);
    }
    return { unsubscribe };
  };
  const publish = (event/*: T*/) => {
    for (const [,subscriber] of [...subscribers])
      subscriber(event)
  };
  return { publish, subscribe };
}