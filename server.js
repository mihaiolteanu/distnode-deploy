import server from "fastify";
import Recipeee from "./recipe.js";
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8000;

server()
  .get("/", async (req, reply) => {
    return "Hello from Distributed Node.js!\n";
  })
  .get("/recipes/:id", async (req, reply) => {
    const recipe = new Recipeee(req.params.id);
    await recipe.hydrate();
    return recipe;
  })
  .listen({ port: PORT, address: HOST }, (err, host) => {
    console.log(`Server running at ${host}`);
  });
