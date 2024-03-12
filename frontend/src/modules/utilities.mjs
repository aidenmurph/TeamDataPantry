// Formats a date to YYYY-MM-DD to be passed into <input> fields of type "date"
function formatDate(inputDate) 
{
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Appends an ordinal indicator to a number based on the last digit
function appendOrdinalIndicator(inputNumber)
{
  let numStr = inputNumber;
  switch(parseInt(numStr[numStr.length - 1])) {
    case 1:
      numStr += 'st'; break;
    case 2:
      numStr += 'nd'; break;
    case 3:
      numStr += 'rd'; break;
    default:
      numStr += 'th';
  }
  return numStr;
}

// Converts occurences of " flat" and " sharp" in key signatures to their notaional symbol
function convertFlatSharp(inputString) {
  if (!inputString) { return; };
  return inputString.replace(/ flat/g, "♭").replace(/ sharp/g, "♯");
}

export { formatDate, appendOrdinalIndicator, convertFlatSharp };