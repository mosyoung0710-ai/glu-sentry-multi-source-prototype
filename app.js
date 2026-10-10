const items = [
  ['总览', [['flow', '流程总览']]],
  ['血糖源设置', [
    ['ns', '糖糖圈 NS｜已绑定'], ['ns-edit', '糖糖圈 NS｜修改'], ['ns-result', '糖糖圈 NS｜查询结果'], ['other', '其他 NS'], ['other-failed', '其他 NS｜绑定失败'], ['other-bound', '其他 NS｜已绑定'],
    ['account', '糖糖圈账号'], ['account-error', '糖糖圈账号｜登录提示'], ['sources', '糖糖圈账号｜选择血糖源'],
    ['empty', '糖糖圈账号｜未查询到血糖源'], ['account-bound', '糖糖圈账号｜已绑定 CGM'],
    ['auth', '授权 CGM'], ['silicon', '硅基动感授权'], ['silicon-bound', '硅基动感｜已绑定']
  ]]
];
let active = 'flow';
let selectedSource = '硅基动感';
let vendorMode = { silicon: 'code' };
let accountLoginMode = 'password';
let accountDraft = { phone: '', password: '', code: '' };
let sourceDrafts = { ns: { phone: '', code: '' }, other: { url: '', key: '' } };
const app = document.querySelector('#app');

const nav = () => items.map(([group, pages]) =>
  `<div class="nav-label">${group}</div>${pages.map(([id, name]) =>
    `<button class="nav-item ${active === id ? 'active' : ''}" data-page="${id}">${name}</button>`
  ).join('')}`
).join('');
const note = (title, text) => {
  if (!text) return '<aside class="notes"></aside>';
  const body = Array.isArray(text)
    ? `<ol class="note-list">${text.map((item, index) => `<li>${index + 1}、${item}</li>`).join('')}</ol>`
    : `<p>${text}</p>`;
  return `<aside class="notes"><h2>修改点</h2><section class="note-block"><div class="note-label">${title}</div>${body}</section></aside>`;
};
const shell = (title, content, noteTitle, noteText) => `<div class="review"><aside class="sidebar"><div class="brand"><i class="brand-mark"></i>糖哨兵 · 三期</div>${nav()}</aside><section class="stage"><header class="stage-head"><h1>${title}</h1><span>多种血糖源</span></header><div class="canvas">${content}</div></section>${note(noteTitle, noteText)}</div>`;
const phone = (content, cls = '') => `<article class="phone ${cls}"><div class="statusbar"><span>9:41</span><span>● ● ● ▰</span></div>${content}</article>`;
const appNav = (title, back = true, backPage = 'ns', changeMark = '') => `<div class="app-nav">${back ? `<button class="back"${backPage ? ` data-page="${backPage}"` : ''} aria-label="返回">‹${changeMark ? changeBadge(changeMark) : ''}</button>` : ''}${title}</div>`;
const tabs = (selected, changeMark = '') => `<nav class="tabs">${changeMark ? `<span class="change-dot tab-change-dot">${changeMark}</span>` : ''}${[['ns','糖糖圈 NS'],['other','其他 NS'],['account','糖糖圈账号'],['auth','绑定CGM']].map(([id,name]) => `<button class="tab ${selected === id ? 'active' : ''}" data-page="${id === 'ns' ? 'ns-edit' : id}">${name}</button>`).join('')}</nav>`;
const changeBadge = number => `<span class="change-dot">${number}</span>`;
const escapeAttribute = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pageSubtitle = {
  other: '',
  account: '',
  auth: ''
};
const sourcePage = (tab, content, subtitle = pageSubtitle[tab]) => phone(`${appNav('血糖源设置', true, null)}<div class="app-scroll"><h1 class="page-title">血糖源设置</h1><p class="page-subtitle">${subtitle || ''}</p>${tabs(tab)}${content}</div>`);

