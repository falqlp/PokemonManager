export function convertStringsToDateInObject(obj: any): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string' && dateRegex.test(obj[key])) {
      obj[key] = new Date(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertStringsToDateInObject(obj[key]);
    }
  });
}
