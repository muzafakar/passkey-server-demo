// app/api/webauthn/credentialStore.ts

import fs from 'fs';
import path from 'path';
import { WebAuthnCredential } from "@simplewebauthn/types";

export interface CredentialRecord {
  username: string;
  credentialID: string;
  publicKey: string;
  counter: number;
  credentialDeviceType?: string;
  credentialBackedUp?: boolean;
  credential: WebAuthnCredential;
}

const CREDENTIALS_PATH = path.resolve(process.cwd(), 'credentials.json');

function reviveCredential(cred: any): WebAuthnCredential {
  // Convert publicKey object to Uint8Array if needed
  let publicKey = cred.publicKey;
  if (publicKey && typeof publicKey === 'object' && !(publicKey instanceof Uint8Array)) {
    publicKey = new Uint8Array(Object.values(publicKey));
  }
  return {
    id: cred.id,
    publicKey,
    counter: cred.counter,
    transports: cred.transports,
  };
}

function readStore(): Record<string, CredentialRecord> {
  try {
    const data = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
    const store = JSON.parse(data);
    // Revive credential property for each record
    for (const key in store) {
      if (store[key].credential) {
        store[key].credential = reviveCredential(store[key].credential);
      }
    }
    return store;
  } catch (e) {
    return {};
  }
}

function writeStore(store: Record<string, CredentialRecord>) {
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

export function saveCredential(record: CredentialRecord) {
  const store = readStore();
  store[record.username] = record;
  writeStore(store);
}

export function getCredential(username: string): CredentialRecord | undefined {
  const store = readStore();
  return store[username];
}

export function getAllCredentials(): CredentialRecord[] {
  const store = readStore();
  return Object.values(store);
}
