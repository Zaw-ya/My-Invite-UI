
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/My-Invite-UI/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/My-Invite-UI"
  },
  {
    "renderMode": 2,
    "redirectTo": "/My-Invite-UI",
    "route": "/My-Invite-UI/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 16764, hash: 'b6f831e28ee0b943f8969ecf9d1f689ff12336110ca4781df2bbc26e014a1e20', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1283, hash: 'bda20c2e4980ff51bb63ea111e92c92f457e9596e202bad03715cf48494006ad', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 164143, hash: 'ea42d117e374d71d672cd4ec2cc489339f818d97e6f741f7c484884ba397f784', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-23OZZCHJ.css': {size: 262025, hash: 'MJJN8gJIqy0', text: () => import('./assets-chunks/styles-23OZZCHJ_css.mjs').then(m => m.default)}
  },
};
