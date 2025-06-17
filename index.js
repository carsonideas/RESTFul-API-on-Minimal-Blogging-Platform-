import express from "express";
import { PrismaClient } from "@prisma/client";

import { validateMyUser } from "./users.js";

import { validateMyPost } from "./posts.js";

const app = express();

app.use(express.json());

const client = new PrismaClient();

app.get("/", (_req, res) => {
  res.send(
    "<h1>HOUSTON !! Welcome to my webpage about posts and users! Yikes.........</h1>",
  );
});

console.log("HOUSTON, Are we on! Are we ok!!");

// my  users  section

app.get("/users", async (_req, res) => {
  try {
    const users = await client.user.findMany();
    res.status(200).json(users);
  } catch {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong fetching users!! noooo!!!!",
      });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await client.user.findUnique({
      where: { id },
    });

    if (user) {
      const posts = await client.post.findMany({
        where: {
          authorId: id,
          isDeleted: false,
        },
      });
    } else {
      res.status(404).json({ message: "HOUSTON! User not foundd!! noooo!!!!" });
    }
  } catch {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong fetching user!! noooo!!!!",
      });
  }
});

app.post("/users", validateMyUser, async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, username } = req.body;

    const user = await client.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
      },
    });

    res.status(201).json(user);
  } catch (e) {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong creating user!! noooo!!!!",
      });
  }
});

//my  posts  section

// app.get("/posts", async (req, res) => {
//   try {
//     const posts = await client.post.findMany({
//       where: {
//         isDeleted: false,
//       }
//     });

//     const  postsWithMySelectedAuthors = await Promise.all(
//       posts.map(async (post) => {
//         const mySelectedAuthor  = await client.user.findUnique({
//           where: {
//             id: post.authorId
//         }
//         });

//         return { ...post, mySelectedAuthor  };
//       })
//     );

//     res.status(200).json( postsWithMySelectedAuthors);
//   } catch {
//     res
//       .status(500)
//       .json({ message: "HOUSTON! something went wrong fetching posts!! noooo!!!!" });
//   }
// });


// one must specifciy the path, its nagging !!


app.get("/posts", async (_req, res) => {
  try {
    const posts = await client.post.findMany({
      where: {
        isDeleted: false,
      },
    });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    const postsWithMySelectedAuthors = [];

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      const author = await client.user.findUnique({
        where: { id: post.authorId },
      });

      //to solve my issue, i use .push to add the next post to the array so as to display all posts.
      // this will allow me to see all the data from the users and then i will add my title ,id,content, created at and updatede at

      postsWithMySelectedAuthors.push({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        lastUpdated: post.lastUpdated,
        
        author: {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          username: author.username,
        },
      });
    }

    res.status(200).json(postsWithMySelectedAuthors);
  } catch {
    res.status(500).json({
      message: "HOUSTON! something went wrong fetching posts!! noooo!!!!",
    });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await client.post.findUnique({
      where: {
        id,
        // as we ssaid in es6 shortforms
      },
    });

    const mySelectedAuthor = await client.user.findUnique({
      where: {
        id: post.authorId,
      },
    });
    res.status(200).json({ ...post, mySelectedAuthor });
  } catch (e) {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong fetching posts!! noooo!!!!",
      });
  }
});

app.post("/posts", validateMyPost, async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const mySelectedAuthor = await client.user.findUnique({
      where: { id: authorId },
    });

    const post = await client.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    const postWithMySelectedAuthor = { ...post, mySelectedAuthor };

    res.status(201).json(postWithMySelectedAuthor);
  } catch {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong creating post!! noooo!!!!",
      });
  }
});

app.put("/posts/:id", validateMyPost, async (req, res) => {
  try {
    const { title, content } = req.body;

    const { id } = req.params;

    const postWithMySelectedAuthor = { ...post, mySelectedAuthor };

    const post = await client.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    const mySelectedAuthor = await client.user.findUnique({
      where: {
        id: post.authorId,
      },
    });

    res.status(200).json(postWithMySelectedAuthor);
  } catch {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong updating post!! noooo!!!!",
      });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await client.post.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      message: "HOUSTON! the post has been deleted successfully..! YIKES..",
    });
  } catch {
    res
      .status(500)
      .json({
        message: "HOUSTON! something went wrong deleting post!! noooo!!!!",
      });
  }
});

// my houston portieeeeeeeeee! Yikes bitches

const port = process.env.PORT || 4100;

app.listen(port, () => {
  console.log(
    `HOUSTON, oooh, yeah!!  My server is up and running on port ${port}! YIKES.........!`,
  );
});


