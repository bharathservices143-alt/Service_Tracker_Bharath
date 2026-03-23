import mongoose, { Schema, Document, models } from 'mongoose';

export interface IEnquiry extends Document {
    customerName: string;
    address: string;
    phoneNumber: string;
    complaint: string;
    staffName?: string;
    imageUrls: string[];
    isServiceDelivered: boolean;
    createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    complaint: { type: String, required: true },
    staffName: { type: String, required: false },
    imageUrls: { type: [String], default: [] },
    isServiceDelivered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Enquiry = models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
