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

// Sorts an array of JSON objects 
function sortList([...list], attribute, ascending = true) {
  return list.sort((a, b) => {
    // Determine if comparison is of characters or numbers
    const isNumeric = !isNaN(a[attribute]) && !isNaN(b[attribute]);
    let valueA, valueB;

    // Compare as numbers
    if (isNumeric) {
      valueA = Number(a[attribute]);
      valueB = Number(b[attribute]);

    // Compare as strings, case-insensitive
    } else {
      valueA = a[attribute].toUpperCase();
      valueB = b[attribute].toUpperCase();
    }

    // Return sort order
    if (valueA < valueB) {
      return ascending === true ? -1 : 1;
    }
    if (valueA > valueB) {
      return ascending === true  ? 1 : -1;
    }
    // Values must be equal
    return 0;
  });
}

export { formatDate, appendOrdinalIndicator, convertFlatSharp, sortList };