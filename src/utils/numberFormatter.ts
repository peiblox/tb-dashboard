export default function getNumber(number: number) {
  return new Intl.NumberFormat('en-US', {}).format(number)
}
