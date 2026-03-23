'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Search, Clock, MapPin, Phone, User, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type Enquiry = {
    _id: string
    customerName: string
    address: string
    phoneNumber: string
    complaint: string
    staffName?: string
    imageUrls: string[]
    isServiceDelivered: boolean
    createdAt: string
}

export default function DashboardPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'all' | 'attended' | 'non-attended'>('non-attended')
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [staffName, setStaffName] = useState('')
    const [skipStaff, setSkipStaff] = useState(false)
    const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null)

    const deleteEnquiry = async (id: string) => {
        setDeleting(true)
        try {
            const res = await fetch(`/api/enquiries/${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                setEnquiries(prev => prev.filter(e => e._id !== id))
                setSelectedEnquiry(null)
                toast.success('Enquiry deleted successfully')
            } else {
                toast.error('Failed to delete enquiry')
            }
        } catch (err) {
            console.error(err)
            toast.error('Error deleting enquiry')
        } finally {
            setDeleting(false)
        }
    }

    const fetchEnquiries = async () => {
        try {
            const res = await fetch('/api/enquiries')
            const data = await res.json()
            if (data.success) {
                setEnquiries(data.enquiries)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEnquiries()
    }, [])

    const markAsAttended = async (id: string) => {
        setUpdating(true)
        try {
            const bodyData: any = { isServiceDelivered: true };
            if (!skipStaff && staffName.trim()) {
                bodyData.staffName = staffName.trim();
            }

            const res = await fetch(`/api/enquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })
            if (res.ok) {
                setEnquiries(prev => prev.map(e => e._id === id ? { ...e, isServiceDelivered: true, staffName: bodyData.staffName || e.staffName } : e))
                setSelectedEnquiry(null)
                toast.success('Successfully marked as attended!')
            } else {
                toast.error('Failed to update status')
            }
        } catch (err) {
            console.error(err)
            toast.error('Error updating status')
        } finally {
            setUpdating(false)
        }
    }

    const filteredEnquiries = enquiries.filter(e => {
        if (activeTab === 'attended') return e.isServiceDelivered
        if (activeTab === 'non-attended') return !e.isServiceDelivered
        return true
    })

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Enquiry Management</h1>
                    <p className="text-slate-600 mt-1">Track and manage customer service requests</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex w-full bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 gap-1">
                <button
                    onClick={() => setActiveTab('non-attended')}
                    className={`flex-1 px-2 sm:px-6 py-2.5 rounded-lg font-medium text-xs sm:text-sm text-center transition ${activeTab === 'non-attended' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    Non-Attended
                </button>
                <button
                    onClick={() => setActiveTab('attended')}
                    className={`flex-1 px-2 sm:px-6 py-2.5 rounded-lg font-medium text-xs sm:text-sm text-center transition ${activeTab === 'attended' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    Attended
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 px-2 sm:px-6 py-2.5 rounded-lg font-medium text-xs sm:text-sm text-center transition ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    All Requests
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnquiries.map(enquiry => (
                    <div
                        key={enquiry._id}
                        onClick={() => {
                            setSelectedEnquiry(enquiry)
                            setStaffName('')
                            setSkipStaff(false)
                        }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition cursor-pointer group flex flex-col h-full"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${enquiry.isServiceDelivered ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                {enquiry.isServiceDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                {enquiry.isServiceDelivered ? 'Attended' : 'Pending'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                {new Date(enquiry.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition truncate">{enquiry.customerName}</h3>

                        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                            {enquiry.complaint}
                        </p>

                        <div className="mt-auto space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{enquiry.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{enquiry.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEnquiries.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No enquiries found</h3>
                        <p className="text-slate-500 mt-1">There are no matching service requests.</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)}></div>

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                <User className="w-4 h-4 text-indigo-500" />
                                {selectedEnquiry.customerName}
                            </h2>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1">
                            <div className="flex flex-col gap-8">
                                {/* Details Column */}
                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Complaint Details</h4>
                                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                                            {selectedEnquiry.complaint}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Contact Info</h4>
                                            <p className="text-sm text-slate-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedEnquiry.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</h4>
                                            <p className="text-sm text-slate-700 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400 truncate" /> <span className="truncate">{selectedEnquiry.address}</span></p>
                                        </div>
                                    </div>

                                    {selectedEnquiry.staffName && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Staff</h4>
                                            <p className="text-sm text-slate-700">{selectedEnquiry.staffName}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Submitted On</h4>
                                        <p className="text-sm text-slate-700">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Images Column */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Attached Images</h4>
                                    {selectedEnquiry.imageUrls && selectedEnquiry.imageUrls.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {selectedEnquiry.imageUrls.map((url, i) => (
                                                <div key={i} className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:opacity-90 hover:shadow-md transition cursor-pointer group relative" onClick={() => window.open(url, '_blank')}>
                                                    <img src={url} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 rounded-xl p-6 text-center text-sm text-slate-500 border border-dashed border-slate-200">
                                            No images attached
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-4">

                            {!selectedEnquiry.isServiceDelivered && (
                                <div className="bg-white px-5 py-3 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
                                            <User className="w-4 h-4 text-indigo-500" /> Assign Staff
                                        </h4>

                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={staffName}
                                                onChange={(e) => {
                                                    setStaffName(e.target.value)
                                                    if (e.target.value) setSkipStaff(false)
                                                }}
                                                disabled={skipStaff || updating}
                                                placeholder="Enter assigned staff name..."
                                                className={`w-full pl-3 pr-8 py-2 text-sm text-slate-900 placeholder:text-slate-400 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${skipStaff ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-300 shadow-sm'}`}
                                            />
                                            {staffName && (
                                                <button
                                                    onClick={() => setStaffName('')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-max hover:text-slate-900 transition whitespace-nowrap">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={skipStaff}
                                                    onChange={(e) => {
                                                        setSkipStaff(e.target.checked)
                                                        if (e.target.checked) setStaffName('')
                                                    }}
                                                    disabled={updating}
                                                    className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 transition cursor-pointer"
                                                />
                                                <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition" />
                                            </div>
                                            Skip assignment
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                                <span className={`w-full sm:w-44 justify-center inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${selectedEnquiry.isServiceDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {selectedEnquiry.isServiceDelivered ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    Status: {selectedEnquiry.isServiceDelivered ? 'Attended' : 'Pending'}
                                </span>

                                <div className="flex w-full sm:w-auto gap-3">
                                    {!selectedEnquiry.isServiceDelivered && (
                                        <button
                                            onClick={() => {
                                                if (!skipStaff && !staffName.trim()) {
                                                    toast.error('Please assign a staff member or strictly skip assignment.')
                                                    return
                                                }
                                                markAsAttended(selectedEnquiry._id)
                                            }}
                                            disabled={updating || deleting}
                                            className="w-full sm:w-44 justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {updating ? 'Marking...' : 'Mark as Attended'}
                                        </button>
                                    )}

                                    {selectedEnquiry.isServiceDelivered && (
                                        <button
                                            onClick={() => setEnquiryToDelete(selectedEnquiry._id)}
                                            disabled={updating || deleting}
                                            className="w-full sm:w-44 justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {deleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {enquiryToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEnquiryToDelete(null)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Delete</h3>
                            <p className="text-slate-600 mb-8">Are you sure you want to permanently delete this enquiry? This action cannot be undone.</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEnquiryToDelete(null)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deleteEnquiry(enquiryToDelete)
                                        setEnquiryToDelete(null)
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
