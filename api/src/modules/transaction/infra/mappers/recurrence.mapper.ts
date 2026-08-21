import type { recurrences } from "@/db/schema"

import type { RecurrenceDto } from "../../app/dtos"

type RecurrenceRow = typeof recurrences.$inferSelect

export function mapRecurrenceToDto(row: RecurrenceRow): RecurrenceDto {
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
