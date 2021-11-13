const dotenv = require("dotenv");

dotenv.config();

const dependencies = require("./dependencies");
const Application = require("./Application");

async function main() {
    const app = new Application({ dependencies });
    await app.start();
}

main().catch((err) => console.log(err));

process.on("unhandledRejection", (reason) => {
    console.log(reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.log(error);
    process.exit(1);
});
