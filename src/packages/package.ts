export interface Package<TOption> {
  getOption<K extends keyof TOption>(key: K): TOption[K];
  setOptions(partialOptions: Partial<TOption>): this;
  setOption<K extends keyof TOption>(key: K, value: TOption[K]): this;
  clone(): ThisType<this>;
  isActive(): boolean;
  render(): Promise<this>;
}
