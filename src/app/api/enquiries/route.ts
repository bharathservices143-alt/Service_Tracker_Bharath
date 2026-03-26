/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function POST(req: Request) {
    try {
        await connectDB();
        const formData = await req.formData();

        // Extract text fields
        const customerName = formData.get('customerName') as string;
        const address = formData.get('address') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const complaint = formData.get('complaint') as string;
        const staffName = formData.get('staffName') as string;

        // Extract files
        const files = formData.getAll('images') as File[];
        const imageUrls: string[] = [];

        // Initialize GridFS
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database not connected");
        }
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

        // Upload files to GridFS
        for (const file of files) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadStream = bucket.openUploadStream(file.name, {
                    metadata: {
                        contentType: file.type,
                    }
                });

                await new Promise((resolve, reject) => {
                    uploadStream.end(buffer);
                    uploadStream.on('finish', resolve);
                    uploadStream.on('error', reject);
                });

                imageUrls.push(`/api/images/${uploadStream.id}`);
            }
        }

        const enquiry = new Enquiry({
            customerName,
            address,
            phoneNumber,
            complaint,
            staffName,
            imageUrls,
        });

        await enquiry.save();

        return NextResponse.json({ success: true, id: enquiry._id });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, enquiries });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
