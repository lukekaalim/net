export type Publisher<T> = {
  subscribe: (subscriber: (payload: T) => unknown) => { unsubscribe: () => void },
};

export type EventPublisher<T> = Publisher<T> & {
  publish: (event: T) => void,
}

export const createEventPublisher: <T>() => EventPublisher<T>;