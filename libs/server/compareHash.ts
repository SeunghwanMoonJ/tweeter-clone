const bcrypt = require("bcrypt");

export default function compareHash(plainPass: string, hashedPass: string) {
  return bcrypt.compare(plainPass, hashedPass).then((result: boolean) => {
    return result;
  });
}
