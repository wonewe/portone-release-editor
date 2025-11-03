const STORAGE_KEY = 'portoneSavedDocs';
const introTitle = document.getElementById('introTitle');
const introSub = document.getElementById('introSub');
const manageStorageBtn = document.getElementById('manageStorageBtn');

window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    introTitle?.classList.add('visible');
    introSub?.classList.add('visible');
  });
});

document.querySelectorAll('button[data-document-type]').forEach((button) => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-document-type') || 'release';
    const params = new URLSearchParams({ type });
    const product = button.getAttribute('data-product');
    if (product) params.set('product', product);
    window.location.href = `editor.html?${params.toString()}`;
  });
});

function loadSavedDocs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to parse saved docs', error);
    return [];
  }
}

function saveDocsToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.warn('Failed to store docs', error);
  }
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function renderSavedDocs() {
  const container = document.getElementById('savedDocsContainer');
  if (!container) return;
  const docs = loadSavedDocs().sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  container.innerHTML = '';
  if (docs.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'saved-empty';
    empty.textContent = '아직 저장된 문서가 없습니다. 편집기에서 저장하면 여기에서 확인할 수 있어요.';
    container.appendChild(empty);
    return;
  }

  docs.forEach((doc) => {
    const item = document.createElement('div');
    item.className = 'saved-item';

    const title = document.createElement('div');
    title.className = 'saved-item-title';
    title.textContent = doc.title || '제목 없음';

    const meta = document.createElement('div');
    meta.className = 'saved-item-meta';
    const timestamp = formatDate(doc.updatedAt);
    meta.textContent = timestamp || '';

    const actions = document.createElement('div');
    actions.className = 'saved-item-actions';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'primary';
    openBtn.textContent = '열기';
    openBtn.addEventListener('click', () => {
      const params = new URLSearchParams({ saved: doc.id });
      if (doc.type) params.set('type', doc.type);
      if (doc.product) params.set('product', doc.product);
      window.location.href = `editor.html?${params.toString()}`;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => {
      const ok = window.confirm(`"${doc.title || '제목 없음'}" 문서를 삭제할까요?`);
      if (!ok) return;
      const next = loadSavedDocs().filter((itemDoc) => itemDoc.id !== doc.id);
      saveDocsToStorage(next);
      renderSavedDocs();
      window.dispatchEvent(new Event('portoneSavedDocsUpdated'));
    });

    actions.appendChild(openBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(title);
    if (timestamp) item.appendChild(meta);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

if (manageStorageBtn) {
  manageStorageBtn.addEventListener('click', () => {
    const docs = loadSavedDocs();
    if (docs.length === 0) {
      alert('저장된 문서가 없습니다.');
      return;
    }
    const ok = window.confirm('저장된 문서를 모두 삭제할까요?');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    renderSavedDocs();
    window.dispatchEvent(new Event('portoneSavedDocsUpdated'));
  });
}

renderSavedDocs();
window.addEventListener('portoneSavedDocsUpdated', renderSavedDocs);
