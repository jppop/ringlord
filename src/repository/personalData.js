import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { RedevabiliteService } from './REIService'
import { IndividuService } from './XI11Service'

export class PersonalData extends DataSource {
  constructor() {
    this.redevabiliteService = new RedevabiliteService();
    this.individuService = new IndividuService();
  }

  initialize(config) {
    this.redevabiliteService.initialize(config);
    this.individuService.initialize(config);
  }

  async getPersonalData(contributorId) {
    return this.redevabiliteService.findReiIdByContributorId().then( ({ idIndividu }) => this.individuService.f
  }
}
