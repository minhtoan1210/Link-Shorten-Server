import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
//
import { CurrencyService } from 'src/services/currency.service';
import { OrganizationActionService } from 'src/services/organization_action.service';
import { PlanService } from 'src/services/plan.service';
@Injectable()
export class SeederService {
  constructor(
    private currencyService: CurrencyService,
    private orgActionService: OrganizationActionService,
    private planService: PlanService,
  ) {}

  @Command({ command: 'seed:all', describe: 'Seed all data' })
  async seed_all() {
    await this.seed_currencies();
    await this.seed_plans();
    await this.seed_organization_actions();
  }

  @Command({ command: 'seed:plans', describe: 'Seed plan data' })
  async seed_plans() {
    console.log('Seeding plans, please wait...');
    try {
      let inserted = await this.planService.seed();
      console.log(
        '\x1b[32mSeeding plans completed. Number of plan inserted: \x1b[0m',
        inserted,
      );
    } catch (error) {
      console.error(
        '\x1b[31mFailed when seeding plans: \x1b[0m',
        error.message,
      );
    }
  }

  @Command({ command: 'seed:currencies', describe: 'Seed currency data' })
  async seed_currencies() {
    console.log('Seeding currencies, please wait...');
    try {
      let inserted = await this.currencyService.seed();
      console.log(
        '\x1b[32mSeeding currencies completed. Number of currency inserted: \x1b[0m',
        inserted,
      );
    } catch (error) {
      console.error(
        '\x1b[31mFailed when seeding currencies: \x1b[0m',
        error.message,
      );
    }
  }

  @Command({
    command: 'seed:org_actions',
    describe: 'Seed organization action data',
  })
  async seed_organization_actions() {
    console.log('Seeding organization actions, please wait...');
    try {
      let inserted = await this.orgActionService.seed();
      console.log(
        '\x1b[32mSeeding organization actions completed. Number of organization action inserted: \x1b[0m',
        inserted,
      );
    } catch (error) {
      console.error(
        '\x1b[31mFailed when organization actions: \x1b[0m',
        error.message,
      );
    }
  }
}
