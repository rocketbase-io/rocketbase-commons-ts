/**
 * Generates RFC4122 version 4 guid ()
 */

// @ts-ignore
const crypto = typeof window !== 'undefined' ? window.crypto || window.msCrypto : null;

function _cryptoUuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto!.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function _uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ ((Math.random() * 16) >> (c / 4))).toString(16)
  );
}

export default function random() {
  const hasCrypto = typeof crypto !== 'undefined' && crypto !== null;
  const hasRandomValues = hasCrypto && typeof crypto!.getRandomValues !== 'undefined';
  const uuid = hasRandomValues ? _cryptoUuidv4 : _uuidv4;
  return uuid().replace(/-/g, '');
}
