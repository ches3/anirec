export const asyncQuerySelector = (
  selector: string,
  {
    root = document,
    timeout = 10000,
  }: {
    root?: ParentNode;
    timeout?: number;
  } = {},
) => {
  return new Promise<Element | undefined>((resolve) => {
    const element = root.querySelector(selector);
    if (element) {
      return resolve(element);
    }
    if (timeout <= 0) {
      return resolve(undefined);
    }

    const timer = setTimeout(() => {
      clearInterval(interval);
      resolve(undefined);
    }, timeout);

    const interval = setInterval(() => {
      const element = root.querySelector(selector);
      if (element) {
        clearInterval(interval);
        clearTimeout(timer);
        resolve(element);
      }
    }, 500);
  });
};

export const getTextContent = (
  element: Element,
  {
    timeout = 10000,
  }: {
    timeout?: number;
  } = {},
): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const text = element.textContent?.trim();
    if (text) return resolve(text);
    if (timeout <= 0) {
      return resolve(undefined);
    }

    const timer = setTimeout(() => {
      clearInterval(interval);
      resolve(undefined);
    }, timeout);

    const interval = setInterval(() => {
      const text = element.textContent?.trim();
      if (text) {
        clearInterval(interval);
        clearTimeout(timer);
        resolve(text);
      }
    }, 100);
  });
};
