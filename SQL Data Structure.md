PATE SQL Data Structures
=======================================

Schema
------

### Pet Table

| Column | Data Type | Description |
| --- | --- | --- |
| pet_id | INT | Primary key, unique identifier for a pet |
| owner_id | INT | ID of the owner of the pet |
| owner_first_name | VARCHAR(255) | First name of the owner |
| owner_last_name | VARCHAR(255) | Last name of the owner |
| email | VARCHAR(255) | Email address of the owner |
| password | VARCHAR(255) | Password for the pet owner's account |
| name | VARCHAR(255) | Name of the pet |
| breed | VARCHAR(255) | Breed of the pet |
| age | INT | Age of the pet in years |
| profile_picture | VARCHAR(255) | URL for the profile picture of the pet |
| pet_type | VARCHAR(255) | Type of pet (e.g. dog, cat, bird) |
| bio | VARCHAR(255) | Biography of the pet |
| phone | VARCHAR(255) | Phone number of the owner |
| city | VARCHAR(255) | City where the pet lives |
| country | VARCHAR(255) | Country where the pet lives |
| createdAt | TIMESTAMP | Timestamp for the creation of the pet record |
| updatedAt | TIMESTAMP | Timestamp for the last update to the record |

### Post Table

| Column | Data Type | Description |
| --- | --- | --- |
| post_id | INT | Primary key, unique identifier for a post |
| pet_id | INT | ID of the pet that created the post |
| caption | VARCHAR(255) | Caption or description of the post |
| postImage | VARCHAR(255) | URL for the image associated with the post |
| likes | INT | Number of likes for the post |
| comments | INT | Number of comments for the post |
| createdAt | TIMESTAMP | Timestamp for the creation of the post record |
| updatedAt | TIMESTAMP | Timestamp for the last update to the post record |
| FOREIGN KEY | pet_id | Reference to the pet that created the post |

### Comment Table

| Column | Data Type | Description |
| --- | --- | --- |
| post_id | INT | Primary key, ID of the post the comment is on |
| text | VARCHAR(255) | Text of the comment |
| author | VARCHAR(255) | Name or username of the author of the comment |
| createdAt | TIMESTAMP | Timestamp for the creation of the comment record |

### Following Table

| Column | Data Type | Description |
| --- | --- | --- |
| user_id | INT | ID of the user who is following another pet or user |
| followers_pet_id | INT | ID of the pet or user who is following another pet or user |
| followed_pet_id | INT | ID of the pet or user being followed by another pet or user |
| PRIMARY KEY | user_id, followers_pet_id, followed_pet_id | Primary key, unique combination of three IDs |

Create Pet
-------

`CREATE TABLE pet ( 
    pet_id INT PRIMARY KEY, 
    owner_id INT,
    owner_first_name VARCHAR(255), 
    owner_last_name VARCHAR(255), 
    email VARCHAR(255), 
    password VARCHAR(255), 
    name VARCHAR(255), 
    breed VARCHAR(255), 
    age INT, profile_picture VARCHAR(255), 
    pet_type VARCHAR(255), 
    bio VARCHAR(255), 
    phone VARCHAR(255), 
    city VARCHAR(255), 
    country VARCHAR(255), 
    createdAt TIMESTAMP, 
    updatedAt TIMESTAMP 
);`

Create Post
-------
`
CREATE TABLE post (
    post_id INT PRIMARY KEY,
    user_id INT,
    caption VARCHAR(255),
    postImage VARCHAR(255),
    likes INT,
    comments INT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES pet(pet_id)
);`

Create Comment
-------
`CREATE TABLE comment (
    post_id INT PRIMARY KEY,
    text VARCHAR(255),
    author VARCHAR(255),
    createdAt TIMESTAMP
);`

Create Following
-------
`CREATE TABLE following (
    user_id INT,
    followers_pet_id INT,
    followed_pet_id INT,
    FOREIGN KEY (user_id) REFERENCES pet(pet_id),
    PRIMARY KEY (user_id, followers_pet_id, followed_pet_id)
);`

SQL Queries
===========


### Get all posts:


`SELECT * FROM post;`

### Get posts by pet ID:


`SELECT * FROM post WHERE pet_id = <pet_id>;`

### Get posts by post ID:


`SELECT * FROM post WHERE post_id = <post_id>;`

### Get posts ordered by date:


`SELECT * FROM post ORDER BY createdAt DESC;`

### Get posts ordered by likes:


`SELECT * FROM post ORDER BY likes DESC;`

### Get posts with a specific hashtag:


`SELECT * FROM post WHERE caption LIKE '%#<hashtag>%';`

### Get all pets:



`SELECT * FROM pet;`

### Get all pet IDs:



`SELECT pet_id FROM pet;`

### Get pet by pet ID:



`SELECT * FROM pet WHERE pet_id = <pet_id>;`

### Get a user by email:



`SELECT * FROM pet WHERE email = <email>;`

### Get followers' posts, user posts are not included:



`SELECT * FROM post
INNER JOIN following ON post.pet_id = following.followed_pet_id
WHERE following.followers_pet_id = <followers_pet_id>;`

SQL Mutations
=============


### Create new pet:

`INSERT INTO pet (owner_id, owner_first_name, owner_last_name, email, password, name, breed, age, profile_picture, pet_type, bio, phone, city, country)
VALUES (<owner_id>, '<owner_first_name>', '<owner_last_name>', '<email>', '<password>', '<name>', '<breed>', '<age>', '<profile_picture>', '<pet_type>', '<bio>', '<phone>', '<city>', '<country>');`

### Create new post:


`INSERT INTO post (pet_id, caption, postImage, likes, comments)
VALUES (<pet_id>, '<caption>', '<postImage>', <likes>, '<comments>');`

### Update post:


`UPDATE post SET caption='<new_caption>', likes=<new_likes>, comments='<new_comments>' WHERE post_id=<post_id>;`

### Delete post:

`DELETE FROM post WHERE post_id=<post_id>;`

### Like a post:

`UPDATE post SET likes = likes + 1 WHERE post_id = <post_id>;`

### New comment a post:

`UPDATE post SET comments = CONCAT(comments, '<new_comment>') WHERE post_id = <post_id>;`

### Update pet:

`UPDATE pet SET owner_first_name='<new_owner_first_name>', owner_last_name='<new_owner_last_name>', email='<new_email>', password='<new_password>', name='<new_name>', breed='<new_breed>', age=<new_age>, profile_picture='<new_profile_picture>', pet_type='<new_pet_type>', bio='<new_bio>', phone='<new_phone>', city='<new_city>', country='<new_country>' WHERE pet_id=<pet_id>;`
### Delete pet:

`DELETE FROM pet WHERE pet_id=<pet_id>;`

### Follow a pet:

`INSERT INTO following (user_id, followers_pet_id, followed_pet_id) 
VALUES (<user_id>, <followers_pet_id>, <followed_pet_id>);`

### Unfollow a pet:

`DELETE FROM following WHERE user_id=<user_id> AND followers_pet_id=<followers_pet_id> AND followed_pet_id=<followed_pet_id>;`





