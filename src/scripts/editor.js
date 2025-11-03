document.body.classList.add('theme-payments');
requestAnimationFrame(() => {
  document.querySelector('.intro-title')?.classList.add('visible');
  document.querySelector('.intro-sub')?.classList.add('visible');
});

const htmlInput = document.getElementById('htmlInput');
const htmlOutput = document.getElementById('htmlOutput');
const preview = document.getElementById('preview');
const textEditor = document.getElementById('textEditor');
const loadBtn = document.getElementById('loadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const aiBrief = document.getElementById('aiBrief');
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const aiStatus = document.getElementById('aiStatus');
const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const copyStatus = document.getElementById('copyStatus');
const saveHtmlBtn = document.getElementById('saveHtmlBtn');
const saveStatus = document.getElementById('saveStatus');
const docTypeBadge = document.getElementById('docTypeBadge');
const templateLabels = { release: '릴리즈노트', notice: '공지사항' };
const productLabels = { payments: '전자결제', finance: '재무솔루션' };
const defaultProductKey = 'payments';
const BASE_PREVIEW_WIDTH = 600;
const STORAGE_KEY = 'portoneSavedDocs';
const searchParams = new URLSearchParams(window.location.search);
const requestedTemplate = (searchParams.get('type') || '').toLowerCase();
const requestedProduct = (searchParams.get('product') || '').toLowerCase();
const initialTemplateKey =
  requestedTemplate && Object.prototype.hasOwnProperty.call(templateLabels, requestedTemplate)
    ? requestedTemplate
    : 'release';
let currentTemplateKey = initialTemplateKey;
let currentProductKey =
  requestedProduct && Object.prototype.hasOwnProperty.call(productLabels, requestedProduct)
    ? requestedProduct
    : defaultProductKey;
if (currentTemplateKey !== 'release') {
  currentProductKey = null;
}
let previewCanvasWrapper = null;
let previewCanvas = null;
let scaleRaf = null;
let currentSavedId = searchParams.get('saved') || null;

const SLOT_CONFIG = {
  section1: {
    key: 'section1',
    label: '섹션 1 이미지 (line 439)',
    marker: '<!-- SLOT:section1 -->',
    indent: '        ',
    template: (url) =>
      `<img src="${url}" alt="섹션 1 이미지" style="display:block; width:600px; max-width:100%; height:auto; border:0;">`,
  },
  section2: {
    key: 'section2',
    label: '섹션 2 이미지 (line 476)',
    marker: '<!-- SLOT:section2 -->',
    indent: '        ',
    template: (url) =>
      `<img src="${url}" alt="섹션 2 이미지" style="display:block; width:600px; max-width:100%; height:auto; border:0;">`,
  },
  section3: {
    key: 'section3',
    label: '섹션 3 이미지 (line 513)',
    marker: '<!-- SLOT:section3 -->',
    indent: '        ',
    template: (url) =>
      `<img src="${url}" alt="섹션 3 이미지" style="display:block; width:600px; max-width:100%; height:auto; border:0;">`,
  },
  section4: {
    key: 'section4',
    label: '섹션 4 이미지 (line 550)',
    marker: '<!-- SLOT:section4 -->',
    indent: '        ',
    template: (url) =>
      `<img src="${url}" alt="섹션 4 이미지" style="display:block; width:600px; max-width:100%; height:auto; border:0;">`,
  },
};

const slotElements = Object.fromEntries(
  Object.keys(SLOT_CONFIG).map((key) => [
    key,
    {
      dropZone: document.querySelector(`.slot-drop[data-slot="${key}"]`),
      fileInput: document.querySelector(`.slot-file[data-slot="${key}"]`),
      pickButton: document.querySelector(`.slot-pick[data-slot="${key}"]`),
      status: document.querySelector(`.slot-status[data-slot="${key}"]`),
    },
  ])
);

const CLOUDINARY_DEFAULT = {
  cloudName: 'dcam5f9ci',
  uploadPreset: 'Portone',
};
let cloudinaryConfig = { ...CLOUDINARY_DEFAULT };

const releaseTemplateBase = htmlInput.value.trim();
const noticeTemplate = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PortOne 공지사항</title>
</head>
<body style="margin:0; padding:0; width:100%; background:#f3f4f6;">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0;">
<tr>
  <td align="center" style="padding:24px;">
    <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="width:600px; background:#ffffff; border-radius:16px; overflow:hidden; font-family:Pretendard, Tahoma, Arial, sans-serif;">
      <tr>
        <td style="padding:32px 32px 24px;">
          <p style="margin:0; font-size:14px; line-height:20px; color:#6b7280;">PortOne 공지</p>
          <h1 style="margin:8px 0 16px; font-size:28px; line-height:34px; color:#111827;">서비스 공지 제목을 입력하세요</h1>
          <p style="margin:0; font-size:16px; line-height:26px; color:#374151;">
            안녕하세요, 포트원입니다. 여기에 공지사항의 주요 내용을 작성해 주세요. 변경되는 내용, 일정, 영향 범위 등 필요한 정보를 자유롭게 기입할 수 있습니다.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 24px;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb; border-radius:12px;">
            <tr>
              <td style="padding:20px;">
                <h2 style="margin:0 0 12px; font-size:20px; line-height:26px; color:#FC6B2D;">주요 안내</h2>
                <p style="margin:0; font-size:16px; line-height:24px; color:#1f2937;">
                  - 일정: 2025년 2월 10일(월) 00:00 ~ 02:00<br>
                  - 영향 범위: 결제 승인 및 정산 조회 기능 일시 중단<br>
                  - 문의: support@portone.io
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 32px;">
          <p style="margin:0 0 16px; font-size:16px; line-height:24px; color:#374151;">
            더 자세한 내용은 아래 버튼을 눌러 확인해주세요.
          </p>
          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="background:#FC6B2D; border-radius:999px;">
                <a href="https://portone.io" target="_blank" rel="noopener" style="display:inline-block; padding:12px 32px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none;">
                  자세히 보기
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb; padding:24px 32px; color:#6b7280; font-size:12px; line-height:18px;">
          본 메일은 포트원 서비스 안내를 위해 발송되었습니다. 문의가 필요하시면 cs@portone.io 로 연락 주세요.
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
</body>
</html>
`.trim();

const HERO_IMAGES = {
  payments: 'https://res.cloudinary.com/dcam5f9ci/image/upload/v1762151305/y5fbvip7z7divgu4nbcp.png',
  finance: 'https://share1.cloudhq-mkt3.net/1189373c84d5d6.png',
};

const RELEASE_THEMES = {
  payments: { heroColor: '#FC6B2D', cardBg: '#fff4ec' },
  finance: { heroColor: '#2873FF', cardBg: '#f5f8ff' },
};

const templates = {
  release: releaseTemplateBase,
  notice: noticeTemplate,
};

let textNodes = [];
let isUploading = false;
let aiAbortController = null;

function setUploadStatus(message, isError = false) {
  if (!uploadStatus) return;
  uploadStatus.textContent = message;
  uploadStatus.classList.toggle('error', Boolean(isError));
}

function validateCloudinaryConfig() {
  const { cloudName, uploadPreset } = cloudinaryConfig;
  if (!cloudName || !uploadPreset || cloudName.startsWith('your_') || uploadPreset.startsWith('your_')) {
    setUploadStatus('Cloudinary 설정이 필요합니다. 코드 상단의 CLOUDINARY_DEFAULT 값을 실제 값으로 바꿔주세요.', true);
    return false;
  }
  return true;
}

function setSlotStatus(slotKey, message, isError = false) {
  const slot = slotElements[slotKey];
  if (!slot?.status) return;
  slot.status.textContent = message;
  slot.status.classList.toggle('error', Boolean(isError));
}

function copyToClipboard(value, successMessage) {
  const fallbackCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!ok) throw new Error('execCommand failed');
      setUploadStatus(successMessage);
      setCopyStatus(successMessage, false);
    } catch (error) {
      const message = '클립보드 복사에 실패했습니다.';
      setUploadStatus(message, true);
      setCopyStatus(message, true);
    }
  };

  if (!navigator.clipboard || window.isSecureContext === false) {
    fallbackCopy();
    return;
  }

  navigator.clipboard.writeText(value)
    .then(() => {
      setUploadStatus(successMessage);
      setCopyStatus(successMessage, false);
    })
    .catch(() => {
      fallbackCopy();
    });
}

function setCopyStatus(message, isError = false) {
  if (!copyStatus) return;
  copyStatus.textContent = message;
  copyStatus.classList.toggle('success', !isError);
  copyStatus.classList.toggle('error', Boolean(isError));
}

function setSaveStatus(message, isError = false) {
  if (!saveStatus) return;
  saveStatus.textContent = message;
  saveStatus.classList.toggle('success', !isError);
  saveStatus.classList.toggle('error', Boolean(isError));
}

function handleSaveDocument() {
  const html = (previewCanvas?.innerHTML || htmlOutput?.value || '').trim();
  if (!html) {
    setSaveStatus('저장할 HTML이 없습니다. 먼저 HTML을 불러오거나 생성하세요.', true);
    return;
  }
  let title = window.prompt('저장할 문서 제목을 입력해주세요.', '제목 없음');
  if (title === null) {
    setSaveStatus('저장이 취소되었습니다.', true);
    return;
  }
  title = String(title || '').trim();
  if (!title) {
    setSaveStatus('제목을 입력해야 저장할 수 있습니다.', true);
    return;
  }

  const docs = loadSavedDocs();
  const now = new Date().toISOString();
  if (currentSavedId) {
    const existing = docs.find((doc) => doc.id === currentSavedId);
    if (existing) {
      existing.title = title;
      existing.html = html;
      existing.type = currentTemplateKey;
      existing.product = currentTemplateKey === 'release' ? currentProductKey || defaultProductKey : null;
      existing.updatedAt = now;
    } else {
      currentSavedId = null;
    }
  }

  if (!currentSavedId) {
    currentSavedId = generateDocId();
    docs.push({
      id: currentSavedId,
      title,
      html,
      type: currentTemplateKey,
      product: currentTemplateKey === 'release' ? currentProductKey || defaultProductKey : null,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveDocsToStorage(docs);
  setSaveStatus(`"${title}" 문서를 저장했습니다.`, false);
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('saved', currentSavedId);
    url.searchParams.set('type', currentTemplateKey);
    if (currentTemplateKey === 'release' && currentProductKey) {
      url.searchParams.set('product', currentProductKey);
    } else {
      url.searchParams.delete('product');
    }
    window.history.replaceState(null, '', url.toString());
  } catch (error) {
    console.warn('Failed to update history state', error);
  }
  window.dispatchEvent(new Event('portoneSavedDocsUpdated'));
}

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

function findSavedDoc(id) {
  if (!id) return null;
  return loadSavedDocs().find((doc) => doc.id === id) || null;
}

function generateDocId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `doc-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function renderPreview(html) {
  preview.innerHTML = '';
  previewCanvasWrapper = document.createElement('div');
  previewCanvasWrapper.className = 'preview-canvas-wrapper';
  previewCanvas = document.createElement('div');
  previewCanvas.className = 'preview-canvas';
  previewCanvas.innerHTML = html;
  previewCanvasWrapper.appendChild(previewCanvas);
  preview.appendChild(previewCanvasWrapper);
  scheduleScalePreview();
  refreshSlotPreviewsFromHtml();
}

function scheduleScalePreview() {
  if (scaleRaf) cancelAnimationFrame(scaleRaf);
  scaleRaf = requestAnimationFrame(scalePreviewContent);
}

function scalePreviewContent() {
  scaleRaf = null;
  if (!previewCanvasWrapper || !previewCanvas) return;
  const containerWidth = Math.max(0, preview.clientWidth - 24);
  const contentWidth = previewCanvas.scrollWidth || BASE_PREVIEW_WIDTH;
  const scale = contentWidth > 0 ? Math.min(1, containerWidth / contentWidth) : 1;
  const scaledWidth = contentWidth * scale;
  previewCanvasWrapper.style.width = `${scaledWidth}px`;
  previewCanvasWrapper.style.minWidth = `${scaledWidth}px`;
  previewCanvasWrapper.style.maxWidth = `${scaledWidth}px`;
  previewCanvas.style.transform = `scale(${scale})`;
  previewCanvas.style.transformOrigin = 'top left';
  const rect = previewCanvas.getBoundingClientRect();
  previewCanvasWrapper.style.height = `${rect.height}px`;
  preview.scrollLeft = 0;
}

async function uploadImageForSlot(slotKey, file) {
  const config = SLOT_CONFIG[slotKey];
  if (!config) return;
  if (!validateCloudinaryConfig() || !file) return;
  if (isUploading) {
    setUploadStatus('다른 업로드 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.', true);
    return;
  }

  isUploading = true;
  setUploadStatus(`[${config.label}] "${file.name}" 업로드 중...`);
  setSlotStatus(slotKey, '업로드 중...');

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', cloudinaryConfig.uploadPreset);

  try {
    const response = await fetch(endpoint, { method: 'POST', body: data });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }
    const result = await response.json();
    applyImageToSlot(slotKey, result.secure_url);
    updateSlotPreview(slotKey, result.secure_url);
    setSlotStatus(slotKey, '업로드가 완료되었습니다.');
    setUploadStatus('업로드가 완료되었습니다.');
  } catch (error) {
    console.error('Cloudinary upload failed', error);
    setSlotStatus(slotKey, '업로드 중 오류가 발생했습니다.', true);
    setUploadStatus('업로드 중 오류가 발생했습니다. 설정을 확인해 주세요.', true);
  } finally {
    isUploading = false;
  }
}

