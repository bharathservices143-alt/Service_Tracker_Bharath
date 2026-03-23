'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const username = formData.get('username')
    const password = formData.get('password')

    if (
        username === process.env.NEXT_PUBLIC_ADMIN_USER &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASS
    ) {
        cookies().set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })
        redirect('/')
    } else {
        return { error: 'Invalid credentials' }
    }
}

export async function logout() {
    cookies().delete('admin_session')
    redirect('/login')
}
