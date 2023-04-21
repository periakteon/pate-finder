# DB Structures for MongoDB

### User Schema:

```js

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  country: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

```
***

### Pet Schema:

```js

const petSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true
  },
  petBio: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    required: true
  },
  petBreed: {
    type: String,
    required: true
  },
  petAge: {
    type: Number,
    required: true
  },
  petWeight: {
    type: Number,
    required: true
  },
  petGender: {
    type: String,
    required: true
  },
  petColor: {
    type: String,
    required: true
  },
  petSpayed: {
    type: Boolean,
    default: false
  },
  petVaccinated: {
    type: Boolean,
    default: false
  },
  petMicrochipped: {
    type: Boolean,
    default: false
  },
  petDietaryRestrictions: {
    type: String,
    default: ""
  },
  petAllergies: {
    type: String,
    default: ""
  },
  petMedications: {
    type: String,
    default: ""
  },
  petBehaviorIssues: {
    type: String,
    default: ""
  },
  petSpecialNeeds: {
    type: String,
    default: ""
  },
  petNotes: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Pet = mongoose.model('Pet', petSchema);

```

***
***

# DB Structures for SQL

### User Table:

```sql

CREATE TABLE users (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address1 VARCHAR(100),
  address2 VARCHAR(100),
  city VARCHAR(50),
  state VARCHAR(50),
  zipCode VARCHAR(20),
  country VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

***

### Pet Table:

```sql

