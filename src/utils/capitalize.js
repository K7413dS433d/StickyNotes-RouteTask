// capitalize string
export const capitalize = (s) => {
  const arr = s.toLowerCase().split(" ");
  const res = arr.map((ele, idx) => {
    const newWord = ele[0].toUpperCase() + ele.slice(1);
    return newWord;
  });

  return res.join(" ");
};
