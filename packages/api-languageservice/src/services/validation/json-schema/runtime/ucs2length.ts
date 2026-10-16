/*
 * SPDX-FileCopyrightText: Copyright (c) 2015-2021 Evgeny Poberezkin
 * SPDX-License-Identifier: MIT
 *
 * Copied from ajv@8.20.0 (dist/runtime/ucs2length.js), the string length Ajv's generated code
 * uses for `minLength` and `maxLength`, and given TypeScript types. It is otherwise unchanged.
 */
// https://mathiasbynens.be/notes/javascript-encoding
// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
export function ucs2length(str: string): number {
  const len = str.length;
  let length = 0;
  let pos = 0;
  let value;
  while (pos < len) {
    length++;
    value = str.charCodeAt(pos++);
    if (value >= 0xd800 && value <= 0xdbff && pos < len) {
      // high surrogate, and there is a next character
      value = str.charCodeAt(pos);
      if ((value & 0xfc00) === 0xdc00) pos++; // low surrogate
    }
  }
  return length;
}
