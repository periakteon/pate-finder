PATE SQL Data Structures
=======================================

Schema
------

### Pet Table

| Column | Data Type | Description |
| --- | --- | --- |
| id | INT | Primary key, unique identifier for a pet |
| owner_first_name | VARCHAR(255) | First name of the owner |
| owner_last_name | VARCHAR(255) | Last name of the owner |
| owner_email | VARCHAR(255) | Email address of the owner, Must be unique |
| hash | VARCHAR(255) | Password for the pet owner's account |
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
| id | INT | Primary key, unique identifier for a post |
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
| id | INT | Primary key, unique identifier for a comment |
| post_id | INT | Primary key, ID of the post the comment is on |
| pet_id | INT | Primary key, ID of the pet the comment is on |
| text | VARCHAR(255) | Text of the comment |
| createdAt | TIMESTAMP | Timestamp for the creation of the comment record |
| FOREIGN KEY | pet_id | Reference to the pet that created the post |
| FOREIGN KEY | post_id | Reference to the post |

### Like Table

| Column | Data Type | Description |
| --- | --- | --- |
| id | INT | Primary key, unique identifier for a like |
| pet_id | INT | Primary key, ID of the pet |
| post_id | INT | Primary key, ID of the post |
| createdAt | TIMESTAMP | Timestamp for the creation of the comment record |
| FOREIGN KEY | pet_id | Reference to the pet that created the post |
| FOREIGN KEY | post_id | Reference to the post |

### Following Table

| Column | Data Type | Description |
| --- | --- | --- |
| id | INT | Primary key, unique identifier of the following |
| pet_id | INT | ID of the user who is following another pet or user |
| follows_pet_id | INT | ID of the pet or user follows other pet |
| PRIMARY KEY | pet_id, follows_pet_id | Primary key, unique combination of three IDs |
