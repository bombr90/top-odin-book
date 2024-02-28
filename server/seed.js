const {faker} = require('@faker-js/faker');

const createLocalUserData = () => {
  try{
    
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({firstName, lastName});

    const obj = {
      email: email,
      displayName: faker.internet.userName({firstName,lastName}),
      firstName: firstName,
      lastName: lastName,
      avatar: faker.image.avatar(),
    };
    return obj
  } catch(err) {
    return err;
  }
}

module.exports = createLocalUserData;