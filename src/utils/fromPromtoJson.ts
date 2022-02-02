/**
 * converts the prometheus query to JSON
 */
export function fromPromtoJSON(str: any): any {
  let newStr = str.replaceAll('=', ':');
  let newNewStr = newStr.replaceAll(', ', ', "');
  let thirdOne = newNewStr.replaceAll(':"', '":"');
  let fourthOne = thirdOne.replaceAll('{', '{"');
  let fifthOne = JSON.parse(fourthOne);
  return fifthOne;
}
