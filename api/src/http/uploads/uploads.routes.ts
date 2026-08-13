import { Elysia, t } from "elysia"

import { ApiResponse } from "@/http/api/response"
import { ValidationError } from "@/http/errors/errors"
import { removeUploadedFile, uploadBuffer } from "./cloudinary"

const ALLOWED_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "webp"])
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const uploadRoutes = new Elysia({ prefix: "/uploads", tags: ["Uploads"] })
    .post(
        "/",
        async ({ request, set }) => {
            const formData = await request.formData()
            const file = formData.get("file")

            if (!(file instanceof File)) {
                throw new ValidationError("No file provided")
            }

            const ext = (file.name.split(".").pop() ?? "").toLowerCase()
            if (!ALLOWED_EXTENSIONS.has(ext)) {
                throw new ValidationError("Unsupported file type — allowed: pdf, png, jpg, jpeg, webp")
            }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                throw new ValidationError("File too large — max 10MB")
            }

            const buffer = Buffer.from(await file.arrayBuffer())
            const result = await uploadBuffer(buffer, { mimeType: file.type, resourceType: "auto" })

            set.status = 201
            return ApiResponse.item(
                { url: result.url, fileName: file.name, publicId: result.publicId, resourceType: result.resourceType },
                "File uploaded",
                201,
            )
        },
        {
            detail: {
                summary: "Upload a file to Cloudinary",
                description:
                    "Multipart/form-data, `file` field. Accepts pdf/png/jpg/jpeg/webp, up to 10MB. Returns the public URL, the `publicId`, and the `resourceType` — the caller is responsible for storing the URL wherever it makes sense (e.g. expense receipt, invoice, loan contract) and for calling DELETE /uploads with `publicId`/`resourceType` if the subsequent save fails, avoiding an orphaned file in storage.",
                responses: {
                    201: { description: "File uploaded" },
                    400: { description: "Missing file, unsupported type, or larger than 10MB" },
                },
            },
        },
    )
    .delete(
        "/",
        async ({ body }) => {
            await removeUploadedFile(body.publicId, body.resourceType)
            return ApiResponse.success("File removed")
        },
        {
            body: t.Object({
                publicId: t.String({ minLength: 1 }),
                resourceType: t.String({ minLength: 1 }),
            }),
            detail: {
                summary: "Remove a file from Cloudinary",
                description:
                    "Used to clean up an orphaned upload — when the file was uploaded successfully but the subsequent save (database record) failed.",
                responses: { 200: { description: "File removed" } },
            },
        },
    )
