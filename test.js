// const getAllComments = async (req, res) => {
//     try {
//       const comments = await Comment.find({ post: req.params.id }).populate({
//         path: "author",
//         model: "users",
//         select: "username email -_id",
//       });
//       comments.reverse();
//       res.json(comments);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };

//   const getAllPosts = async (req, res) => {
//     const posts = await Post.find({}).populate({
//       path: "author",
//       model: "users",
//       select: "username email -_id"
//     });
//     posts.reverse()
//     res.json(posts);
//   };

//   const getAllLikes = async (req, res) => {
  
//     try {
//       const likes = await Like.find({ post: req.params.id }).populate({
//         path: "author",
//         model: "users",
//         select: "username email -_id",
//       });
//       likes.reverse();
//       res.json(likes);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server error" });
//     }
//   };


  const commentPost = async (req, res) => {
    let comment = {};
    const post = req.body.post;
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    comment.author = userId;
    comment.post = post;
    comment.content = req.body.comment;
    await Comment.create(comment);
    res.json(comment);
  };
  const createPost = async (req, res) => {
    console.log("creating post");
    const post = req.body;
    const newPost = new Post(post);
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    newPost.author = userId;
    await newPost.save();
    console.log("New post created:", newPost);
    res.json(newPost);
  };

  const createLike = async (req, res) => {
    let like = {};
    const post = req.body.post;
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    like.author = userId;
    like.post = post;
    await Like.create(like);
    res.json(like);
  };

    