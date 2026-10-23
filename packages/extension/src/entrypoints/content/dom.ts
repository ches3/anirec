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
      resolve(element);
      return;
    }
    if (timeout <= 0) {
      resolve(undefined);
      return;
    }

    const timer = setTimeout(() => {
      clearInterval(interval);
      resolve(undefined);
    }, timeout);

    const interval = setInterval(() => {
      const currentElement = root.querySelector(selector);
      if (currentElement) {
        clearInterval(interval);
        clearTimeout(timer);
        resolve(currentElement);
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
    const text = element.textContent.trim();
    if (text) {
      resolve(text);
      return;
    }
    if (timeout <= 0) {
      resolve(undefined);
      return;
    }

    const timer = setTimeout(() => {
      clearInterval(interval);
      resolve(undefined);
    }, timeout);

    const interval = setInterval(() => {
      const currentText = element.textContent.trim();
      if (currentText) {
        clearInterval(interval);
        clearTimeout(timer);
        resolve(currentText);
      }
    }, 100);
  });
};
