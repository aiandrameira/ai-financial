import { Elysia, t } from "elysia"

import { ApiResponse } from "@/http/api/response"
import { ValidationError } from "@/http/errors/errors"
import { removeUploadedFile, uploadBuffer } from "./ai-storage"

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
            const result = await uploadBuffer(buffer, file.name, file.type)

            set.status = 201
            return ApiResponse.item(
                { url: result.url, fileName: file.name, fileId: result.fileId },
                "File uploaded",
                201,
            )
        },
        {
            detail: {
                summary: "Upload a file to AI Storage",
                description:
                    "Multipart/form-data, `file` field. Accepts pdf/png/jpg/jpeg/webp, up to 10MB. Returns the public URL and the AI Storage `fileId` — the caller is responsible for storing them wherever it makes sense (e.g. expense receipt, invoice, loan contract) and for calling DELETE /uploads with `fileId` if the subsequent save fails, avoiding an orphaned file in storage.",
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
            await removeUploadedFile(body.fileId)
            return ApiResponse.success("File removed")
        },
        {
            body: t.Object({
                fileId: t.String({ minLength: 1 }),
            }),
            detail: {
                summary: "Remove a file from AI Storage",
                description:
                    "Used to clean up an orphaned upload — when the file was uploaded successfully but the subsequent save (database record) failed.",
                responses: { 200: { description: "File removed" } },
            },
        },
    )
