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

    const interval = setInterval(() => {
      const element = root.querySelector(selector);
      if (element) {
        clearInterval(interval);
        return resolve(element);
      }
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
      return resolve(undefined);
    }, timeout);
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

    const interval = setInterval(() => {
      const text = element.textContent?.trim();
      if (text) {
        clearInterval(interval);
        resolve(text);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      resolve(undefined);
    }, timeout);
  });
};
