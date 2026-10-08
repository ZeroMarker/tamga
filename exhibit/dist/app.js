const marks = [
  { id: 'kayi', name: '卡伊', latin: 'Kayı', file: 'Kayi', group: 'bozok', form: '两侧直线与中央的 V 形相互呼应，构成辨识度鲜明的对称印记。卡伊属于乌古斯传统分类中的博兹奥克分支。' },
  { id: 'bayat', name: '巴亚特', latin: 'Bayat', file: 'Bayat', group: 'bozok', form: '以简洁线条构成的巴亚特印记。观察线条的方向、转折与连接方式，可以看出它与其他部族图样的区别。巴亚特属于博兹奥克分支。' },
  { id: 'yazir', name: '亚兹尔', latin: 'Yazır', file: 'Yazir', group: 'bozok', form: '亚兹尔部族的数字化印记图样。线条组合既便于重复绘制，也能形成独特的识别形态。亚兹尔属于博兹奥克分支。' },
  { id: 'doger', name: '多格尔', latin: 'Döğer', file: 'Doger', group: 'bozok', form: '多格尔部族的印记，以少量线条形成独立的几何形态。图样中的交接与端点值得与其他印记仔细比较。多格尔属于博兹奥克分支。' },
  { id: 'avsar', name: '阿夫沙尔', latin: 'Avşar', file: 'Avsar', group: 'bozok', form: '这枚印记以一条竖线为主轴，在两端附近伸出不同方向的笔画。阿夫沙尔在文献中亦作 Afshar，属于博兹奥克分支。' },
  { id: 'begdili', name: '贝格迪利', latin: 'Beğdili', file: 'Begdili', group: 'bozok', form: '贝格迪利部族的印记图样。看似简单的线条与转折，构成了区别于其他部族的视觉标识。贝格迪利属于博兹奥克分支。' },
  { id: 'bayundur', name: '巴彦杜尔', latin: 'Bayındır', file: 'Bayundur', group: 'ucok', form: '巴彦杜尔部族的印记，在现代转写中也可见 Bayandur、Bayundur 等拼法。本图展示 Wikimedia Commons 的数字绘制版本，部族属于于乔克分支。' },
  { id: 'pecenek', name: '佩切内克', latin: 'Peçenek', file: 'Pecenek', group: 'ucok', form: '乌古斯传统部族分类中的佩切内克印记，属于于乔克分支。此处展示的是乌古斯图录中的部族图样，不能直接视为所有历史佩切内克群体的共同标志。' }
];
const groupNames = { bozok: '博兹奥克 / Bozok', ucok: '于乔克 / Üçok' };
const bookmarkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>';
let saved = new Set();
try { const value = JSON.parse(localStorage.getItem('tamga-saved') || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(id => marks.some(mark => mark.id === id))); } catch { /* Storage may be unavailable; keep session favorites. */ }
let filter = 'all';
let selected = null;
const gallery = document.querySelector('#gallery');
const search = document.querySelector('#search');
const dialog = document.querySelector('#detail');
function visibleMarks() {
  const query = search.value.trim().toLocaleLowerCase();
  return marks.filter(mark => (filter === 'all' || (filter === 'saved' ? saved.has(mark.id) : mark.group === filter)) && `${mark.name} ${mark.latin} ${mark.id} ${groupNames[mark.group]}`.toLocaleLowerCase().includes(query));
}
function render() {
  const visible = visibleMarks();
  gallery.innerHTML = visible.map(mark => {
    const index = String(marks.indexOf(mark) + 1).padStart(2, '0');
    return `<article class="card"><div class="card-top"><span class="card-index">T / ${index}</span><span class="card-group">${mark.group === 'bozok' ? '博兹奥克' : '于乔克'}</span></div><button class="bookmark" data-save="${mark.id}" aria-label="${saved.has(mark.id) ? '取消收藏' : '收藏'}${mark.name}印记" aria-pressed="${saved.has(mark.id)}">${bookmarkIcon}</button><button class="card-main" data-open="${mark.id}" aria-label="查看${mark.name}印记详情"><div class="card-art"><img src="assets/${mark.id}.svg" alt="${mark.name}部族 tamga 印记" width="216" height="158" loading="lazy"></div><div class="card-bottom"><div><h3>${mark.name}</h3><span class="card-latin">${mark.latin.toLocaleUpperCase()}</span></div><span class="card-open" aria-hidden="true">↗</span></div></button></article>`;
  }).join('');
  document.querySelector('#result-count').textContent = `展示 ${visible.length} 枚印记`;
  document.querySelector('#saved-count').textContent = saved.size;
  document.querySelector('#empty').hidden = visible.length !== 0;
  document.querySelector('#empty-title').textContent = filter === 'saved' && !search.value ? '还没有收藏印记' : '没有找到相关印记';
  document.querySelector('#empty-description').textContent = filter === 'saved' && !search.value ? '点击图录上的书签，留下你感兴趣的印记。收藏仅保存在当前浏览器。' : '试试其他部族名称，或清除筛选。';
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
function toggleSave(id) {
  saved.has(id) ? saved.delete(id) : saved.add(id);
  try { localStorage.setItem('tamga-saved', JSON.stringify([...saved])); } catch { /* Session state still works. */ }
  const focusedSave = document.activeElement?.dataset.save;
  render();
  if (focusedSave) gallery.querySelector(`[data-save="${focusedSave}"]`)?.focus();
  if (selected) updateDetailSave();
}
function updateDetailSave() {
  const button = document.querySelector('#detail-save');
  button.textContent = saved.has(selected.id) ? '已收藏 · 点击取消' : '收藏这枚印记';
  button.setAttribute('aria-pressed', String(saved.has(selected.id)));
}
function openDetail(id) {
  selected = marks.find(mark => mark.id === id);
  if (!selected) return;
  document.querySelector('#detail-title').textContent = selected.name;
  document.querySelector('#detail-latin').textContent = selected.latin;
  document.querySelector('#detail-group').textContent = groupNames[selected.group];
  document.querySelector('#detail-description').textContent = selected.form;
  document.querySelector('#detail-index').textContent = `T / ${String(marks.indexOf(selected) + 1).padStart(2, '0')}`;
  document.querySelector('#detail-image').src = `assets/${selected.id}.svg`;
  document.querySelector('#detail-image').alt = `${selected.name}部族 tamga 印记`;
  document.querySelector('#detail-source').href = `https://commons.wikimedia.org/wiki/File:${selected.file}.svg`;
  document.querySelector('#detail-position').textContent = `${marks.indexOf(selected) + 1} / ${marks.length}`;
  updateDetailSave();
  if (!dialog.open) { dialog.showModal(); document.body.style.overflow = 'hidden'; }
}
gallery.addEventListener('click', event => {
  const save = event.target.closest('[data-save]');
  const open = event.target.closest('[data-open]');
  if (save) toggleSave(save.dataset.save);
  else if (open) openDetail(open.dataset.open);
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; render(); }));
search.addEventListener('input', render);
document.querySelector('#reset').addEventListener('click', () => { filter = 'all'; search.value = ''; render(); search.focus(); });
document.querySelector('#my-collection').addEventListener('click', () => { filter = 'saved'; search.value = ''; render(); document.querySelector('#collection').scrollIntoView(); document.querySelector('[data-filter="saved"]').focus({ preventScroll: true }); });
document.querySelector('#close-detail').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (selected) gallery.querySelector(`[data-open="${selected.id}"]`)?.focus({ preventScroll: true }); });
dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close(); });
document.querySelector('#detail-save').addEventListener('click', () => toggleSave(selected.id));
function navigateDetail(direction) { const nextIndex = (marks.indexOf(selected) + direction + marks.length) % marks.length; openDetail(marks[nextIndex].id); }
document.querySelector('#previous').addEventListener('click', () => navigateDetail(-1));
document.querySelector('#next').addEventListener('click', () => navigateDetail(1));
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') navigateDetail(-1); if (event.key === 'ArrowRight') navigateDetail(1); });
render();
