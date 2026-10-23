/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    lang: import('./lib/i18n').Lang;
    user: import('./lib/auth').User | null;
  }
}

declare module '*.sql?raw' {
  const sql: string;
  export default sql;
}
