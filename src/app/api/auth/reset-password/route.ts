import { NextResponse } from 'next/server';
import { otpStorage } from '@/lib/otpStore';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
        }

        const record = otpStorage[email];

        if (!record) {
            return NextResponse.json({ success: false, error: 'No OTP requested for this email' }, { status: 400 });
        }

        if (Date.now() > record.expires) {
            delete otpStorage[email];
            return NextResponse.json({ success: false, error: 'OTP has expired' }, { status: 400 });
        }

        if (record.otp !== otp) {
            return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 });
        }

        // Clean up the OTP
        delete otpStorage[email];

        return NextResponse.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ success: false, error: 'Failed to verify OTP' }, { status: 500 });
    }
}
