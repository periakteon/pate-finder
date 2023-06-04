# Pate Finder

**Pate Finder** is a social media application designed for users who want to share their pets. On this platform, users can share photos and information about their cute pets, discover other users' pets, and interact with them.

Check out to see and try out the deployed/working version of the application: https://pate-finder.vercel.app/

***

# Features

- **Pet Sharing:** Users can share photos and information about their own pets with other users.
- **Exploring:** Users can explore other pets on the platform, like them, and leave comments.
- **Interaction:** Users can interact with other users, leave comments, and follow each other.
- **Customization:** Users can update their profile information.

***

# Screenshots

- **Home Page**: Since all routes except login and register page are protected, users need to log in. For this reason, Homepage contains login and register screens.

![Home Page with Login](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/index%3Alogin.png)
![Home Page with Register](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/index%3Aregister.png)
![When Login is Successful](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/login%20success.png)

- **Edit Your Profile**: Users can edit their profile information, such as their username, email, password, bio and profile picture. (When email or username is already taken, the user is notified. Besides, when email or password is changed, the user is logged out.)

![Edit Profile](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/editprofile.png)
![Edit Profile](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/profile-edit.png)

- **Create a Post**: Users can create a post by uploading a photo and writing a caption. (When the user tries to create a post without uploading a photo, the user is notified.) In this post page, there is a preview of the image that user selected. Users can select a photo by dragging and dropping or by clicking on the dropzone.

![Create a Post](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/create-new-post.png)
![Dropzone](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/dropzone-post.png)

- **Post Modal**: When a user clicks on a post, a modal window opens. In this modal window, users can see the post in detail, like it, and leave comments.

![Post Modal](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/post-modal.png)

- **Scrolling User Profile**: When a user clicks on a username, the user is directed to the user's profile page. In this page, users can see the user's posts, follow the user, and see the user's information. While scrolling, the user can see the user's details in the navbar.

![Scrolling User Profile](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/profile-while-scrolling.png)

- **Profile Detail**: When a user clicks on the details (the place where posts, followers, followings and pet section are located), the user is directed to the profile detail page. In this page, users can see the user's followers, followings and pet. Users can edit their pet information by clicking on the edit button.

![Profile Detail](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/user-detail.png)
![Pet Detail](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/pet-detail.png)
![Pet Edit](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/pet-detail-edit.png)

- **Search Bar and Search Results**: Users can search for other users by typing their username in the search bar. This search bar has an autocomplete feature. When a user clicks on a search result, the user is directed to the user's profile page.

![Search Bar](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/auto-complete-search.png)

- **Explore Users**: Users can explore other users on the platform. In this page, users can see other users' profile.

![Explore Users](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/explore-users.png)

- **Feed**: Users can see the posts of the users they follow in the feed page. This page is protected, so users need to log in to see this page. This feed has an infinite scroll feature. Also, users can like and comment on the posts in this page. When a user clicks on a post, the user is directed to the post modal. When a user clicks on a username, the user is directed to the user's profile page. When a user clicks on a comment, the user is directed to the user's profile page. 

![Infinite Feed](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/infinite-feed.png)
![Post Modal](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/feed-post-detail.png)

- **User Profile**: Users can see the other users' profile. In this page, users can see the user's posts, follow/unfollow the user, and see the user's information. When a user clicks on a post, the user is directed to the post modal.

![User Profile](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/users-profile.png)

- **Add Pet**: If the user does not have a pet, the user can add a pet by clicking on the add pet button. In this page, users can add their pet's information.

![Add Pet](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/add-pet-in-profile.png)
![Add Pet](https://raw.githubusercontent.com/periakteon/pate-finder/main/showcase/add-pet.png)

All of these screenshots are taken in the light mode. There is also a dark mode in this application.

***
# Installation

1. Clone the repository to your computer:

```bash
git clone https://github.com/periakteon/pate-finder.git
```

2. Navigate to the project folder:

```bash
cd pate-finder
```

3. Install the required dependencies:

```bash
npm install
```

4. Create a ```.env``` file based on the ```.env_example``` file, and customize it with your own information.

5. Run the application:

```bash
npm run dev
```

The application will run by default at http://localhost:3000.

There are also scripts in the ```script``` folder where you can test the application.

***

## Technologies

In this project, the following technologies are used:

- [React](https://react.dev): A popular JavaScript library used for building user interfaces.

- [Next.js](https://nextjs.org): A React-based framework that provides features like Server-Side Rendering (SSR) and file-based routing.

- [TypeScript](https://www.typescriptlang.org): A programming language (actually, it is a superset of JavaScript) that adds a strong type system to JavaScript.

- [Prisma](https://www.prisma.io): A modern ORM (Object-Relational Mapping) tool that simplifies database operations.

- [Zod](https://zod.dev): A powerful schema validation library for TypeScript used for data validation and schema generation.

- [Jotai](https://jotai.org): A library used for state management in React applications. It is simpler and faster compared to other state management solutions like Redux.

- [Material Tailwind](https://material-tailwind.com): A UI kit that follows Google's Material Design guidelines. It is used to create fast and beautiful interfaces.

- [Font Awesome](https://fontawesome.com): A library used for customizable icons and symbols. It is preferred for using icons in the application.

- [React Dropzone](https://react-dropzone.js.org): A React component that enables users to upload files by dragging and dropping.

- [React Modal](https://reactcommunity.org/react-modal): A React component used to create modal windows. It provides interactive and focused dialogues.

- [React Toastify](https://fkhadra.github.io/react-toastify): A package used to display notifications to the user. It can create notifications for successful operations, errors, or other important messages.

## Contributing

If you would like to contribute to this project, please open a pull request. We welcome all kinds of contributions!
