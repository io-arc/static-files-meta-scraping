/** Default search target tags */
import downloadsFolder from 'downloads-folder'

export const searchDefaultConfig: IfConfigFile = {
  // search target
  search: [
    { target: 'html[lang]', value: 'lang' },
    { target: 'head[prefix]', value: 'prefix' },
    { target: 'title' },
    { target: 'meta[name="description"]' },
    { target: 'meta[property="og:type"]' },
    { target: 'meta[property="og:url"]' },
    { target: 'meta[property="og:title"]' },
    { target: 'meta[property="og:site_name"]' },
    { target: 'meta[property="og:image"]' },
    { target: 'meta[property="og:description"]' },
    { target: 'meta[property="fb:app_id"]' },
    { target: 'meta[name="twitter:card"]' },
    { target: 'meta[name="twitter:site"]' },
    { target: 'meta[name="twitter:creator"]' },
    { target: 'meta[name="twitter:image"]' },
    { target: 'meta[name="twitter:description"]' }
  ],
  ext: 'html',
  dir: 'dist',
  root: '/',
  output: downloadsFolder()
}
