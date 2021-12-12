import express from "express";

const server = express();

server.get("/games/:id", (req, res) => {
  const { id } = req.params;
  res.send(`game #${id}`);
});

server.listen(3000);