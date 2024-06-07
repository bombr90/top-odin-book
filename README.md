# TOP: Odin-Book

The Odin Project - Assignment Odin-Book 

A MERN (Mongo, Express, React, Node) app for demonstrating a full-stack barebones 'social network' application (inspired by Facebook). Users can register an account (email/password), post/comment (text only), add friends, like posts and view friend profiles.

## [Live Demo](https://top-odin-book-frontend.onrender.com/)

## Getting Started*
```
git clone https://github.com/bombr90/top-odin-book.git
cd top-odin-book
npm install
npm run dev
```

>**Note: You'll need to self-host a mongoDB database or have mongoDB atlas account with a valid DB connection string saved as an environmental variable. Create a '.env' file in the root directory in the following format:* 
>- DB_URI = "mongodb+srv://[yourUsername]:[myRealPassword]@cluster0.mongodb.net/blog-api?w=majority"
>- SECRET = [your session secret]
>- SERVER_PORT = [your selected port - default 5000]
>- CLIENT_PORT = [your selected port - default 3000]

>*Also, the git "main" branch is for hosting the app on localhost whereas the "renderProduction" is for hosting the frontend and backend on separate domains*

## Built with
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/) 
- [Node](https://nodejs.dev/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://cloud.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [headlessUI](https://headlessui.com/)
- [Passport](https://www.passportjs.org/)