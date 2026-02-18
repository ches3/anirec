// 要素が DOM に現れた後にテキストを書き込むサービス向けに、
// textContent が埋まるまでポーリングする
export const waitForTextContent = (
  element: Element,
): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const text = element.textContent?.trim();
    if (text) return resolve(text);

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
    }, 10000);
  });
};
