const isSAIDValid = (idNumber) => {
    let result = (idNumber + '').split('')
        .reverse()
        .reduce((acc, c, i) => {
            if (i % 2 === 1) {
                const even2x = c * 2;
                acc.push((even2x > 9 ? even2x - 9 : even2x));
            }
            else {
                acc.push(c * 1);
            }

            return acc;
        }, []).reduce((acc, d) => acc * 1 + d * 1, 0);

    return result % 10 === 0;
};

export default isSAIDValid;