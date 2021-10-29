export const capitalizeFirstLetter = (word: string) => {
  const toLower = word.toLowerCase()
  return toLower.charAt(0).toUpperCase() + toLower.slice(1)
}
