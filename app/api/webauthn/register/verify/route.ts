import {NextRequest, NextResponse} from 'next/server';
import {verifyRegistrationResponse} from '@simplewebauthn/server';
import {isoBase64URL} from '@simplewebauthn/server/helpers';
import {ALLOWED_ORIGIN, RP_ID} from '../../util';
import { getChallenge } from '../../challenge';
import { getAllCredentials, saveCredential } from '../../credentialStore';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, response } = body;
    const expectedChallenge = isoBase64URL.fromBuffer(getChallenge(username));
    console.log(`Verifying registration for user: ${username} with challenge: ${expectedChallenge}`);

    try {
        const { verified, registrationInfo } = await verifyRegistrationResponse({
            response,
            expectedChallenge: expectedChallenge,
            expectedOrigin: ALLOWED_ORIGIN,
            expectedRPID: RP_ID,
        });

        if (!verified) {
            return NextResponse.json({ verified: false, error: 'Registration verification failed' }, { status: 400 });
        }

        console.log(`Registration Info for user ${username}:`, registrationInfo);

        // Store credential if verified
        if (registrationInfo) {
            saveCredential({
                username,
                credentialID: registrationInfo.credential.id,
                publicKey: isoBase64URL.fromBuffer(registrationInfo.credential.publicKey),
                counter: registrationInfo.credential.counter,
                credentialDeviceType: registrationInfo.credentialDeviceType,
                credentialBackedUp: registrationInfo.credentialBackedUp,
                credential: registrationInfo.credential,
            });
        }

        getAllCredentials().forEach(cred => {
            console.log(`Stored credential for user ${cred.username}: ID=${cred.credentialID}, PublicKey=${cred.publicKey}`);
        })
        
        return NextResponse.json({ status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ verified: false, error: message }, { status: 400 });
    }
}
