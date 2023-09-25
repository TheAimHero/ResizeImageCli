#! /usr/bin/env node

import { program } from 'commander';

import { resizeCommand } from './commands/resize';

program.addCommand(resizeCommand);
program.parse(process.argv);
