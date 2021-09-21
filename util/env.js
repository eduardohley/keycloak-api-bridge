const { existsSync, createWriteStream, writeFileSync, appendFileSync } = require("fs");
const { join } = require("path");

module.exports.createDefaultEnv = () => {
  if (!existsSync(".env")) {
    const logger = createWriteStream(".env", {
      flags: "a",
    });

    logger.write("PORT=8181\n");
    logger.write("KC_SERVER=http://localhost:8180\n");
    logger.write("KC_USERNAME=username\n");
    logger.write("KC_PASSWORD=password\n");
    logger.write("KC_REALM=realm\n");
    logger.write("KC_CLIENT_ID=client\n");
    logger.write("KC_ADMIN_CLI_ID=admin-cli");

    logger.end();

    console.log(".env file created. Restart server.");
  }
};
