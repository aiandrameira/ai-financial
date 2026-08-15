import { addMonthsUtc } from "./add-months"

export type AmortizationInstallment = {
    number: number
    dueDate: Date
    amount: number
    principalPortion: number
    interestPortion: number
}

function round2(value: number): number {
    return Math.round(value * 100) / 100
}

/**
 * Price (French) amortization system: fixed installment amount, with the
 * interest/principal split shifting over time. The last installment absorbs
 * any rounding drift so the outstanding balance reaches exactly zero.
 */
export function computeAmortizationSchedule(
    principal: number,
    interestRatePercent: number,
    installmentsTotal: number,
    startDate: Date,
): AmortizationInstallment[] {
    const rate = interestRatePercent / 100
    const installmentAmount = rate === 0 ? principal / installmentsTotal : (principal * rate * Math.pow(1 + rate, installmentsTotal)) / (Math.pow(1 + rate, installmentsTotal) - 1)

    const schedule: AmortizationInstallment[] = []
    let balance = principal

    for (let number = 1; number <= installmentsTotal; number++) {
        const interestPortion = round2(balance * rate)
        let principalPortion = round2(installmentAmount - interestPortion)

        if (number === installmentsTotal) {
            principalPortion = round2(balance)
        }

        const amount = round2(principalPortion + interestPortion)
        balance = round2(balance - principalPortion)

        schedule.push({ number, dueDate: addMonthsUtc(startDate, number), amount, principalPortion, interestPortion })
    }

    return schedule
}
