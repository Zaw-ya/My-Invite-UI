
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
    'index.csr.html': {size: 16764, hash: 'b7932f82a4ff6ee461260b1f3a28f3a6d2fd6f4b5893ac0f7616a3f335b83109', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1283, hash: '4e8eaaea678ec308d8192b9e2bc0188935b632a2b397649f056035e6d9fb03e6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 123984, hash: '416797c2691895fdb0571ad00e814649250f1f20db16e5856d8334da2e0c1e99', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-23OZZCHJ.css': {size: 262025, hash: 'MJJN8gJIqy0', text: () => import('./assets-chunks/styles-23OZZCHJ_css.mjs').then(m => m.default)}
  },
};
