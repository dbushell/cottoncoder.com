import {default as MurmurHash3} from 'murmurhash';
import {encodeBase64, decodeBase64} from 'base64';

export const hash = (value: string) =>
  new MurmurHash3(value).result().toString(16);

export const sha256Hash = (value: string): Promise<ArrayBuffer> =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));

const randomIV = (length: number): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(length));

export const importKey = async (password: string): Promise<CryptoKey> => {
  const key = await crypto.subtle.importKey(
    'raw',
    await sha256Hash(password),
    {name: 'AES-GCM'},
    false,
    ['encrypt', 'decrypt']
  );
  return key;
};

export const encryptText = async (
  value: string,
  key: CryptoKey | string
): Promise<string> => {
  const iv = randomIV(12);
  const theKey = key instanceof CryptoKey ? key : await importKey(key);
  const encryptedValue = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    theKey,
    new TextEncoder().encode(value)
  );
  return `${encodeBase64(iv)}:${encodeBase64(encryptedValue)}`;
};

export const decryptText = async (
  value: string,
  key: CryptoKey | string
): Promise<string> => {
  const data = value.split(':');
  const iv = decodeBase64(data[0]);
  const theKey = key instanceof CryptoKey ? key : await importKey(key);
  const decryptedValue = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    theKey,
    decodeBase64(data[1])
  );
  return new TextDecoder().decode(decryptedValue);
};
