import {NextRequest, NextResponse} from 'next/server';
import {verifyAuthenticationResponse} from '@simplewebauthn/server';
import {getChallenge} from '../../challenge';
import {isoBase64URL} from '@simplewebauthn/server/helpers';
import {ALLOWED_ORIGIN, RP_ID} from '../../util';
import {getCredential} from '../../credentialStore';
import {WebAuthnCredential} from "@simplewebauthn/types";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const {username, authentication} = body;
    console.log(username);
    console.log(JSON.parse(authentication));
    const expectedChallenge = isoBase64URL.fromBuffer(getChallenge(username));
    const expectedCredential = getCredential(username);



    if (!expectedCredential) {
        return NextResponse.json({verified: false, error: 'No credential found for user'}, {status: 404});
    }

    // Prepare credential for verification
    const cred = expectedCredential.credential;
    let publicKey = cred.publicKey;
    if (publicKey && typeof publicKey === 'object' && !(publicKey instanceof Uint8Array)) {
        publicKey = new Uint8Array(Object.values(publicKey));
    }

    console.log(cred.publicKey);
    console.log(cred.id)

    try {
        const {verified, authenticationInfo} = await verifyAuthenticationResponse({
            response: JSON.parse(authentication),
            expectedChallenge: expectedChallenge,
            expectedOrigin: ALLOWED_ORIGIN,
            expectedRPID: RP_ID,
            credential: {
                id: cred.id,
                counter: cred.counter,
                transports: cred.transports,
                publicKey,
            }
        });

        if (!verified) {
            return NextResponse.json({verified: false, error: 'Authentication verification failed'}, {status: 400});
        }

        return NextResponse.json({verified: true}, {status: 200});
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Authentication verification error for user ${username}:`, message);
        return NextResponse.json({verified: false}, {status: 400});
    }
}
