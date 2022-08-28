const bcrypt = require("bcrypt");

export default function hash(unhashpass: string) {
  return bcrypt.hash(unhashpass, 10).then((hash: string) => {
    return hash;
  });
}
