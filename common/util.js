function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports.delay = delay;

function parseEnvNumber(key, defaultValue = 0) {
    const raw = process.env[key];

    if (typeof raw === "undefined") {
        return defaultValue;
    }

    const parsed = parseInt(raw, 10);

    if (Number.isNaN(parsed)) {
        return defaultValue;
    }

    return parsed;
}
module.exports.parseEnvNumber = parseEnvNumber;
