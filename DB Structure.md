# DB Structures for MongoDB

### User Collection/Schema:

```js
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
    unique: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  following: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  followers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  ownedPets: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
    default: [],
  },
  bio: {
    type: String,
    default: "",
  },
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    default: [],
  },
  posts: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    default: [],
  },
  phone: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
```

---

### Pet Collection/Schema:

```js
const petSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  petName: {
    type: String,
    required: true,
  },
  petPicture: {
    type: String,
    required: true,
  },
  petBio: {
    type: String,
    required: true,
  },
  petType: {
    type: String,
    required: true,
  },
  petBreed: {
    type: String,
    required: true,
  },
  petAge: {
    type: Number,
    required: true,
  },
  petWeight: {
    type: Number,
    required: true,
  },
  petGender: {
    type: String,
    required: true,
  },
  petColor: {
    type: String,
    required: true,
  },
  petSpayed: {
    type: Boolean,
    default: false,
  },
  petVaccinated: {
    type: Boolean,
    default: false,
  },
  petMicrochipped: {
    type: Boolean,
    default: false,
  },
  petDietaryRestrictions: {
    type: [String],
    default: [],
  },
  petAllergies: {
    type: [String],
    default: [],
  },
  petMedications: {
    type: [String],
    default: [],
  },
  petBehaviorIssues: {
    type: [String],
    default: [],
  },
  petSpecialNeeds: {
    type: [String],
    default: [],
  },
  petHistory: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Pet = mongoose.model("Pet", petSchema);
```

---

### Pet Collection/Schema:

```js

const postSchema = new mongoose.Schema({
  // owner of the post
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postImage: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedPet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  comments: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const Post = mongoose.model('Post', postSchema);
```

***

### Comment Collection/Schema:

```js

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

```

***
***

# DB Structures for SQL

### User Table:

```sql

CREATE TABLE IF NOT EXISTS user (
  user_id CHAR(24) NOT NULL UNIQUE PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  profile_picture VARCHAR(200) NOT NULL,
  bio TEXT DEFAULT "",
  phone VARCHAR(20),
  city VARCHAR(50),
  country VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

```
***

### User Followers Table:

```sql

CREATE TABLE IF NOT EXISTS user_follower (
  user_id CHAR(24) NOT NULL,
  follower_id CHAR(24) NOT NULL,
  PRIMARY KEY (user_id, follower_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (follower_id) REFERENCES user(user_id) ON DELETE CASCADE
);

```

***

### User Following Table:

```sql

CREATE TABLE IF NOT EXISTS user_following (
  user_id CHAR(24) NOT NULL,
  following_id CHAR(24) NOT NULL,
  PRIMARY KEY (user_id, following_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES user(user_id) ON DELETE CASCADE
);

```

***

### User Owned Pets Table:

```sql

CREATE TABLE IF NOT EXISTS user_owned_pet (
  user_id CHAR(24) NOT NULL,
  pet_id CHAR(24) NOT NULL,
  PRIMARY KEY (user_id, pet_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE
);

```

### User's Comments Table:

```sql

CREATE TABLE IF NOT EXISTS user_comment (
  user_id CHAR(24) NOT NULL,
  comment_id CHAR(24) NOT NULL,
  PRIMARY KEY (user_id, comment_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE
);

```

### User's Posts Table:

```sql

CREATE TABLE IF NOT EXISTS user_post (
  user_id CHAR(24) NOT NULL,
  post_id CHAR(24) NOT NULL,
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);

```

---

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

---

---

---

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

---

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

---

---

### MongoDB Queries

Fetch all users:

```js
User.find({});
```

Fetch a single user:

```js
User.findById("5f9c1b9b9c9c9c9c9c9c9c9c");
```

Fetch a user by email:

```js
User.findOne({ email: "masum@masum.com" });
```

Fetch all pets:

```js
Pet.find({});
```

Fetch a single pet:

```js
Pet.findById("5f9c1b9b9c9c9c9c9c9c9c9c");
```

Fetch all pets for a user:

```js
Pet.find({ userId: "5f9c1b9b9c9c9c9c9c9c9c9c" });
```

Feth all pets for a user by pet type:

```js
Pet.find({ userId: "5f9c1b9b9c9c9c9c9c9c9c9c", petType: "Dog" });
```

---

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
User.findByIdAndUpdate("5f9c1b9b9c9c9c9c9c9c9c9c", {
  firstName: "Jane",
  lastName: "Doe",
});
```

Update a pet:

```js
Pet.findByIdAndUpdate(
  petId,
  {
    petName: "Max",
    petBio: "A friendly and playful dog",
    petType: "Dog",
    petBreed: "Labrador Retriever",
    petAge: 2,
    petWeight: 30,
    petGender: "Male",
    petColor: "Golden",
    petSpayed: true,
    petVaccinated: true,
    petMicrochipped: true,
    petDietaryRestrictions: "None",
    petAllergies: "None",
    petMedications: "None",
    petBehaviorIssues: "None",
    petSpecialNeeds: "None",
    petNotes: "Loves playing fetch and going for walks",
  },
  { new: true },
);
```

Delete a user:

```js
User.findByIdAndDelete("5f9c1b9b9c9c9c9c9c9c9c9c");
```

Delete a pet:

```js
Pet.findByIdAndDelete("5f9c1b9b9c9c9c9c9c9c9c9c");
```