async function handleSlotFiles(slotKey, fileList) {
  if (!fileList || fileList.length === 0) return;
  const files = Array.from(fileList).filter(file => file.type.startsWith('image/'));
  if (files.length === 0) {
    setSlotStatus(slotKey, '이미지 파일만 업로드할 수 있습니다.', true);
    setUploadStatus('이미지 파일만 업로드할 수 있습니다.', true);
    return;
  }
  for (const file of files) {
    await uploadImageForSlot(slotKey, file);
  }
}

async function generateReleaseNoteWithAI() {
  if (!aiBrief) return;
  const brief = aiBrief.value.trim();
  if (!brief) {
    if (aiStatus) {
      aiStatus.textContent = '기획서나 요구사항을 먼저 입력해주세요.';
      aiStatus.classList.add('error');
    }
    return;
  }

  if (aiStatus) {
    aiStatus.textContent = 'AI가 초안을 작성 중입니다...';
    aiStatus.classList.remove('error');
  }
  if (aiGenerateBtn) aiGenerateBtn.disabled = true;

  aiAbortController?.abort();
  aiAbortController = new AbortController();

  try {
    const response = await fetch('/api/generateReleaseNote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief }),
      signal: aiAbortController.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result?.html) {
      htmlInput.value = result.html;
      if (currentTemplateKey === 'release') {
        applyReleaseProductAdjustments();
      } else {
        applyProductTheme();
      }
      loadHtml();
      if (aiStatus) {
        aiStatus.textContent = 'AI 초안이 적용되었습니다. 필요에 따라 수정하세요.';
        aiStatus.classList.remove('error');
      }
    } else {
      throw new Error('AI 응답을 해석하지 못했습니다.');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      if (aiStatus) {
        aiStatus.textContent = 'AI 요청이 취소되었습니다.';
        aiStatus.classList.add('error');
      }
    } else {
      console.error('AI generation failed:', error);
      if (aiStatus) {
        aiStatus.textContent = `AI 작성 중 오류가 발생했습니다. ${error.message || ''}`.trim();
        aiStatus.classList.add('error');
      }
    }
  } finally {
    if (aiGenerateBtn) aiGenerateBtn.disabled = false;
    aiAbortController = null;
  }
}

