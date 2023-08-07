const logger = require('logger');
const axios = require('axios');
const dotenv = require('dotenv');
const crypto = require('crypto');

function main() {
  const log = logger.createLogger('panama.log');

  dotenv.config();

  log.info('Starting main application');

  ask(0, log, null)
    .catch(() => {
      log.info('Main fail');
    });
}

async function ask(tryNumber, log, hash) {
  let data = null;

  try {
    log.info(`Trying ${tryNumber}`);
    const request = await axios.get(process.env.VISA_URL);

    data = request.data
  } catch(error) {
    console.log(error);
    log.info(`Error in trying ${tryNumber}`);
  } finally {
    const timeout = 30000;

    let newHash = null;

    if (data) {
      newHash = crypto.createHash('md5').update(data).digest('hex');
    }

    if (hash && newHash !== hash) {
      log.info(data);
    }

    setTimeout(() => {
      ask(tryNumber + 1, log, newHash ?? hash);
    }, timeout);
  }
}

main();