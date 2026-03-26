/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { isServiceDelivered, staffName } = await req.json();

        const updateData: any = { isServiceDelivered };
        if (staffName !== undefined) {
            updateData.staffName = staffName;
        }

        const enquiry = await Enquiry.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        );

        if (!enquiry) {
            return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, enquiry });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const enquiry = await Enquiry.findById(params.id);

        if (!enquiry) {
            return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
        }

        // Delete associated images in GridFS
        if (enquiry.imageUrls && enquiry.imageUrls.length > 0) {
            const db = mongoose.connection.db;
            if (db) {
                const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });
                for (const url of enquiry.imageUrls) {
                    try {
                        const imageId = url.split('/').pop();
                        if (imageId) {
                            await bucket.delete(new mongoose.Types.ObjectId(imageId));
                        }
                    } catch (e:any) {
                        console.log(e)
                        // Ignore if already deleted or invalid
                    }
                }
            }
        }

        await Enquiry.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

