import {NextRequest, NextResponse} from 'next/server';
import {generateAuthenticationOptions} from '@simplewebauthn/server';
import {RP_ID} from '../util';
import {getChallenge} from '../challenge';
import {getCredential} from '../credentialStore';
import {AuthenticatorTransportFuture} from '@simplewebauthn/types';
import {isoBase64URL} from '@simplewebauthn/server/helpers';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {username} = body;
    const challenge = getChallenge(username);
    console.log(`expectedChallenge during authentication: ${isoBase64URL.fromBuffer(challenge)}`);

    let allowCredentials: { id: string; type: string; transports: AuthenticatorTransportFuture[] | undefined; }[] = [];
    const userCredential = getCredential(username)

    if (userCredential) {
        allowCredentials = [{
            id: userCredential.credentialID,
            type: 'public-key',
            transports: userCredential.credential.transports,
        }];
    }

    const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        userVerification: 'preferred' as const,
        challenge: challenge,
        allowCredentials: allowCredentials,
    });
    return NextResponse.json(options, {status: 200});
}
