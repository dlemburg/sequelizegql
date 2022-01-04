const glob = require('glob');

export const getPaths = (src: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const path = process.cwd() + src;

    glob(path, (err, files) => {
      resolve(files);
    });
  });
};
