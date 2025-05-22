export const sanitizeData = (data: any[], displayKey?: string): any[] => {
  return data.map((item) => {
    if (typeof item === 'string') {
      return item.replace(/&nbsp;/g, ' ').trim();
    } else if (displayKey && item[displayKey]) {
      return {
        ...item,
        [displayKey]: item[displayKey].replace(/&nbsp;/g, ' ').trim(),
      };
    }
    return item;
  });
};
