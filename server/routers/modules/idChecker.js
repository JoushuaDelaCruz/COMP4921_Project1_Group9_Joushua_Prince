const checkLength = (name) => {
  return name.length > 30;
};

const checkDb = (db_function, name) => {
  return db_function(name);
};

const CheckSpecialChar = (name) => {
  const specialCharsAndSpace = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\s]/;
  return specialCharsAndSpace.test(name);
};

exports.checkName = (db_function, name) => {
  if (checkLength(name)) {
    return `The ${name} is too long, please choose another name.`;
  }
  if (checkDb(db_function, name)) {
    return `${name} already exists. Please choose another name.`;
  }
  if (CheckSpecialChar(name)) {
    return `The '${name}' cannot contain special characters and space.`;
  }
  return null;
};
