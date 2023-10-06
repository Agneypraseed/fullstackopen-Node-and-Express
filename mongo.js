const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.vdoiowp.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const PhoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", PhoneBookSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((persons) => {
    persons.map((person) => console.log(person.name + " " + person.number));
    mongoose.connection.close();
    process.exit(1);
  });
} else {
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  person.save().then(() => {
    console.log(`added ${personName} number ${personNumber} to Phonebook`);
    mongoose.connection.close();
  });
}
