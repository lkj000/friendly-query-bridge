declare global {
  function acquireVsCodeApi(): {
    postMessage(message: unknown): void;
    setState(state: unknown): void;
    getState(): unknown;
  };
}

export const getVsCodeApi = () => {
  try {
    return typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;
  } catch {
    return null;
  }
};