function applyImageToSlot(slotKey, url) {
  const config = SLOT_CONFIG[slotKey];
  if (!config || !htmlInput) return;

  const html = htmlInput.value;
  const marker = config.marker;
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) {
    setSlotStatus(slotKey, '해당 섹션을 찾을 수 없습니다. 템플릿을 확인해주세요.', true);
    return;
  }

  const tdSignature = '<td style="padding:0 0 16px;" align="center">';
  const tdOpenIndex = html.lastIndexOf(tdSignature, markerIndex);
  if (tdOpenIndex === -1) {
    setSlotStatus(slotKey, '이미지를 배치할 <td> 영역을 찾을 수 없습니다.', true);
    return;
  }

  const contentStart = html.indexOf('>', tdOpenIndex) + 1;
  const tdCloseIndex = html.indexOf('</td>', contentStart);
  if (tdCloseIndex === -1) {
    setSlotStatus(slotKey, '</td> 태그를 찾지 못했습니다.', true);
    return;
  }

  const before = html.slice(0, markerIndex);
  const after = html.slice(tdCloseIndex);
  const snippet = `${config.indent}${marker}\n${config.indent}${config.template(url)}\n${config.indent}`;
  htmlInput.value = `${before}${snippet}${after}`;

  loadHtml();
  setSlotStatus(slotKey, `${config.label}가 업데이트되었습니다.`);
  setUploadStatus(`${config.label}가 업데이트되었습니다.`);
}

