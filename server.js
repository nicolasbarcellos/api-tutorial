// import { createServer } from "node:http";

// const server = createServer((req, res) => {

//   return response.end()
// })

// server.listen(3333)

import { fastify } from "fastify";
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

server.post("/videos", async (req, reply) => {
  const { title, description, duration } = req.body;
  await database.create({
    title,
    description,
    duration,
  });

  return reply.status(201).send();
});

server.get("/videos", async (req, reply) => {
  const search = req.query.search;

  const videos = await database.list(search);

  return videos;
});

server.put("/videos/:id", async (req, reply) => {
  const videoId = req.params.id;
  let { title, description, duration } = req.body;

  // const videosList = database.list();

  // const rowIndex = videosList.findIndex((video) => video.id === videoId);

  // if (!title) title = videosList[rowIndex].title;
  // if (!description) description = videosList[rowIndex].description;
  // if (!duration) duration = videosList[rowIndex].duration;

  // if (rowIndex > -1) {
  //   await database.update(videoId, {
  //     ...videosList[rowIndex],
  //     title,
  //     description,
  //     duration,
  //   });

  //   return reply.status(204).send(); // teve sucesso porém sem conteudo na resposta
  // }

  await database.update(videoId, {
    title,
    description,
    duration,
  });

  return reply.status(204).send();
});

server.delete("/videos/:id", (req, reply) => {
  const videoId = req.params.id;
  database.delete(videoId);
  return reply.status(204).send();
});

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
