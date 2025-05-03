import { ReactNode } from 'react';
import { useAuth } from '@/app/lib/auth';

export default function Layout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow p-4 flex justify-between">
                <h2 className="text-xl font-bold">Inventory App</h2>
                {user && (
                    <div>
                        <span className="mr-4">Hoşgeldin, {user.email}</span>
                        <button onClick={logout} className="text-red-500">Çıkış</button>
                    </div>
                )}
            </header>
            <main className="p-6">{children}</main>
        </div>
    );
}