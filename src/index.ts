#! /usr/bin/env node

import { program } from 'commander';

import { metaCommand } from './commands/meta';
import { mergeCommand } from './commands/merge';
import { singleCommand } from './commands/single';
import { multiCommand } from './commands/multi';

program.addCommand(singleCommand);
program.addCommand(multiCommand);
program.parse(process.argv);