function updateSlotPreview(slotKey, url) {
  const config = SLOT_CONFIG[slotKey];
  const elements = slotElements[slotKey];
  if (!config || !elements?.preview) return;
  const snippet = config.template(url);

  elements.preview.innerHTML = `
    <img src="${url}" alt="${config.label}">
    <div class="uploaded-item-actions">
      <button type="button" data-action="copy-url">URL 복사</button>
      <button type="button" data-action="copy-img">&lt;img&gt; 태그 복사</button>
    </div>
  `;

  const actionButtons = elements.preview.querySelectorAll('button[data-action]');
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.action === 'copy-url') {
        copyToClipboard(url, '이미지 URL이 복사되었습니다.');
      } else {
        copyToClipboard(snippet, '<img> 태그가 복사되었습니다.');
      }
    });
  });
}

function refreshSlotPreviewsFromHtml() {
  const html = htmlInput?.value || '';
  Object.entries(SLOT_CONFIG).forEach(([slotKey, config]) => {
    const elements = slotElements[slotKey];
    if (!elements) return;

    const markerIndex = html.indexOf(config.marker);
    if (markerIndex === -1) {
      if (elements.preview) elements.preview.innerHTML = '';
      setSlotStatus(slotKey, '');
      return;
    }

    const tdSignature = '<td style="padding:0 0 16px;" align="center">';
    const tdOpenIndex = html.lastIndexOf(tdSignature, markerIndex);
    if (tdOpenIndex === -1) return;

    const contentStart = html.indexOf('>', tdOpenIndex) + 1;
    const tdCloseIndex = html.indexOf('</td>', contentStart);
    if (tdCloseIndex === -1) return;

    const contents = html.slice(contentStart, tdCloseIndex);
    const imgMatch = contents.match(/<img[^>]+src="([^"]+)"[^>]*>/i);

    if (imgMatch) {
      updateSlotPreview(slotKey, imgMatch[1]);
      setSlotStatus(slotKey, '현재 이미지가 설정되어 있습니다.');
    } else {
      if (elements.preview) elements.preview.innerHTML = '';
      setSlotStatus(slotKey, '이미지가 비어 있습니다.');
    }
  });
}

