const Post = require("../models/post");
const User = require("../models/user");
// const fs = require('fs');

const PostsController = {
  Index: (req, res) => {
    Post.find()
    .sort({'date': -1})
    .limit(10)
    .exec((err, posts) => {
      if (err) {
        throw err;
      }
      
      // Figure out how to add turnary in and how to render stock image properly...
      Promise.all( posts.map( (post) => {
        return User.findById(post.userID)
        .then((result) => {
          return {
            message: post.message,
            userName: post.userName,
            photo: {
              contentType: result.photo.contentType,
              data: result.photo.data.toString('base64')
            }
          }
        })
      })).then((output) => {
        res.render("posts/index", { posts: output, newUser: false});
      })
    })
  },
  
  New: (req, res) => {
    res.render("posts/new", { newUser: false });
  },

  Update: (req, res) => {
    Post.findOneAndUpdate(
      {_id: req.body.id},
      {$push:
        {comments: req.body.comments}
      },
      (err, result)=>{
      console.log(err);
      console.log(result);
      res.status(201).redirect("/posts");
    });  
  },
  Create: (req, res) => {
    const post = new Post({ 
      message: req.body.message,
      userID: req.session.userID,
      userName: req.session.userName
    });
    post.save((err) => {
      if (err) {
        throw err;
      }

      res.status(201).redirect("/posts");
    });
  },
  Delete: (req, res) => {
    Post.findOneAndDelete(
      {_id: req.body.id},
      (err, result)=>{
      console.log(err);
      console.log(result);
      res.status(201).redirect("/posts");
    });  
  },
};

module.exports = PostsController;
