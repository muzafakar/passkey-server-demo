import {NextRequest, NextResponse} from 'next/server';
import {generateRegistrationOptions} from '@simplewebauthn/server';
import {getChallenge} from '../challenge';
import {log} from 'console';
import {RP_ID} from '../util';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {username} = body;

    const challenge = getChallenge(username);
    console.log(`Generating registration options for user: ${username} with challenge: ${challenge}`);
    if (!challenge) {
        return NextResponse.json({error: 'Invalid username or challenge'}, {status: 400});
    }
    const opts = {
        rpName: `Passkey Demo (${username})`,
        challenge: challenge,
        rpID: RP_ID,
        userID: challenge,
        userName: username,
        userDisplayName: username,
        attestationType: 'none' as const,
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred',
            // authenticatorAttachment: "platform" ,
        } as const,
    }

    log(`Options for user ${username}:`, opts);
    const options = await generateRegistrationOptions(opts);
    return NextResponse.json(options);
}
