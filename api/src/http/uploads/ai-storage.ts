import { env } from "@/env"

export type UploadedFile = {
    url: string
    fileId: string
}

function assertConfigured() {
    if (!env.AI_STORAGE_API_URL || !env.AI_STORAGE_API_KEY || !env.AI_STORAGE_ENVIRONMENT_ID) {
        throw new Error(
            "AI Storage is not configured — set AI_STORAGE_API_URL, AI_STORAGE_API_KEY and AI_STORAGE_ENVIRONMENT_ID",
        )
    }
}

export async function uploadBuffer(buffer: Buffer, fileName: string, mimeType: string): Promise<UploadedFile> {
    assertConfigured()

    const formData = new FormData()
    formData.append("file", new Blob([buffer], { type: mimeType }), fileName)
    formData.append("environmentId", env.AI_STORAGE_ENVIRONMENT_ID)

    const response = await fetch(`${env.AI_STORAGE_API_URL}/files`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.AI_STORAGE_API_KEY}` },
        body: formData,
    })

    if (!response.ok) {
        throw new Error(`AI Storage upload failed: ${response.status}`)
    }

    const { data } = (await response.json()) as { data: { id: string; url: string } }
    return { url: data.url, fileId: data.id }
}

export async function removeUploadedFile(fileId: string): Promise<void> {
    if (!env.AI_STORAGE_API_URL || !env.AI_STORAGE_API_KEY) return

    const response = await fetch(`${env.AI_STORAGE_API_URL}/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${env.AI_STORAGE_API_KEY}` },
    })

    if (!response.ok && response.status !== 404) {
        console.error(`[ai-storage] falha ao remover arquivo ${fileId}: ${response.status}`)
    }
}
