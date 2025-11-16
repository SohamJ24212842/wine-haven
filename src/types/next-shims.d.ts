// Temporary shims for editors complaining about next module types.
// Next.js provides its own type declarations via next-env.d.ts,
// but some IDE TypeScript versions can still flag 7016 in JS interop.
// These declarations are safe and will be overridden by real types at build time.

declare module 'next/image';
declare module 'next/link';


