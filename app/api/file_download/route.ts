import { NextResponse } from 'next/server';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('fileKey');

    if (!fileKey) {
      return new NextResponse('Missing file key', { status: 400 });
    }

    const cred = {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? "",
      secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? ""
    }
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials:  cred 
    })

    const { Body, ContentType } = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
      })
    );

    if (!Body) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileData = await Body.transformToByteArray();
    const fileName = fileKey.split('/').pop() || fileKey;

    return new NextResponse(Buffer.from(fileData), {
      headers: {
        'Content-Type': ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Download failed', { status: 500 });
  }
}