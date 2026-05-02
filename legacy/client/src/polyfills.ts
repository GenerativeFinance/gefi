// Browser polyfills for Node.js modules

// Define polyfills immediately at global scope
(globalThis as any).global = globalThis;
(globalThis as any).Buffer = {
  from: (data: any) => new TextEncoder().encode(data),
  alloc: (size: number) => new Uint8Array(size),
  isBuffer: (obj: any) => false,
};
(globalThis as any).process = {
  env: {},
  nextTick: (cb: () => void) => setTimeout(cb, 0),
};

console.log('Polyfills loaded - global:', typeof global, 'Buffer:', typeof Buffer);

export {};