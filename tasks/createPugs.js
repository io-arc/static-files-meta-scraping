#!/usr/bin/env node
/*!
Create a pug file for oops image.
 */
const fs = require('fs')
const oops = fs.readFileSync('img/oops.svg', 'utf-8')
fs.writeFileSync('bin/templates/components/broken-image.pug', oops)
