'use server'
import { cookies } from "next/headers";
import initFirebaseAdmin from "@/firebase/admin";

const { db } = initFirebaseAdmin();

export async function signUp(params: SignUpParams){
    const {uid, name, email, password} = params;
    try{
        const userDocRef = db.collection('users').doc(uid);
        const userRecord = await userDocRef.get();

        if(userRecord.exists){
            return{
                success: false,
                message: 'User already exists'
            }
        }
        await userDocRef.set({
            name,
            email,
        });
        return{
            success: true,
            message: 'User created successfully'
        }
    }catch(e:any){
        console.error('Error creating a user',e);

        if(e.code=== 'auth/email-already-in-use'){
            return{
                success: false,
                message: 'Email already in use'
            }
        }
        return{
            success: false,
            message: 'Something went wrong'
        }
    }
}
const ONE_WEEK = 60*60*24*7;

export async function setSessionCookie(idtoken: string){
    const { auth: adminAuth } = initFirebaseAdmin();
    const cookieStore = await cookies();
    const sessionCookie = await adminAuth.createSessionCookie(idtoken, {expiresIn:ONE_WEEK*1000});
    cookieStore.set('session',sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
}
export async function signIn(params: SignInParams){
    const {email,idToken} = params;
    const { auth: adminAuth } = initFirebaseAdmin();

    try{
        const userRecord = await adminAuth.getUserByEmail(email);
        if(!userRecord.uid){
            return{
                success: false,
                message: 'User not found'
            }
        }
        await setSessionCookie(idToken);
        

    }catch(e){
        console.log(e);
        return{
            success: false,
            message: 'Something went wrong'
        }
    }
}
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    const { auth: adminAuth } = initFirebaseAdmin();
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userDoc.exists) {
            return null;
        }
        const data = userDoc.data();
        return {
            ...data,
            id: userDoc.id,
        } as User;
    } catch (e) {
        console.log(e);
        return null;
    }
}
export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}