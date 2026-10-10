const items = [
  ['总览', [['flow', '流程总览']]],
  ['血糖源设置', [
    ['ns', '糖糖圈 NS｜已绑定'], ['ns-edit', '糖糖圈 NS｜修改'], ['other', '其他 NS'], ['other-failed', '其他 NS｜绑定失败'], ['other-bound', '其他 NS｜已绑定'],
    ['account', '糖糖圈账号'], ['sources', '糖糖圈账号｜选择血糖源'],
    ['empty', '糖糖圈账号｜未查询到血糖源'], ['account-bound', '糖糖圈账号｜已绑定 CGM'],
    ['auth', '授权 CGM'], ['silicon', '硅基动感授权'], ['silicon-bound', '硅基动感｜已绑定']
  ]]
];
let active = 'flow';
let selectedSource = '硅基动感';
let vendorMode = { silicon: 'code' };
const app = document.querySelector('#app');

const nav = () => items.map(([group, pages]) =>
  `<div class="nav-label">${group}</div>${pages.map(([id, name]) =>
    `<button class="nav-item ${active === id ? 'active' : ''}" data-page="${id}">${name}</button>`
  ).join('')}`
).join('');
const note = (title, text) => text ? `<aside class="notes"><h2>修改点</h2><section class="note-block"><div class="note-label">${title}</div><p>${text}</p></section></aside>` : '<aside class="notes"></aside>';
const shell = (title, content, noteTitle, noteText) => `<div class="review"><aside class="sidebar"><div class="brand"><i class="brand-mark"></i>糖哨兵 · 三期</div>${nav()}</aside><section class="stage"><header class="stage-head"><h1>${title}</h1><span>多种血糖源</span></header><div class="canvas">${content}</div></section>${note(noteTitle, noteText)}</div>`;
const phone = (content, cls = '') => `<article class="phone ${cls}"><div class="statusbar"><span>9:41</span><span>● ● ● ▰</span></div>${content}</article>`;
const appNav = (title, back = true) => `<div class="app-nav">${back ? '<button class="back" data-page="ns" aria-label="返回">‹</button>' : ''}${title}</div>`;
const tabs = selected => `<nav class="tabs">${[['ns','糖糖圈 NS'],['other','其他 NS'],['account','糖糖圈账号'],['auth','绑定CGM']].map(([id,name]) => `<button class="tab ${selected === id ? 'active' : ''}" data-page="${id === 'ns' ? 'ns-edit' : id}">${name}</button>`).join('')}</nav>`;
const pageSubtitle = {
  other: '已在其他渠道开通 NS，选这里',
  account: '登录糖糖圈账号',
  auth: '想直接在糖哨兵绑定 CGM，选这里'
};
const sourcePage = (tab, content, subtitle = pageSubtitle[tab]) => phone(`${appNav('血糖源设置', false)}<div class="app-scroll"><h1 class="page-title">血糖源设置</h1><p class="page-subtitle">${subtitle || ''}</p>${tabs(tab)}${content}</div>`);

