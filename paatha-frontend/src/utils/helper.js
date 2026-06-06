export function getNaturalImageDimensions(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;

      resolve({
        width,
        height,
        floorplanPath: path,
      });
    };
    image.onerror = (err) => reject(err);

    image.src = path;
  });
}
