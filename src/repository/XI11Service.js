import { createClientAsync } from 'soap';

const wsdlUrl = process.env.SERVICE_XI11_WSDL || 'http://localhost:8089/mockWS_XI11_V03?wsdl';
const endpoint = process.env.SERVICE_XI11_ENDPOINT || 'http://localhost:8089/mockWS_XI11_V03';

const options = {
  connection: 'keep-alive'
}

const soapHeader = {};

export class XI11Service {
  constructor() {
    this.client = createClientAsync(wsdlUrl, options).then((client) => {
      client.addSoapHeader(soapHeader);
      client.setEndpoint(endpoint);
      return Promise.resolve(client);
    });
  }

  async findInfoCotisant(contributorId) {
    // this.client.then((client) => console.log(client.describe()));
    return this.client.then((client) =>
      client.xi11OperationAsync({
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
      })).then( ([result]) => {
        var { CodeOrganisme, DonneesXi02, DonneesXb03 } = result.xi11Response.xi11ResponseType;
        var infoIndividu = {
          codeOrganisme: CodeOrganisme,
          xi02Data: DonneesXi02,
          xi03Data: DonneesXb03,
        }
        return Promise.resolve(infoIndividu);
      });
  }

}
