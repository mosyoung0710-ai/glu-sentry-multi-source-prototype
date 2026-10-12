const tabSelectionCopy = {
  ns: { subtitle: '', guide: '已通过糖糖圈开通 NS，选这里' },
  'ns-edit': { subtitle: '', guide: '已通过糖糖圈开通 NS，选这里', guideMark: '2' },
  other: { subtitle: '', guide: '已在其他渠道开通 NS，选这里' },
  account: { subtitle: '', guide: '已在糖糖圈绑定 CGM，选这里' },
  auth: { subtitle: '', guide: '想直接在糖哨兵授权CGM，选这里' }
};

function renderTabSelectionGuide() {
  const selectedTab = document.querySelector('.tab.active');
  if (!selectedTab) return;

  const tab = selectedTab.dataset.page;
  const copy = tabSelectionCopy[tab];
  if (!copy) return;

  const card = document.querySelector('.card');
  const cardTitle = card?.querySelector('h3')?.textContent;
  const isAccountLogin = card?.classList.contains('account-login-card');
  const subtitle = document.querySelector('.page-subtitle');
  const existingGuide = document.querySelector('.tab-guide');

  if (tab === 'account' && !isAccountLogin) {
    if (subtitle) subtitle.style.display = 'none';
    existingGuide?.remove();

    if (cardTitle === '选择血糖源') {
      card.classList.add('source-choice-card');
      card.querySelector('h3')?.remove();
      const hint = card.querySelector('.hint');
      if (hint) hint.innerHTML = '<span class="change-dot">1</span>已查询到 2 个 CGM，请选择 1 个';
    }
    return;
  }

  if (subtitle) {
    if (copy.subtitle) {
      subtitle.style.display = '';
      if (subtitle.textContent !== copy.subtitle) subtitle.textContent = copy.subtitle;
    } else {
      subtitle.style.display = 'none';
    }
  }

  if (!copy.guide) {
    existingGuide?.remove();
    return;
  }

  if (existingGuide?.dataset.tab === tab) return;
  existingGuide?.remove();
  const guideMark = document.querySelector('.query-result') ? '1' : copy.guideMark;
  selectedTab.closest('.tabs')?.insertAdjacentHTML(
    'afterend',
    `<p class="tab-guide" data-tab="${tab}">${guideMark ? `<span class="change-dot">${guideMark}</span>` : ''}${copy.guide}</p>`
  );
}

new MutationObserver(() => requestAnimationFrame(renderTabSelectionGuide))
  .observe(document.querySelector('#app'), { childList: true, subtree: true });

renderTabSelectionGuide();
