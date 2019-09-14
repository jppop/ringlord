import { REIService } from './repository/REIService'
import { XI11Service } from './repository/XI11Service'

import { getLogger } from './debugger'

const debug = getLogger();

const service = new REIService();

service.findInfoIndividu("917000001203625464")
  .then((result) => {
    debug("reponse: %O", result);
  })
  .catch(error =>
    console.log(error)
  );

const xi11Service = new XI11Service();
xi11Service.findInfoCotisant("917000001203625464")
  .then((result) => {
    debug("reponse: %O", result);
  })
  .catch(error =>
    console.log(error)
  );

(async () => {
  await new Promise(done => setTimeout(done, 5000));
})();
