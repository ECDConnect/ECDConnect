const isSAIDValid = (idNumber) => {
  let result = (idNumber + '').split('')
    .reverse()
    .reduce((acc, c, i) => {
      if (i % 2 === 1)
        acc.push((c * 2 > 9 ? (c * 2) - 9 : c * 2));
      else
        acc.push(c * 1);
      return acc;
    }, []).reduce((acc, d, i) => acc * 1 + d * 1, 0);
  return result % 10 === 0;
};

export default isSAIDValid;