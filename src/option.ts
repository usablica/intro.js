export function setOption<T, K extends keyof T>(
  options: T,
  key: K,
  value: T[K]
): T {
  options[key] = value;
  return options;
}

export function setOptions<T>(options: T, partialOptions: Partial<T>): T {
  for (const [key, value] of Object.entries(partialOptions)) {
    options = setOption(options, key as keyof T, value as T[keyof T]);
  }
  return options;
}
