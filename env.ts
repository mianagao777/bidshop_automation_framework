function port(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1024 || value > 65535) {
    throw new Error(`${name} must be an integer between 1024 and 65535`);
  }
  return value;
}
export const apiPort = port('TEST_API_PORT', 4100);
export const uiPort = port('TEST_UI_PORT', 5180);
if (apiPort === uiPort) throw new Error('API and UI ports must differ');
export const apiURL = `http://localhost:${apiPort}`;
export const uiURL = `http://localhost:${uiPort}`;
