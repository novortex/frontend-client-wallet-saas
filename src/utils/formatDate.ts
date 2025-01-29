export function formatDate(
  isoDate: string
): string {
  const date = new Date(isoDate)
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0')
  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, '0') // getMonth() retorna meses de 0 a 11
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
