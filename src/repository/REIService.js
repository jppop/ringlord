import { createClientAsync } from 'soap';
import { NotFoundError } from '../errors'

import { getLogger } from '../debugger'

const component = 'rei'
const debug = getLogger(component);

//const endpoint = process.env.SERVICE_REI_REDEVABILITE || 'http://localhost:8088/mockRedevabiliteServiceSOAP?wsdl';
const endpoint = process.env.SERVICE_REI_REDEVABILITE || 'http://localhost:8088/mockModCotServiceSOAP?wsdl';

const options = {
  connection: 'keep-alive'
}

export class REIService {
  constructor() {
    this.clientPromise = createClientAsync(endpoint, options).then((client) => {
      return Promise.resolve(client);
    });
  }

  async findReiIdByContributorId(contributorId) {
    // this.clientPromise.then((client) => console.log(client.describe()));
    return this.clientPromise.then((client) =>
      client.RechercherRedevabiliteParNumCptExterneAsync({numCptExterne: contributorId}));
  }

  async findIndividuParIdRedevabilite(reiId) {
    // this.clientPromise.then((client) => console.log(client.describe()));
    return this.clientPromise.then((client) =>
      client.RechercherIndividuParIdRedevabiliteAsync( {idRedevabilite: reiId} ));
  }

  async findInfoIndividu(contributorId) {
    const self = this;
    return self.findReiIdByContributorId(contributorId).then(([result]) => {
      debug("findReiIdByContributorId result: %o", result);
      if (result == null) {
        return Promise.reject(new NotFoundError(component));
      }
      var { idREI } = result.redevabilite;
      return self.findIndividuParIdRedevabilite(idREI);
    }).then( ([result]) => {
      debug("findIndividuParIdRedevabilite result: %o", result);
      if (result == null) {
        return Promise.reject(new NotFoundError(component));
      }
      var { individu } = result;
      var infoIndividu = {
        civilite: individu.civilite.codeCivilite,
        nom: individu.nomUsage || individu.nomPatronymique.valeur,
        prenom: individu.prenomUsuel.valeur || individu.prenomsPatronymiques.valeur,
        nir: individu.nir.valeur,
        riba: individu.noRiba.valeur
      }
      return Promise.resolve(infoIndividu);
    })
    .catch( (error) => {
      if (error instanceof NotFoundError) {
        return Promise.resolve(null);
      }
      throw error;
    })
  }

}
