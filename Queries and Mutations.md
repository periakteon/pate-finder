
## On Query and Mutation

Query is a set of operations that can be performed on a server. A query can be used to fetch data from a server, or to perform a mutation.
- `Query` is used to **fetch data** from the server (such as fetching all posts of the user),
- `Mutation` is used to **perform operations** on the server/database (such as creating a new post).

***

### Mutations Table

| **Mutation Name**     	| **Fields**                                                                                                                                                                                                                                                                                                         	| **Returns**                                                                      	|
|-----------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|----------------------------------------------------------------------------------	|
| addPet           	      | name -> String<br>type -> String<br>gender -> String<br>spayed -> Boolean<br>vaccinated -> Boolean<br> breed -> String <br> owner_id -> ID                                                                                                                                                                          | success -> Boolean<br>pet -> Object                                             	|
| updatePet              	| ID -> ID<br>name -> String<br>type -> String<br>gender -> String <br>spayed -> Boolean<br>vaccinated -> Boolean<br> breed -> String                                                                                                                                                                                	| success -> Boolean<br>pet -> Object                                              	|
| deletePet             	| ID -> ID                                                                                                                                                                                                                                                                                                           	| success -> Boolean                                                              	|
| addOwner              	| name -> String<br>email -> String<br>phone -> String                                                                                                                                                                                                                                                      	        | success -> Boolean<br>owner -> Object                                            	|
| addNewMatch            	| pet1_id -> ID<br>pet2_id -> ID<br>match_id                                                                                                                                                                                                                                                                         	| success -> Boolean<br>match -> Object                                            	|
| addNewMessage         	| match_id -> ID<br>sender_id -> ID<br>receiver_id -> ID                                                                                                                                                                                                                                                            	| success -> Boolean<br>text -> String                                             	|

***

### Queries Table

| **Queries**                         	| **Fields**                                  	| **Returns**                                                                   	|
|-------------------------------------	|---------------------------------------------	|-------------------------------------------------------------------------------	|
| getPets                             	| limit -> Number<br>offset -> Number           | [Pet] -> List of Pet objects                                                   	|
| getPetId                            	| petId -> ID                                 	| Pet object                                                                     	|
| getType                              	| type -> String                               	| List of pet type (Dog, Cat)                                                    	|
| getGender                           	| gender -> String                             	| List of pet gender (Disi, Erkek)                                               	|
| getSpayed                           	| spayed -> Boolean                            	| List of spayed status                                                          	|
| getVaccinated                         | vaccinated -> Boolean                       	| List of vaccinated status                                                      	|
| getBreed                             	| breed -> String                             	| List of breeds                                                                	|
| getOwners                           	| limit -> Number<br>offset -> Number           | List of owner objects<br>Total count of owners                                 	|
| getOwnerID                           	| ownerID -> ID                                	| Owner object                                                                  	|
| getPotentialMatches                   | petID -> ID                                 	| List of pets that are potential matches for the specifield pet                	|
| getMessages                          	| match_id -> ID                               	| List of message objects                                                         |
| getLocations                        	| city -> String                               	| List of pet objects in the specified city                                       |
