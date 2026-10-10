const tabSelectionCopy = {
  ns: { subtitle: '输入手机号以查询NS账号', guide: '已通过糖糖圈开通 NS，选这里' },
  other: { subtitle: '填写 Nightscout 地址和密钥', guide: '已在其他渠道开通 NS，选这里' },
  account: { subtitle: '已在糖糖圈绑定 CGM，登录后选择一个使用' },
  auth: { subtitle: '选择需要绑定的 CGM', guide: '想直接在糖哨兵绑定 CGM，选这里' }
};

function renderTabSelectionGuide() {
  const selectedTab = document.querySelector('.tab.active');
  if (!selectedTab) return;

  const tab = selectedTab.dataset.page;
  const copy = tabSelectionCopy[tab];
  if (!copy) return;

  const card = document.querySelector('.card');
  const cardTitle = card?.querySelector('h3')?.textContent;
  const subtitle = document.querySelector('.page-subtitle');
  const existingGuide = document.querySelector('.tab-guide');

  if (tab === 'account' && cardTitle !== '登录糖糖圈账号') {
    if (subtitle) subtitle.style.display = 'none';
    existingGuide?.remove();

    if (cardTitle === '选择血糖源') {
      card.classList.add('source-choice-card');
      card.querySelector('h3')?.remove();
      const hint = card.querySelector('.hint');
      if (hint) hint.textContent = '已查询到 2 个 CGM，请选择 1 个';
    }
    return;
  }

  if (subtitle) {
    subtitle.style.display = '';
    if (subtitle.textContent !== copy.subtitle) subtitle.textContent = copy.subtitle;
  }

  if (!copy.guide) {
    existingGuide?.remove();
    return;
  }

  if (existingGuide?.dataset.tab === tab) return;
  existingGuide?.remove();
  selectedTab.closest('.tabs')?.insertAdjacentHTML(
    'afterend',
    `<p class="tab-guide" data-tab="${tab}">${copy.guide}</p>`
  );
}

new MutationObserver(() => requestAnimationFrame(renderTabSelectionGuide))
  .observe(document.querySelector('#app'), { childList: true, subtree: true });

renderTabSelectionGuide();
