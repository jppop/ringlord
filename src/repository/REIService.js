import { createClientAsync } from 'soap';

//const endpoint = process.env.SERVICE_REI_REDEVABILITE || 'http://localhost:8088/mockRedevabiliteServiceSOAP?wsdl';
const endpoint = process.env.SERVICE_REI_REDEVABILITE || 'http://localhost:8088/mockModCotServiceSOAP?wsdl';

const options = {
  connection: 'keep-alive'
}

const soapHeader = {};

export class REIService {
  constructor() {
    this.client = createClientAsync(endpoint, options).then((client) => {
      client.addSoapHeader(soapHeader);
      return Promise.resolve(client);
    });
  }

  async findReiIdByContributorId(contributorId) {
    // this.client.then((client) => console.log(client.describe()));
    return this.client.then((client) =>
      client.RechercherRedevabiliteParNumCptExterneAsync({numCptExterne: contributorId}));
  }

  async findIndividuParIdRedevabilite(reiId) {
    // this.client.then((client) => console.log(client.describe()));
    return this.client.then((client) =>
      client.RechercherIndividuParIdRedevabiliteAsync( {idRedevabilite: reiId} ));
  }

  async findInfoIndividu(contributorId) {
    const self = this;
    return self.findReiIdByContributorId(contributorId).then(([result]) => {
      var { idREI } = result.redevabilite;
      return self.findIndividuParIdRedevabilite(idREI);
    }).then( ([result]) => {
      var { individu } = result;
      var infoIndividu = {
        civilite: individu.civilite.codeCivilite,
        nom: individu.nomUsage || individu.nomPatronymique.valeur,
        prenom: individu.prenomUsuel.valeur || individu.prenomsPatronymiques.valeur,
        nir: individu.nir.valeur,
        riba: individu.noRiba.valeur
      }
      return Promise.resolve(infoIndividu);
    });
  }

}
