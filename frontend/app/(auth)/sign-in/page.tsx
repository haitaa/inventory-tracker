"use client";

import { useState } from "react";
import { useAuth } from '@/app/lib/auth';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e: any) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={onSubmit} className="p-8 bg-white rounded shadow-md w-80">
                <h1 className="mb-4 text-2xl font-bold">Giriş Yap</h1>
                <input
                    type="email" placeholder="Email"
                    className="w-full mb-3 px-3 py-2 border rounded"
                    value={email} onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password" placeholder="Parola"
                    className="w-full mb-3 px-3 py-2 border rounded"
                    value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                    Giriş
                </button>
            </form>
        </div>
    );
}