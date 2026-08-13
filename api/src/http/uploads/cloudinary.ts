import { randomUUIDv7 } from "bun"
import { v2 as cloudinary } from "cloudinary"

import { env } from "@/env"

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

export type UploadedFile = {
    url: string
    publicId: string
    resourceType: string
}

export async function uploadBuffer(
    buffer: Buffer,
    options: {
        folder?: string
        publicId?: string
        resourceType?: "auto" | "image" | "raw" | "video"
        mimeType: string
    },
): Promise<UploadedFile> {
    const dataUri = `data:${options.mimeType};base64,${buffer.toString("base64")}`

    const result = await cloudinary.uploader.upload(dataUri, {
        folder: options.folder ?? env.CLOUDINARY_FOLDER,
        public_id: options.publicId ?? randomUUIDv7(),
        resource_type: options.resourceType ?? "auto",
    })

    return { url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type }
}

export async function removeUploadedFile(publicId: string, resourceType: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
