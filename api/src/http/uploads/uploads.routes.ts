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
                    "Multipart/form-data, campo `file`. Aceita pdf/png/jpg/jpeg/webp, até 10MB. Devolve a URL pública, o `publicId` e o `resourceType` — quem chama é responsável por guardar a URL onde fizer sentido (ex.: comprovante de despesa, nota fiscal, contrato de financiamento) e por chamar DELETE /uploads com `publicId`/`resourceType` caso o salvamento subsequente falhe, evitando arquivo órfão no storage.",
                responses: {
                    201: { description: "Arquivo enviado" },
                    400: { description: "Arquivo ausente, tipo não suportado, ou maior que 10MB" },
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
                    "Usado para limpar um upload órfão — quando o arquivo foi enviado com sucesso, mas o salvamento subsequente (registro no banco) falhou.",
                responses: { 200: { description: "Arquivo removido" } },
            },
        },
    )
