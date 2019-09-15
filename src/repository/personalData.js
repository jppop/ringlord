import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server-errors';
import { REIService } from './REIService'
import { XI11Service } from './XI11Service'
import { PersonalDataCache } from './personalDataCache'

export class PersonalDataService extends DataSource {
  constructor() {
    super();
    this.reiService = new REIService();
    this.xi11Service = new XI11Service();
  }

  initialize(config) {
    this.context = config.context;
    this.cache = new PersonalDataCache(config.cache);
  }

  async getPersonalData(contributorId) {
    var self = this;
    return self.xi11Service.findInfoCotisant(contributorId)
      .then((xi11Result) => PersonalDataService.personalDataFromXI11(xi11Result))
      .then(async (partialPersonalData) => {
        return self.reiService.findInfoIndividu(contributorId).then((reiResult) => {
          return { ...partialPersonalData, ...PersonalDataService.personalDataFromREI(reiResult) };
        });
      })
      .catch( (error) => {
        throw new ApolloError(error.message, 'PERSONAL_DATA_SERVICE');
      })
  }

  static personalDataFromXI11(xi11Result) {
    let { xi02Data } = xi11Result;
    return {
      contributorId: xi02Data.NumeroExterneCompte,
      siret: xi02Data.Siret,
      riba: xi02Data.RIBA,
      phones: [{
        type: xi02Data.ContactRSI.TypeTel1,
        phone: xi02Data.ContactRSI.Tel1
      }, {
        type: xi02Data.ContactRSI.TypeTel2,
        phone: xi02Data.ContactRSI.Tel2
      }, {
        type: 'main',
        phone: xi02Data.NumeroTelephoniqueCorrespondant
      }
      ],
      address: {
        recipient: xi02Data.DenominationPersonne1,
        moreRecipient: xi02Data.ComplementAdresseCorrespondance,
        building: xi02Data.NumeroVoieCorrespondance,
        street: xi02Data.NatureVoieCorrespondance + ' ' + xi02Data.NomVoieCorrespondance,
        postalCode: "" + xi02Data.Partie1CodePostalCorrespondance + xi02Data.Partie2CodePostalCorrespondance,
        city: xi02Data.BureauDistributeurCorrespondance
      }
    }
  }

  static personalDataFromREI(reiResult) {
    return {
      title: PersonalDataService.title(reiResult.civilite),
      firstName: reiResult.prenom,
      lastName: reiResult.nom,
      nir: reiResult.nir,
      riba: reiResult.riba
    }
  }

  static title(cicivilite) {
    switch (cicivilite) {
      case 1:
        return "Monsieur";
      case 2:
      case 3:
        return "Madame";
      default:
        return '';

    }
  }
}
