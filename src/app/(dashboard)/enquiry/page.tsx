'use client'

import { useState, useRef } from 'react'
import { X, Upload, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function EnquiryPage() {
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setImages((prev) => [...prev, ...newFiles])

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviews((prev) => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const currentForm = e.currentTarget
        images.forEach(img => formData.append('images', img))

        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                toast.success('Enquiry submitted successfully!')
                setSuccess(true)
                setImages([])
                setPreviews([])
                currentForm.reset()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to submit enquiry')
            }
        } catch (err) {
            console.error(err)
            toast.error('Error submitting enquiry')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Submitted Successfully!</h2>
                <p className="text-slate-600 mb-6">We have received your request and will attend to it shortly.</p>
                <button onClick={() => setSuccess(false)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                    Submit Another Enquiry
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Submit an Enquiry</h1>
                <p className="text-slate-600 mt-2">Please fill in the details below. You can attach multiple images of the issue.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Customer Name *</label>
                            <input required name="customerName" type="text" className="w-full px-4 py-2 text-sm placeholder:text-sm text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                            <input required name="phoneNumber" type="tel" className="w-full px-4 py-2 text-sm placeholder:text-sm text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="+1 234 567 8900" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                        <input required name="address" type="text" className="w-full px-4 py-2 text-sm placeholder:text-sm text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="123 Main St, City" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Staff Name (Optional)</label>
                        <input name="staffName" type="text" className="w-full px-4 py-2 text-sm placeholder:text-sm text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="Assigned staff member" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Complaint Details *</label>
                        <textarea required name="complaint" rows={4} className="w-full px-4 py-2 text-sm placeholder:text-sm text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none" placeholder="Describe the issue in detail..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Images</label>
                        <div
                            className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                            <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                        {/* Previews */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
