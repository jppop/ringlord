import { createClientAsync } from 'soap'
import { getLogger } from '../debugger'

const debug = getLogger('xi11');

const wsdlUrl = process.env.SERVICE_XI11_WSDL || 'http://localhost:8089/mockWS_XI11_V03?wsdl';
const endpoint = process.env.SERVICE_XI11_ENDPOINT || 'http://localhost:8089/mockWS_XI11_V03';

const options = {
  connection: 'keep-alive'
}

export class XI11Service {
  constructor(authProvider) {
    this.authProvider = authProvider;
    this.clientPromise = createClientAsync(wsdlUrl, options).then((client) => {
      client.setEndpoint(endpoint);
      return Promise.resolve(client);
    });
  }

  async findInfoCotisant(contributorId) {
    var self = this;
    // this.client.then((client) => console.log(client.describe()));
    return self.clientPromise.then((client) => {
      if (self.authProvider) {
        client.addHttpHeader('Authorization', self.authProvider());
      }
      return client.xi11OperationAsync({
        xi11Request: {
          xi11RequestType: {
            TypeMiseAJour: '10',
            TypeIdentifiantEntree: 'NumeroExterneCompte',
            IdentifiantEntree: contributorId,
            TypeRecherche: '1100',
            ValeurCode: 1
          }
        }
      }, {
        timeout: 8000
      })}
    ).then(([result]) => {
      var { CodeOrganisme, DonneesXi02, DonneesXb03 } = result.xi11Response.xi11ResponseType;
      var infoIndividu = {
        codeOrganisme: CodeOrganisme,
        xi02Data: DonneesXi02,
        xi03Data: DonneesXb03,
      }
      debug("XI11 result: %o", infoIndividu);
      return Promise.resolve(infoIndividu);
    });
  }

}
