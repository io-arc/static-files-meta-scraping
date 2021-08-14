#!/usr/bin/env node
/*!
@io-arc/static-files-meta-scraping
Analyze static files and extract meta information.

Version: 1.0.0
License: MIT
Documents: https://github.com/io-arc/static-files-meta-scraping

Copyright (c) 2021 arc one
*/
"use strict";var e=require("commander"),t=require("kleur"),r=require("update-notifier"),a=require("fs"),s=require("os"),i=require("path"),o=require("downloads-folder"),n=require("pug"),c=require("cheerio"),l=require("glob");function u(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var g=u(r),p=u(a),d=u(s),m=u(i),h=u(o),f=u(n),y=u(c),x=u(l);const v=[{target:"html[lang]",value:"lang"},{target:"head[prefix]",value:"prefix"},{target:"title"},{target:'meta[name="description"]'},{target:'meta[property="og:type"]'},{target:'meta[property="og:url"]'},{target:'meta[property="og:title"]'},{target:'meta[property="og:site_name"]'},{target:'meta[property="og:image"]'},{target:'meta[property="og:description"]'},{target:'meta[property="fb:app_id"]'},{target:'meta[name="twitter:card"]'},{target:'meta[name="twitter:site"]'},{target:'meta[name="twitter:creator"]'},{target:'meta[name="twitter:image"]'},{target:'meta[name="twitter:description"]'}],w=/\.[^.]+$/,b=/\.(jpg|jpeg|gif|png|webp|svg)+$/i;class j{exit(e){console.log(t.red("Oops X(")),e&&console.log(t.red(JSON.stringify(e))),process.exit(1)}}class S extends j{#data;constructor(e){super();const t=this.#readFile();this.#data={search:t.search,ext:e.ext||t.ext||"html",dir:e.dir||t.dir||"dist",root:e.root||t.root||"/"}}targetExt(){return this.#data.ext}targetDir(){return this.#data.dir}searchProperties(){return this.#data.search}rootPath(){return this.#data.root}#readFile=()=>{const e=m.default.join(process.cwd(),".meta-scraping.json");if(p.default.existsSync(e))return JSON.parse(p.default.readFileSync(e,"utf8"));const t=m.default.join(d.default.homedir(),".meta-scraping.json");return p.default.existsSync(t)?JSON.parse(p.default.readFileSync(t,"utf8")):{search:v}}}const $="https://github.com/io-arc/static-files-meta-scraping",q={doctype:"html"};class E extends j{#body;constructor(e,t){super();const r=f.default.compileFile(m.default.join(__dirname,"templates","base.pug"),q),a=this.#html(e,t);this.#body=r({htmlItems:a,project:m.default.dirname($),homepage:$,version:"1.0.0"})}write(e){p.default.writeFileSync(`${m.default.join(e||h.default(),"result.html")}`,this.#body)}#html=(e,t)=>{const r=e.filter((e=>"html"===e.type)),a=[];return r.forEach((e=>{const t=[];e.data.forEach((e=>t.push({key:e.key,value:e.value,image:e.image}))),a.push({filename:e.filename,result:t})})),a}}class k extends j{#dir="";#files=[];constructor(e,t){super();const r=x.default.sync(`${e}/**/*.${/,/.test(t)?`{${t}}`:t}`);this.#files=this.#sort(r),this.#dir=e}exec(e,t){if(0===this.#files.length)return[];const r=[];return this.#files.forEach((a=>{const s=(e=>{const t=w.exec(e);if(null!=t)return t[0]})(a);if(null==s)return;const i=p.default.readFileSync(a,"utf8"),o=a.replace(`${this.#dir}/`,"");switch(s){case".css":return;default:const a=this.#html(i,e,t);return void r.push({filename:o,type:"html",data:a})}})),r}#sort=e=>e.sort(((e,t)=>{const r=w.exec(e),a=w.exec(t);if(!r)return a||e>t?-1:1;if(!a)return 1;const s=r[0],i=a[0];return s!==i?s>i?-1:1:e>t?-1:1}));#html=(e,t,r)=>{const a=y.default.load(e),s=[];return t.forEach((e=>{const t=a(e.target);if(0===t.length)return;const i=this.#attr(e);Array.from(t).forEach((t=>{const o=null==i?a(t).text():a(t).attr(i);if(null!=o)if(/ \d(.*)[a-zA-Z]/.test(o)){o.split(", ").forEach((t=>{const a=t.replace(/ \d(.*)[a-zA-Z]/,""),i=this.#image(a,r);s.push({key:e.target,value:a,image:i})}))}else{const t=this.#image(o,r);s.push({key:e.target,value:o,image:t})}}))})),s};#css=e=>{console.log(e)};#attr=e=>null!=e.value?""===e.value?null:e.value:/^meta/.test(e.target)?"content":/^link/.test(e.target)||/^a/.test(e.target)?"href":/^img\[srcset/.test(e.target)?"srcset":/^img/.test(e.target)||/^source/.test(e.target)||/^video/.test(e.target)?"src":null;#image=(e,t)=>{if(!b.test(e))return;e=e.replace(/https?:\/\/(.*?)\//,"").replace(/\?[^.]+$/,""),/^\//.test(e)||(e=`/${e}`);const r=new RegExp(`^${t}`);e=e.replace(r,"");const a=m.default.join(this.#dir,e);if(!p.default.existsSync(a))return"oops";const s=p.default.readFileSync(a,"base64"),i=this.#mime(a);return null==i?"unknown":`data:${i};base64,${s}`};#mime=e=>{const t=e.match(w);if(null!=t)switch(t[0].toLocaleLowerCase()){case".png":return"image/png";case".jpg":case".jpeg":return"image/jpeg";case".gif":return"image/gif";case"webp":return"image/webp";case".svg":return"image/svg+xml";default:return}}}(async r=>{g.default({pkg:{name:"@io-arc/static-files-meta-scraping",version:"1.0.0"}}).notify(),process.stdin.resume(),process.on("SIGINT",(()=>{console.log(t.bold("Bye !")),process.exit(0)})),e.program.version("1.0.0").option("-e, --ext <extensions>","Search target extensions. e.g. html,css",void 0).option("-d, --dir <target directory>","Search target directory",void 0).option("-r, --root <root path>","URL root path",void 0).parse(process.argv);const a=new S({ext:r.ext,dir:r.dir,root:r.root}),s=new k(a.targetDir(),a.targetExt()).exec(a.searchProperties(),a.rootPath());new E(s,a.searchProperties()).write(),process.exit(0)})(e.program.opts());
