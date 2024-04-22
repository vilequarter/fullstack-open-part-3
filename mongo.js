const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('missing argument ([password] [name?] [number?]');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const db = 'phonebookApp';

const url = `mongodb+srv://vilequarter:${password}@cluster0.thnxixa.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  newPerson.save().then(() => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (!(name || number)) {
  console.log('phonebook:');
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  console.log('missing name or number');
  process.exit(1);
}
