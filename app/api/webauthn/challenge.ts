import { isoBase64URL } from "@simplewebauthn/server/helpers";

export function getChallenge(username: string): Uint8Array {
    // Simple deterministic challenge for demo purposes (not secure for production)
    // In production, use a cryptographically secure random value
    return new TextEncoder().encode(username);
}
