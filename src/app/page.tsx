import Link from 'next/link'
import { ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="w-full bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-2xl">
                            <span className="text-[#cfb000]">Bharath</span>{" "}
                            <span className="text-[#1E3A8A]">Refrigeration</span>
                        </span>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white py-20 sm:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
                            Fast & Reliable <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                                Service Management
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10">
                            Submit your complaints or service enquiries.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/enquiry" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Start Enquiry <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-slate-50 pointer-events-none" />
                </section>

                {/* Features / Photo Gallery Section */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900">Trusted by Professionals</h2>
                            <p className="mt-4 text-slate-600 text-lg">Delivering excellence in every service request</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <Clock className="w-12 h-12 text-indigo-500 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Rapid Response</h3>
                                <p className="text-slate-600">Our team attends to your service requests swiftly to minimize downtime.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <ShieldCheck className="w-12 h-12 text-cyan-500 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Quality Assured</h3>
                                <p className="text-slate-600">Every service delivery is tracked and verified for maximum satisfaction.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Transparent Tracking</h3>
                                <p className="text-slate-600">Know exactly when your service is delivered with real-time updates.</p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 py-12 text-center">
                <p className="text-slate-400">&copy; {new Date().getFullYear()} Bharath Refrigeration. All rights reserved.</p>
            </footer>
        </div>
    )
}
