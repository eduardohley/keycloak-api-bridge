require("dotenv").config();
const fastify = require("fastify")();
const fastifyCron = require("fastify-cron");
const axios = require("axios");
const { defaultError } = require("./schemas/shared");
const { createDefaultEnv } = require("./util/env");
const { getAdminAccessToken } = require("./routes/admin");

fastify.register(require("fastify-cors"), {
  origin: "*",
});

fastify.register(require("./routes/admin").AdminRoutes);
fastify.register(require("./routes/user").UserRoutes);
fastify.register(require("./routes/role").RoleRoutes);

fastify.addSchema(defaultError);

fastify.register(fastifyCron, {
  jobs: [
    {
      cronTime: "*/30 * * * * *",
      onTick: async (server) => {
        await getAdminAccessToken();
      },
    },
  ],
});

const start = async () => {
  try {
    createDefaultEnv();
    fastify.listen(process.env.PORT, "0.0.0.0", async function (err, address) {
      console.log(`Listening on ${address}`);
      fastify.cron.startAllJobs();
      await getAdminAccessToken();
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
