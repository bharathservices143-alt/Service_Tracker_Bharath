'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { usePathname } from 'next/navigation'

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-slate-900 p-4 text-white border-b border-slate-800 relative z-50">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 font-bold text-xl text-white">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="truncate">
                        <span className="text-[#FFD700]">Bharath</span>{" "}
                        <span className="text-[#3B82F6]">Refrigeration</span>
                    </span>
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-2 text-slate-300 hover:text-white transition">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Desktop & Mobile Dropdown */}
            <div className={`
                ${isOpen ? 'flex' : 'hidden'} md:flex 
                flex-col w-full md:w-64 bg-slate-900 md:flex-shrink-0 text-white min-h-[calc(100vh-65px)] md:min-h-screen border-b md:border-b-0 md:border-r border-slate-800 absolute md:relative z-40 top-[65px] md:top-0 left-0
            `}>
                <div className="hidden md:flex flex-col p-6 items-center justify-center border-b border-slate-800 gap-4">
                    <Link href="/" className="flex flex-col items-center gap-3 group">
                        <div className="w-14 h-14 transition-transform group-hover:scale-105 duration-300">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg text-[#cfb000] tracking-wide">BHARATH</span>
                            <span className="text-xs font-bold text-[#3B82F6] tracking-[0.2em] -mt-1 uppercase">Refrigeration</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link onClick={() => setIsOpen(false)} href="/enquiry" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/enquiry' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-indigo-600/10 hover:text-indigo-400'}`}>
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Enquiry</span>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-indigo-600/10 hover:text-indigo-400'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={logout}>
                        <button type="submit" className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
