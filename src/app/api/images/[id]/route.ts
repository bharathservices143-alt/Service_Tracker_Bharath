import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            return new NextResponse('Database connection lost', { status: 500 });
        }
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

        const id = new mongoose.Types.ObjectId(params.id);

        const files = await bucket.find({ _id: id }).toArray();
        if (!files || files.length === 0) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const file = files[0];
        const stream = bucket.openDownloadStream(id);

        // Stream directly to NextResponse via standard ReadableStream wrapper
        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (err) => controller.error(err));
            }
        });

        return new NextResponse(webStream, {
            headers: {
                'Content-Type': (file as any).contentType || file.metadata?.contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
