const IndianRupeeFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })

export function formattedNumber(_num: number | string) {
    const num = Number(_num)
    return IndianRupeeFormatter.format(num)
}
