const fs = require('fs');
const Papa = require('papaparse');
let csvString = fs.readFileSync('/Users/stalinkumar/Desktop/RS 0307-26.csv', 'utf-8');
if (csvString.charCodeAt(0) === 0xFEFF) {
  csvString = csvString.slice(1);
}
const parsed = Papa.parse(csvString, {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: false,
});
console.log(parsed.data[0].Main_Image);
console.log(Object.keys(parsed.data[0]));
