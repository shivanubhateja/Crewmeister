import yargs from 'yargs';
import { printAllLeavePlans } from '../services/LeaveManagement';

yargs.command({
    command: 'all-absencees',
    desc: 'Get List Of All Absencees',
    handler: async (argv) => {
        await printAllLeavePlans();
    }
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv
