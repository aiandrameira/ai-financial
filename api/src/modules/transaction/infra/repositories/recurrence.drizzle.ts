import { and, eq, lte } from "drizzle-orm"

import { db } from "@/db/client"
import { recurrences } from "@/db/schema"

import type { RecurrenceDto } from "../../app/dtos/recurrence.dto"
import type { CreateRecurrenceData, RecurrenceRepository } from "../../domain/repositories/recurrence.repository"

type RecurrenceRow = typeof recurrences.$inferSelect

function toDto(row: RecurrenceRow): RecurrenceDto {
    return {
        id: row.id,
        frequency: row.frequency,
        interval: row.interval,
        startDate: row.startDate,
        endDate: row.endDate,
        nextOccurrence: row.nextOccurrence,
        active: row.active,
    }
}

export class RecurrenceDrizzleRepository implements RecurrenceRepository {
    async create(userId: string, data: CreateRecurrenceData): Promise<RecurrenceDto> {
        const [row] = await db
            .insert(recurrences)
            .values({
                userId,
                frequency: data.frequency,
                interval: data.interval,
                startDate: toDateString(data.startDate),
                endDate: data.endDate ? toDateString(data.endDate) : null,
                nextOccurrence: toDateString(data.nextOccurrence),
            })
            .returning()

        return toDto(row)
    }

    async findDue(userId: string, asOf: Date): Promise<RecurrenceDto[]> {
        const rows = await db
            .select()
            .from(recurrences)
            .where(
                and(
                    eq(recurrences.userId, userId),
                    eq(recurrences.active, true),
                    lte(recurrences.nextOccurrence, toDateString(asOf)),
                ),
            )

        return rows.map(toDto)
    }

    async advance(id: string, nextOccurrence: Date, active: boolean): Promise<void> {
        await db
            .update(recurrences)
            .set({ nextOccurrence: toDateString(nextOccurrence), active, updatedAt: new Date() })
            .where(eq(recurrences.id, id))
    }
}

function toDateString(date: Date): string {
    return date.toISOString().slice(0, 10)
}
