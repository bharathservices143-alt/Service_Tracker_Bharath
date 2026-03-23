import { Sidebar } from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 md:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
            <Toaster position="top-right" />
        </div>
    );
}