function applyReleaseProductAdjustments() {
  if (currentTemplateKey !== 'release') return;
  const heroUrl =
    HERO_IMAGES[currentProductKey] ||
    HERO_IMAGES[defaultProductKey] ||
    HERO_IMAGES.finance;
  htmlInput.value = htmlInput.value.replace(
    /<img src="[^"]+" width="600" height="200" alt=""/,
    `<img src="${heroUrl}" width="600" height="200" alt=""`
  );

  const theme = RELEASE_THEMES[currentProductKey] || RELEASE_THEMES[defaultProductKey];
  const baseTheme = RELEASE_THEMES[defaultProductKey];
  if (theme && baseTheme) {
    const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (baseTheme.heroColor) {
      Object.values(RELEASE_THEMES)
        .map((t) => t.heroColor)
        .filter((color) => color && color !== baseTheme.heroColor)
        .forEach((color) => {
          const regex = new RegExp(escapeRegex(color), 'gi');
          htmlInput.value = htmlInput.value.replace(regex, baseTheme.heroColor);
        });
    }
    if (baseTheme.cardBg) {
      Object.values(RELEASE_THEMES)
        .map((t) => t.cardBg)
        .filter((color) => color && color !== baseTheme.cardBg)
        .forEach((color) => {
          const regex = new RegExp(escapeRegex(color), 'gi');
          htmlInput.value = htmlInput.value.replace(regex, baseTheme.cardBg);
        });
    }
    if (theme.heroColor && baseTheme.heroColor && theme.heroColor !== baseTheme.heroColor) {
      const baseHeroRegex = new RegExp(baseTheme.heroColor, 'gi');
      htmlInput.value = htmlInput.value.replace(baseHeroRegex, theme.heroColor);
    }
    if (theme.cardBg && baseTheme.cardBg && theme.cardBg !== baseTheme.cardBg) {
      const baseCardRegex = new RegExp(baseTheme.cardBg, 'gi');
      htmlInput.value = htmlInput.value.replace(baseCardRegex, theme.cardBg);
    }
  }
  applyProductTheme();
}

function applyProductTheme() {
  document.body.classList.remove('theme-payments', 'theme-finance');
  if (currentTemplateKey === 'release') {
    const key = currentProductKey && productLabels[currentProductKey]
      ? currentProductKey
      : defaultProductKey;
    document.body.classList.add(key === 'finance' ? 'theme-finance' : 'theme-payments');
  } else {
    document.body.classList.add('theme-payments');
  }
  scheduleScalePreview();
}

