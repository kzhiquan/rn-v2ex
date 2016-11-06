

export const request = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .catch((error) => {
        reject(error);
      });
  });
};