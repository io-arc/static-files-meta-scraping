#!/usr/bin/env node
/*!
@io-arc/static-files-meta-scraping
Analyze static files and extract meta information.

Version: 1.0.0
License: MIT
Documents: https://github.com/io-arc/static-files-meta-scraping#readme

Copyright (c) 2021 arc one
*/
"use strict";var e=require("commander");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var s=r(require("update-notifier"));let t,n,o,c,i=!0;"undefined"!=typeof process&&(({FORCE_COLOR:t,NODE_DISABLE_COLORS:n,NO_COLOR:o,TERM:c}=process.env),i=process.stdout&&process.stdout.isTTY);const u=!n&&null==o&&"dumb"!==c&&(null!=t&&"0"!==t||i);function p(e,r){let s=new RegExp(`\\x1b\\[${r}m`,"g"),t=`[${e}m`,n=`[${r}m`;return function(e){return u&&null!=e?t+(~(""+e).indexOf(n)?e.replace(s,n+t):e)+n:e}}const a=p(1,22),l=p(32,39);s.default({pkg:{name:"@io-arc/static-files-meta-scraping",version:"1.0.0"}}).notify(),process.stdin.resume(),process.on("SIGINT",(()=>{console.log(a(l("Bye !"))),process.exit(0)})),a(l("test")),e.program.version("1.0.0").parse(process.argv);
