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

// Determines the value of a compareable for use in sortList
function setCompareable(object, attribute) {
  let comparable;

  // Sort value is within a nested object
  if (attribute.includes('.')) {
    const parts = attribute.split('.');
    const objectName = parts[0];
    const objectAttribute = parts[1];

    // Check for null objects
    if (object[objectName] === null) { return ''; }

    // Object is an array of objects
    else if (Array.isArray(object[objectName])) {
      comparable = object[objectName].map(a => a[objectAttribute]).join(', ');
    }
    // Object is a basic object
    else {
      comparable = object[objectName][objectAttribute] === null ? '' : object[objectName][objectAttribute];
    }
  }

  // Sort value is an attribute of the list
  else {
    comparable = object[attribute] === null ? '' : object[attribute];
  }

  return comparable;
}

// Sorts an array of JSON objects by a passed in attribute
function sortList([...list], attribute, ascending = true) {
  return list.sort((a, b) => {
    // Variables to hold the two compar
    const compareableA = setCompareable(a, attribute);
    const compareableB = setCompareable(b, attribute);

    // Determine if comparison is of characters or numbers
    const isNumeric = !isNaN(compareableA) && !isNaN(compareableB);
    let valueA, valueB;

    // Compare as numbers
    if (isNumeric) {
      valueA = Number(compareableA);
      valueB = Number(compareableB);

    // Compare as strings, case-insensitive
    } else {
      valueA = compareableA.toUpperCase();
      valueB = compareableB.toUpperCase();
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

// Converts a digit to the equivalent Roman numeral, used in displaying Movement Numbers
function numberToRoman(number) {
  if (number < 1 || number > 3999) {
    return number;
  }

  const numeralCodes = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1]
  ];

  let roman = "";
  let num = number;

  numeralCodes.forEach(([letter, value]) => {
    while (num >= value) {
      roman += letter;
      num -= value;
    }
  });

  return roman;
}

export { formatDate, appendOrdinalIndicator, convertFlatSharp, sortList, numberToRoman };