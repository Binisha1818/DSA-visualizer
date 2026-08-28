export const generateArray = (size = 30) => {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 350) + 20
  );
};