function currentNS() {
  return boundNS('https://ns.ttq.so/', 'ns-edit', '2', '1');
}
function boundNS(url, modifyPage, changeMark = '', backMark = '') {
  return phone(`${appNav('血糖源设置', true, null, backMark)}<div class="app-scroll"><section class="bound-ns"><div><h3>已绑定 NS</h3><p class="bound-label">NS网址</p><div class="bound-url"><span>◎</span><p>${url}</p></div><button class="text-action" data-page="${modifyPage}">${changeMark ? changeBadge(changeMark) : ''}修改血糖源</button></div><button class="primary">确定</button></section></div>`);
}
function boundCGM(name, modifyPage, changeMark = '') {
  return phone(`${appNav('血糖源设置', true, null)}<div class="app-scroll"><section class="bound-ns bound-cgm"><div><h3>已绑定 CGM</h3><div class="bound-url"><span>◉</span><p>${name}</p></div><button class="text-action" data-page="${modifyPage}">${changeMark ? changeBadge(changeMark) : ''}修改血糖源</button></div><button class="primary">确定</button></section></div>`);
}
function nsEdit() {
  return phone(`${appNav('血糖源设置', true, null)}<div class="app-scroll"><section class="ttq-ns-query"><div><h1 class="page-title">血糖源设置</h1><p class="page-subtitle"></p>${tabs('ns', '1')}<div class="query-fields"><p class="form-summary"><span class="change-dot">3</span>输入手机号以查询NS账号</p><label><span class="input-icon phone" aria-hidden="true"></span><input data-source-draft="ns.phone" placeholder="请输入手机号" inputmode="numeric" value="${escapeAttribute(sourceDrafts.ns.phone)}"></label><label><span class="input-icon verify" aria-hidden="true"></span><input data-source-draft="ns.code" placeholder="请输入验证码" inputmode="numeric" value="${escapeAttribute(sourceDrafts.ns.code)}"><button>获取验证码</button></label></div></div><button class="primary" data-page="ns-result">查询</button></section></div>`);
}
function nsResult() {
  return phone(`${appNav('血糖源设置', true, null)}<div class="app-scroll"><section class="ttq-ns-query"><div><h1 class="page-title">血糖源设置</h1><p class="page-subtitle"></p>${tabs('ns')}<div class="query-fields"><p class="form-summary">输入手机号以查询NS账号</p><label><span class="input-icon phone" aria-hidden="true"></span><input value="1380970065" inputmode="numeric"></label><label><span class="input-icon verify" aria-hidden="true"></span><input value="0098" inputmode="numeric"><button>23 秒后重发</button></label><div class="query-result"><span class="input-icon url" aria-hidden="true"></span><p>https://ns.ttq.so/</p></div></div></div><button class="primary" data-page="ns">绑定</button></section></div>`);
}
function otherNS(failed = false) {
  return sourcePage('other', `<section class="card"><p class="form-summary">${failed ? '' : changeBadge('1')}填写 Nightscout 地址和密钥</p><label class="field"><span class="input-icon url" aria-hidden="true"></span><input data-source-draft="other.url" placeholder="请输入 Nightscout URL（网址）" value="${failed ? 'https://my.nightscout.app' : escapeAttribute(sourceDrafts.other.url)}"></label><label class="field"><span class="input-icon key" aria-hidden="true"></span><input data-source-draft="other.key" placeholder="请输入 NS API 密钥" type="password" value="${failed ? '12345678' : escapeAttribute(sourceDrafts.other.key)}"></label>${failed ? `<p class="error">${changeBadge('1')}绑定失败，请检查 Nightscout 地址和密钥后重试。</p>` : ''}<button class="primary" data-page="other-bound">绑定</button></section>`);
}
function accountLogin(failed = false, mode = accountLoginMode) {
  const password = mode === 'password';
  const switchTo = password ? 'code' : 'password';
  const switchText = password ? '验证码登录' : '密码登录';
  const phoneValue = failed ? '123' : escapeAttribute(accountDraft.phone);
  const credentialField = password
    ? `<label class="field"><span class="input-icon lock" aria-hidden="true"></span><input data-account-field="password" placeholder="请输入密码" type="password" value="${escapeAttribute(accountDraft.password)}"></label>`
    : `<label class="field"><span class="input-icon verify" aria-hidden="true"></span><input data-account-field="code" placeholder="请输入短信验证码" inputmode="numeric" value="${failed ? '304980' : escapeAttribute(accountDraft.code)}"><span class="code">获取验证码</span></label>`;
  const credentialError = !password && failed ? '<p class="error">验证码错误或已失效，请重新获取</p>' : '';
  return sourcePage('account', `<section class="card account-login-card"><p class="form-summary">${failed ? '' : changeBadge('1')}登录糖糖圈账号</p><label class="field"><span class="country-code">+86 ▾</span><input data-account-field="phone" placeholder="请输入手机号" inputmode="numeric" value="${phoneValue}"></label>${failed ? `<p class="error">${changeBadge('1')}请输入正确手机号</p>` : ''}${credentialField}${credentialError}<button class="login-switch" data-account-mode="${switchTo}">${!failed ? changeBadge('2') : ''}${switchText}</button><button class="primary" data-page="sources">登录</button></section>`);
}
function sourceRow(name, changeMark = '') {
  return `<div class="select-row ${selectedSource === name ? 'selected' : ''}" data-source="${name}">${changeMark ? changeBadge(changeMark) : ''}<span class="source-icon">${name[0]}</span><div><h4>${name}</h4></div><i class="select-radio"></i></div>`;
}
function accountSources() {
  return sourcePage('account', `<section class="card"><h3>选择血糖源</h3><p class="hint">已查询到您在糖糖圈授权的 2 个 CGM，请选择 1 个作为血糖源。</p>${sourceRow('硅基动感','2')}${sourceRow('微泰动态')}<button class="primary" data-page="account-bound">确认</button></section>`, '已在糖糖圈绑定 CGM，选择一个使用。');
}
function accountEmpty() {
  return sourcePage('account', `<section class="card empty"><div class="empty-icon">⌁</div><h3>暂未查询到可用血糖源</h3><p>${changeBadge('1')}若未在糖糖圈授权CGM，请先完成授权；<br>若您绑定的是NS，请选择“糖糖圈NS”或“其他NS”</p><button class="primary" data-page="account">${changeBadge('2')}切换糖糖圈账号</button></section>`, '已在糖糖圈绑定 CGM，登录后选择一个使用。');
}
function authorization() {
  return sourcePage('auth', `<section class="card"><p class="form-summary">${changeBadge('1')}选择需要绑定的 CGM</p><div class="source-row" data-page="silicon"><span class="source-icon">硅</span><div><h4>硅基动感</h4></div><span class="chevron">›</span></div><p class="hint" style="margin:18px 0 0">更多 CGM 正在接入中，敬请期待；<br>若已在糖糖圈绑定 CGM，可切换至「糖糖圈账号」登录后选择</p></section>`);
}
function silicon() {
  const password = vendorMode.silicon === 'password';
  return phone(`${appNav('硅基动感授权', true, 'auth', '4')}<div class="vendor-content"><div class="vendor-banner">${changeBadge('1')}为了您的隐私安全，<br>请您登录硅基动感账号</div><div class="silicon-login"><h2>${changeBadge('2')}${password ? '账号密码登录' : '手机验证码登录'}</h2><p class="desc">${password ? '使用已注册的账号登录，账号默认为您注册的手机号' : '未注册的手机号将自动注册并登录'}</p><label class="vendor-field"><span class="input-icon phone" aria-hidden="true"></span><input placeholder="请输入手机号"></label>${password ? '<label class="vendor-field"><span class="input-icon lock" aria-hidden="true"></span><input placeholder="请输入密码" type="password"></label>' : '<label class="vendor-field"><span class="input-icon verify" aria-hidden="true"></span><input placeholder="请输入短信验证码"><span class="code">获取验证码</span></label>'}<button class="vendor-action" data-page="silicon-bound">${changeBadge('3')}登录</button><button class="vendor-switch" data-vendor="silicon">${password ? '手机验证码登录' : '账号密码登录'}</button></div></div>`, 'vendor');
}
function flow() {
  return '<div class="flow-board"><h2>多种血糖源｜流程总览</h2><div class="flow-grid"><div class="flow-entry"><div class="flow-node">血糖源设置</div></div><div class="flow-arrow">→</div><div class="flow-col"><div class="flow-node">糖糖圈 NS</div><div class="flow-node">其他 NS</div><div class="flow-node">糖糖圈账号</div><div class="flow-node">绑定 CGM</div></div><div class="flow-arrow">→</div><div class="flow-col flow-operation"><div class="flow-node">输入手机号查询</div><div class="flow-node">填写网址和密钥</div><div class="flow-node">登录糖糖圈账号<br>选择 1 个 CGM</div><div class="flow-node">完成品牌授权</div></div><div class="flow-arrow">→</div><div class="flow-col flow-result"><div class="flow-node">已绑定</div><div class="flow-node">首页查看血糖数据</div></div></div></div>';
}
function view() {
  const pages = {
    flow:['流程总览',flow(),'',''],
    ns:['血糖源设置｜糖糖圈 NS',currentNS(),'糖糖圈 NS',['点击左上角返回按钮或“确定”后，均回到设备详情页','点击“修改血糖源”后，返回血糖源设置页并定位至“糖糖圈 NS”']],
    'ns-edit':['糖糖圈 NS｜修改',nsEdit(),'糖糖圈 NS',['增加血糖源选择 Tab。切换 Tab 时保留未提交内容，不触发登录或绑定；密码、密钥继续掩码，验证码倒计时及有效性不变。离开血糖源设置或关闭 App 后清空。其他页面同样适用，后续不再重复说明','增加选择指引','调整“输入手机号以查询NS账号”文案的位置']],
    'ns-result':['糖糖圈 NS｜查询结果',nsResult(),'糖糖圈 NS',['本页也需要展示血糖源选择 Tab 和选择指引']],
    other:['血糖源设置｜其他 NS',otherNS(),'其他 NS',['新增其他 NS 绑定入口']],
    'other-failed':['血糖源设置｜其他 NS 绑定失败',otherNS(true),'其他 NS',['绑定失败后保留已填写内容，可修改后再次绑定']],
    'other-bound':['其他 NS｜已绑定',boundNS('https://example.nightscout.app/','other','1'),'其他 NS',['点击“修改血糖源”后，返回血糖源设置页并定位至“其他 NS”']],
    account:['血糖源设置｜糖糖圈账号',accountLogin(),'糖糖圈账号',['新增糖糖圈账号登录入口，登录后查询已绑定的 CGM','默认账号密码登录，可切换验证码登录；切换前后保留已输入的账号和密码或验证码']],
    'account-error':['糖糖圈账号｜登录提示',accountLogin(true, 'code'),'糖糖圈账号',['增加手机号及验证码校验提示']],
    sources:['糖糖圈账号｜选择血糖源',accountSources(),'糖糖圈账号',['查询到可用 CGM 时，将可用 CGM 以列表形式展示，列表项展示品牌图标、名称及单选框','排序：按固定优先级排列，硅基动感、欧态、微泰动态、三诺爱看、鱼跃；默认选中排序第一项','点击“确认”后，将所选 CGM 设为当前血糖源，并进入已绑定页']],
    empty:['糖糖圈账号｜未查询到血糖源',accountEmpty(),'糖糖圈账号',['未查询到可用 CGM 时，分别提示未授权 CGM 和已绑定 NS 的处理方式','点击“切换糖糖圈账号”：返回血糖源设置页并定位至“糖糖圈账号”']],
    'account-bound':['糖糖圈账号｜已绑定 CGM',boundCGM(selectedSource,'account','1'),'糖糖圈账号',['点击“修改血糖源”后，返回血糖源设置页并定位至“糖糖圈账号”']],
    auth:['血糖源设置｜授权 CGM',authorization(),'绑定 CGM',['首期提供硅基动感绑定入口']],
    silicon:['硅基动感授权',silicon(),'硅基动感',['选择硅基动感后，进入品牌授权页','本页交互与糖糖圈内的授权页面一致','登录成功后，返回硅基动感已绑定页','点击左上角返回按钮后，返回血糖源设置页并定位至“绑定 CGM”']],
    'silicon-bound':['硅基动感｜已绑定',boundCGM('硅基动感','auth','1'),'硅基动感',['点击“修改血糖源”后，返回血糖源设置页并定位至“绑定 CGM”']]
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
  document.querySelectorAll('[data-account-mode]').forEach(el => el.addEventListener('click', () => {
    accountLoginMode = el.dataset.accountMode;
    view();
  }));
  document.querySelectorAll('[data-account-field]').forEach(el => el.addEventListener('input', () => {
    accountDraft[el.dataset.accountField] = el.value;
  }));
  document.querySelectorAll('[data-source-draft]').forEach(el => el.addEventListener('input', () => {
    const [source, field] = el.dataset.sourceDraft.split('.');
    sourceDrafts[source][field] = el.value;
  }));
}
view();