CREATE TABLE pets (
  petId INT PRIMARY KEY AUTO_INCREMENT,
  petName VARCHAR(255) NOT NULL,
  petBio TEXT NOT NULL,
  petType VARCHAR(255) NOT NULL,
  petBreed VARCHAR(255) NOT NULL,
  petAge INT NOT NULL,
  petWeight FLOAT NOT NULL,
  petGender ENUM('male', 'female', 'other') NOT NULL,
  petColor VARCHAR(255) NOT NULL,
  petSpayed BOOLEAN DEFAULT FALSE,
  petVaccinated BOOLEAN DEFAULT FALSE,
  petMicrochipped BOOLEAN DEFAULT FALSE,
  petDietaryRestrictions TEXT DEFAULT '',
  petAllergies TEXT DEFAULT '',
  petMedications TEXT DEFAULT '',
  petBehaviorIssues TEXT DEFAULT '',
  petSpecialNeeds TEXT DEFAULT '',
  petNotes TEXT DEFAULT '',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

***
***
***

# Queries and Mutations

### SQL Queries

Fetch all users:

```sql

SELECT * FROM users;

```

Fetch a single user:

```sql

SELECT * FROM users WHERE userId = 1;

```

Fetch a user by email:

```sql

SELECT * FROM users WHERE email = 'example@example.com';

```

Fetch all pets:

```sql

SELECT * FROM pets;

```

Fetch a single pet:

```sql

SELECT * FROM pets WHERE petId = 1;

```

Fetch all pets for a user:

```sql

SELECT * FROM pets WHERE userId = 1;

```

***

### SQL Mutations

Create a new user:

```sql

INSERT INTO users (firstName, lastName, email, password, phone, address1, address2, city, state, zipCode, country)
VALUES ('John', 'Doe', 'johndoe@example.com', 'password123', '123-456-7890', '123 Main St', 'Apt 4B', 'Anytown', 'NY', '12345', 'USA');

```

Create a new pet:

```sql

INSERT INTO pets (petName, petBio, petType, petBreed, petAge, petWeight, petGender, petColor, petSpayed, petVaccinated, petMicrochipped, petDietaryRestrictions, petAllergies, petMedications, petBehaviorIssues, petSpecialNeeds, petNotes)
VALUES ('Karamel', 'Üsküdarlı', 'Cat', 'Tekir', 1, 3, 'Female', 'White / Caramel', '1', '1', '1', 'None', 'None', 'None', 'None', 'None', 'Cute as a button!');

```

Update a user:

```sql

UPDATE users SET firstName = 'Jane', lastName = 'Doe' WHERE userId = 1;

```

Update a pet:

```sql

UPDATE pets SET
  petName = 'Saki',
  petBio = 'A friendly and playful dog',
  petType = 'Dog',
  petBreed = 'Labrador Retriever',
  petAge = 2,
  petWeight = 30,
  petGender = 'Male',
  petColor = 'Golden',
  petSpayed = 1,
  petVaccinated = 1,
  petMicrochipped = 1,
  petDietaryRestrictions = 'Kuru mama',
  petAllergies = 'None',
  petMedications = 'None',
  petBehaviorIssues = 'None',
  petSpecialNeeds = 'None',
  petNotes = 'Loves playing fetch and going for walks'
WHERE petId = 1;

```

Delete a user:

```sql

DELETE FROM users WHERE userId = 1;

```

Delete a pet:

```sql

DELETE FROM pets WHERE petId = 1;

```

***
***

### MongoDB Queries

Fetch all users:

```js

User.find({});

```

Fetch a single user:

```js

User.findById('5f9c1b9b9c9c9c9c9c9c9c9c');

```

Fetch a user by email:

```js

User.findOne({ email: 'masum@masum.com' });

```

Fetch all pets:

```js

Pet.find({});

```

Fetch a single pet:

```js

Pet.findById('5f9c1b9b9c9c9c9c9c9c9c9c');

```

Fetch all pets for a user:

```js

Pet.find({ userId: '5f9c1b9b9c9c9c9c9c9c9c9c' });

```

Feth all pets for a user by pet type:

```js

Pet.find({ userId: '5f9c1b9b9c9c9c9c9c9c9c9c', petType: 'Dog' });

```

***

### MongoDB Mutations

Create a new user:

```js

const newUser = new User({
  firstName: 'John',
  lastName: 'Doe',
  email: '
  password: 'password123',
  phone: '123-456-7890',
  address1: '123 Main St',
  address2: 'Apt 4B',
  city: 'Anytown',
  state: 'NY',
  zipCode: '12345',
  country: 'USA'
});

newUser.save();

```

Create a new pet:

```js

const createPet = async (req, res) => {
  try {
    const newPet = await Pet.create({
      petName: req.body.petName,
      petBio: req.body.petBio,
      petType: req.body.petType,
      petBreed: req.body.petBreed,
      petAge: req.body.petAge,
      petWeight: req.body.petWeight,
      petGender: req.body.petGender,
      petColor: req.body.petColor,
      petSpayed: req.body.petSpayed,
      petVaccinated: req.body.petVaccinated,
      petMicrochipped: req.body.petMicrochipped,
      petDietaryRestrictions: req.body.petDietaryRestrictions,
      petAllergies: req.body.petAllergies,
      petMedications: req.body.petMedications,
      petBehaviorIssues: req.body.petBehaviorIssues,
      petSpecialNeeds: req.body.petSpecialNeeds,
      petNotes: req.body.petNotes,
    });
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: `Could not create pet: ${error.message}` });
  }
};

```

Update a user:

```js

User.findByIdAndUpdate('5f9c1b9b9c9c9c9c9c9c9c9c', {
  firstName: 'Jane',
  lastName: 'Doe'
});

```

Update a pet:

```js

Pet.findByIdAndUpdate(petId, {
  petName: 'Max',
  petBio: 'A friendly and playful dog',
  petType: 'Dog',
  petBreed: 'Labrador Retriever',
  petAge: 2,
  petWeight: 30,
  petGender: 'Male',
  petColor: 'Golden',
  petSpayed: true,
  petVaccinated: true,
  petMicrochipped: true,
  petDietaryRestrictions: 'None',
  petAllergies: 'None',
  petMedications: 'None',
  petBehaviorIssues: 'None',
  petSpecialNeeds: 'None',
  petNotes: 'Loves playing fetch and going for walks'
}, { new: true });

```

Delete a user:

```js

User.findByIdAndDelete('5f9c1b9b9c9c9c9c9c9c9c9c');

```

Delete a pet:

```js

Pet.findByIdAndDelete('5f9c1b9b9c9c9c9c9c9c9c9c');

```
