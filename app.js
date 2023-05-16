const express = require("express");
const axios = require("axios");

const app = express();

app.get("/merged-data", async (req, res) => {
  try {
    const [photosResponse, usersResponse, postsResponse] = await Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/photos"),
      axios.get("https://jsonplaceholder.typicode.com/users"),
      axios.get("https://jsonplaceholder.typicode.com/posts"),
    ]);

    const photos = photosResponse.data;
    const users = usersResponse.data;
    const posts = postsResponse.data;

    // Merge the data based on a common identifier (e.g., userId)
    const mergedData = posts.map((post) => {
      const user = users.find((user) => user.id === post.userId);
      const photo = photos.find((photo) => photo.id === post.id);

      return {
        id: post.id,
        title: post.title,
        body: post.body,
        user,
        photo,
      };
    });

    res.json(mergedData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
