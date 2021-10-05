/**
 Utility function to split a string into an array of strings 
 whenever a blank space is encountered
 * 
 */

export const toSentenceCase = (word: string) => {
  // convert all alphabetic strings to lowercase
  const toLower = word.toLowerCase()
  const arr = toLower.split(' ')

  //loop through each element of the array and capitalize the first letter.
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  //Join all the elements of the array back into a string
  //using a blankspace as a separator
  const newWord = arr.join(' ')

  return newWord
}