function updateDocTypeBadge(key) {
  if (!docTypeBadge) return;
  if (key === 'release') {
    const productLabel = currentProductKey && productLabels[currentProductKey]
      ? productLabels[currentProductKey]
      : productLabels[defaultProductKey];
    docTypeBadge.textContent = `${templateLabels.release} · ${productLabel}`;
  } else if (key === 'notice') {
    docTypeBadge.textContent = `${templateLabels.notice} 템플릿`;
  } else {
    docTypeBadge.textContent = '사용자 지정 템플릿';
  }
}

function applyTemplate(key) {
  const template = templates[key];
  if (!template) return;
  currentTemplateKey = key;
  if (currentTemplateKey !== 'release') {
    currentProductKey = null;
  } else if (!currentProductKey || !productLabels[currentProductKey]) {
    currentProductKey = defaultProductKey;
  }
  htmlInput.value = template;
  if (currentTemplateKey === 'release') {
    applyReleaseProductAdjustments();
  } else {
    applyProductTheme();
  }
  updateDocTypeBadge(key);
  loadHtml();
}

function loadHtml() {
  const html = htmlInput.value;
  renderPreview(html);
  textEditor.innerHTML = '';
  textNodes = [];
  traverse(previewCanvas || preview);

  textNodes.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'text-item';

    const label = document.createElement('label');
    label.textContent = `텍스트 ${idx + 1}`;
    wrap.appendChild(label);

    const textarea = document.createElement('textarea');
    textarea.value = item.node.nodeValue.trim();
    textarea.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
      item.node.nodeValue = e.target.value;
      htmlOutput.value = (previewCanvas?.innerHTML || '').trim();
      scheduleScalePreview();
      if (currentSavedId) setSaveStatus('저장되지 않은 변경 사항이 있습니다.', true);
    });
    textarea.style.height = `${textarea.scrollHeight}px`;
    wrap.appendChild(textarea);

    textEditor.appendChild(wrap);
  });

  htmlOutput.value = (previewCanvas?.innerHTML || '').trim();
}

function traverse(node) {
  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.nodeValue.trim();
      if (text.length > 0) textNodes.push({ node: child });
    } else {
      traverse(child);
    }
  });
}

if (!validateCloudinaryConfig()) {
  // 이미 오류 메시지를 표시했으므로 추가 안내는 생략합니다.
} else {
  setUploadStatus('각 섹션 카드에 이미지를 드롭하거나 파일을 선택하세요.');
}

Object.entries(slotElements).forEach(([slotKey, elements]) => {
  if (elements.dropZone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      elements.dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        elements.dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
      elements.dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        elements.dropZone.classList.remove('dragover');
      });
    });

    elements.dropZone.addEventListener('drop', (event) => {
      handleSlotFiles(slotKey, event.dataTransfer?.files);
    });

    elements.dropZone.addEventListener('click', () => {
      elements.fileInput?.click();
    });
  }

  if (elements.pickButton && elements.fileInput) {
    elements.pickButton.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', () => {
      handleSlotFiles(slotKey, elements.fileInput.files);
      elements.fileInput.value = '';
    });
  }
});

loadBtn.addEventListener('click', loadHtml);
if (aiGenerateBtn) {
  aiGenerateBtn.addEventListener('click', generateReleaseNoteWithAI);
}
if (copyHtmlBtn) {
  copyHtmlBtn.addEventListener('click', () => {
    const value = htmlOutput?.value || '';
    if (!value) {
      setCopyStatus('복사할 HTML이 없습니다.', true);
      return;
    }
    copyToClipboard(value, '수정된 HTML이 복사되었습니다.');
  });
}
if (saveHtmlBtn) {
  saveHtmlBtn.addEventListener('click', handleSaveDocument);
}
window.addEventListener('resize', scheduleScalePreview);

const initialSavedDoc = findSavedDoc(currentSavedId);
if (initialSavedDoc) {
  currentTemplateKey = initialSavedDoc.type || 'release';
  if (currentTemplateKey !== 'release') {
    currentProductKey = null;
  } else {
    currentProductKey = initialSavedDoc.product || defaultProductKey;
  }
  htmlInput.value = initialSavedDoc.html || '';
  htmlOutput.value = initialSavedDoc.html || '';
  applyProductTheme();
  loadHtml();
  setSaveStatus(`"${initialSavedDoc.title || '제목 없음'}" 문서를 불러왔습니다.`, false);
} else {
  if (currentSavedId) {
    setSaveStatus('저장된 문서를 찾을 수 없습니다.', true);
    currentSavedId = null;
  }
  applyTemplate(initialTemplateKey);
}
