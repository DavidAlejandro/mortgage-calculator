export const formatNumberWithCommas = (num: number | string): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const replaceNonDigitCharacters = (str: string): string => {
  const numbersStr = str.replace(/\D/g, "");
  return numbersStr;
};