function currentNS() {
  return boundNS('https://example.nightscout.app/', 'ns-edit');
}
function boundNS(url, modifyPage) {
  return phone(`${appNav('血糖源设置', false)}<div class="app-scroll"><section class="bound-ns"><div><h3>已绑定 NS</h3><p class="bound-label">NS网址</p><div class="bound-url"><span>◎</span><p>${url}</p></div><button class="text-action" data-page="${modifyPage}">修改血糖源</button></div><button class="primary">确定</button></section></div>`);
}
function boundCGM(name, modifyPage) {
  return phone(`${appNav('血糖源设置', false)}<div class="app-scroll"><section class="bound-ns bound-cgm"><div><h3>已绑定 CGM</h3><div class="bound-url"><span>◉</span><p>${name}</p></div><button class="text-action" data-page="${modifyPage}">修改血糖源</button></div><button class="primary">确定</button></section></div>`);
}
function nsEdit() {
  return phone(`${appNav('血糖源设置')}<div class="app-scroll"><section class="ttq-ns-query"><div><h1 class="page-title">血糖源设置</h1><p class="page-subtitle">已通过糖糖圈开通 NS，输入手机号查询。</p>${tabs('ns')}<div class="query-fields"><label><span class="input-icon phone" aria-hidden="true"></span><input placeholder="请输入手机号" inputmode="numeric"></label><label><span class="input-icon verify" aria-hidden="true"></span><input placeholder="请输入验证码" inputmode="numeric"><button>获取验证码</button></label></div></div><button class="primary" data-page="ns">查询</button></section></div>`);
}
function otherNS(failed = false) {
  return sourcePage('other', `<section class="card"><label class="field"><span class="input-icon url" aria-hidden="true"></span><input placeholder="请输入 Nightscout URL（网址）" value="${failed ? 'https://example.nightscout.app' : ''}"></label><label class="field"><span class="input-icon key" aria-hidden="true"></span><input placeholder="请输入 NS API 密钥" type="password" value="${failed ? 'demo-key' : ''}"></label>${failed ? '<p class="error">绑定失败，请检查 Nightscout 地址和密钥后重试。</p>' : ''}<button class="primary" data-page="other-bound">${failed ? '重新绑定' : '绑定'}</button></section>`);
}
function accountLogin() {
  return sourcePage('account', '<section class="card account-login-card"><label class="field"><span class="input-icon phone" aria-hidden="true"></span><input placeholder="请输入手机号" inputmode="numeric"></label><label class="field"><span class="input-icon verify" aria-hidden="true"></span><input placeholder="请输入短信验证码" inputmode="numeric"><span class="code">获取验证码</span></label><button class="primary" data-page="sources">登录</button></section>');
}
function sourceRow(name) {
  return `<div class="select-row ${selectedSource === name ? 'selected' : ''}" data-source="${name}"><span class="source-icon">${name[0]}</span><div><h4>${name}</h4></div><i class="select-radio"></i></div>`;
}
function accountSources() {
  return sourcePage('account', `<section class="card"><h3>选择血糖源</h3><p class="hint">已查询到您在糖糖圈授权的 2 个 CGM，请选择 1 个作为血糖源。</p>${sourceRow('硅基动感','已授权')}${sourceRow('微泰动态','已授权')}<button class="primary" data-page="account-bound">确认</button></section>`, '已在糖糖圈绑定 CGM，选择一个使用。');
}
function accountEmpty() {
  return sourcePage('account', '<section class="card empty"><div class="empty-icon">⌁</div><h3>暂未查询到可用血糖源</h3><p>若未在糖糖圈授权CGM，请先完成授权；<br>若您绑定的是NS，请选择“糖糖圈NS”或“其他NS”</p></section>', '已在糖糖圈绑定 CGM，登录后选择一个使用。');
}
function authorization() {
  return sourcePage('auth', '<section class="card"><div class="source-row" data-page="silicon"><span class="source-icon">硅</span><div><h4>硅基动感</h4></div><span class="chevron">›</span></div><p class="hint" style="margin:18px 0 0">更多 CGM 正在接入中，敬请期待；<br>若已在糖糖圈绑定 CGM，可切换至「糖糖圈账号」登录后选择</p></section>');
}
function silicon() {
  const password = vendorMode.silicon === 'password';
  return phone(`${appNav('硅基动感授权')}<div class="vendor-content"><div class="vendor-banner">为了您的隐私安全，<br>请您登录硅基动感账号</div><div class="silicon-login"><h2>${password ? '账号密码登录' : '手机验证码登录'}</h2><p class="desc">未注册的手机号将自动注册并登录</p><label class="vendor-field"><span class="input-icon phone" aria-hidden="true"></span><input placeholder="请输入手机号"></label>${password ? '<label class="vendor-field"><span class="input-icon lock" aria-hidden="true"></span><input placeholder="请输入密码" type="password"></label>' : '<label class="vendor-field"><span class="input-icon verify" aria-hidden="true"></span><input placeholder="请输入短信验证码"><span class="code">获取验证码</span></label>'}<button class="vendor-action" data-page="silicon-bound">登录</button><button class="vendor-switch" data-vendor="silicon">${password ? '手机验证码登录' : '账号密码登录'}</button></div></div>`, 'vendor');
}
function flow() {
  return '<div class="flow-board"><h2>多种血糖源｜流程总览</h2><div class="flow-grid"><div class="flow-entry"><div class="flow-node">血糖源设置</div></div><div class="flow-arrow">→</div><div class="flow-col"><div class="flow-node">糖糖圈 NS</div><div class="flow-node">其他 NS</div><div class="flow-node">糖糖圈账号</div><div class="flow-node">绑定 CGM</div></div><div class="flow-arrow">→</div><div class="flow-col flow-operation"><div class="flow-node">输入手机号查询</div><div class="flow-node">填写网址和密钥</div><div class="flow-node">登录糖糖圈账号<br>选择 1 个 CGM</div><div class="flow-node">完成品牌授权</div></div><div class="flow-arrow">→</div><div class="flow-col flow-result"><div class="flow-node">已绑定</div><div class="flow-node">首页查看血糖数据</div></div></div></div>';
}
function view() {
  const pages = {
    flow:['流程总览',flow(),'',''],
    ns:['血糖源设置｜糖糖圈 NS',currentNS(),'已绑定状态','已绑定后仅展示当前来源；修改时进入对应来源的修改页。'],
    'ns-edit':['糖糖圈 NS｜修改',nsEdit(),'糖糖圈 NS','沿用现有手机号查询 NS 的页面结构。'],
    other:['血糖源设置｜其他 NS',otherNS(),'其他 NS','填写地址和密钥后直接绑定。'],
    'other-failed':['血糖源设置｜其他 NS 绑定失败',otherNS(true),'失败状态','绑定失败时保留已填写内容，方便重新绑定。'],
    'other-bound':['其他 NS｜已绑定',boundNS('https://example.nightscout.app/','other'),'其他 NS','绑定后展示已绑定状态与 NS 网址。'],
    account:['血糖源设置｜糖糖圈账号',accountLogin(),'糖糖圈账号','登录后查询糖糖圈内已授权的 CGM。'],
    sources:['糖糖圈账号｜选择血糖源',accountSources(),'选择血糖源','只展示可作为血糖源的 CGM。'],
    empty:['糖糖圈账号｜未查询到血糖源',accountEmpty(),'未查询到结果','引导用户先完成 CGM 授权。'],
    'account-bound':['糖糖圈账号｜已绑定 CGM',boundCGM(selectedSource,'account'),'糖糖圈账号','绑定后展示选中的血糖源。'],
    auth:['血糖源设置｜授权 CGM',authorization(),'绑定 CGM','选择品牌后进入对应的品牌授权页面。'],
    silicon:['硅基动感授权',silicon(),'硅基动感授权','完成登录后返回糖哨兵。'],
    'silicon-bound':['硅基动感｜已绑定',boundCGM('硅基动感','auth'),'硅基动感','绑定后展示已绑定的血糖源。']
  };
  const [title, content, noteTitle, noteText] = pages[active];
  app.innerHTML = shell(title, content, noteTitle, noteText);
  bind();
}
function bind() {
  document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => { active = el.dataset.page; view(); }));
  document.querySelectorAll('[data-source]').forEach(el => el.addEventListener('click', () => { selectedSource = el.dataset.source; view(); }));
  document.querySelectorAll('[data-vendor]').forEach(el => el.addEventListener('click', () => {
    const vendor = el.dataset.vendor;
    vendorMode[vendor] = vendorMode[vendor] === 'code' ? 'password' : 'code';
    view();
  }));
}
view();
