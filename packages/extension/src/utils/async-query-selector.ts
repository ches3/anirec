export const asyncQuerySelector = (
  selector: string,
  root: ParentNode,
  index = 0,
) => {
  return new Promise<Element | undefined>((resolve) => {
    const element = root.querySelectorAll(selector)[index];
    if (element) {
      return resolve(element);
    }
    const interval = setInterval(() => {
      const element = root.querySelectorAll(selector)[index];
      if (element) {
        clearInterval(interval);
        return resolve(element);
      }
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
      return resolve(undefined);
    }, 30000);
  });
};
