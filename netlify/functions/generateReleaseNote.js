const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DEFAULT_CONTENT = {
  hero_date: '10월 31일의',
  hero_title: '정발행 세금계산서 출시 안내',
  hero_intro:
    '안녕하세요 포트원 파트너정산 팀입니다. 8월 21일, 정발행 세금계산서를 콘솔에서 이용하실 수 있는 업데이트가 진행되어 안내드립니다. 이제 공급자가 직접 세금계산서를 발행할 수 있어 거래처 신뢰성을 높이고, 세무 안정성을 강화할 수 있습니다. 기존 역발행과 함께, 정발행을 모두 지원하여 다양한 거래 상황에 유연하게 대응할 수 있습니다.',
  cards: [
    { title: '세금계산서 정발행 기능 출시', summary: '정발행 세금계산서를 발행하고 관리' },
    { title: '엑셀, CSV 일괄 정/역발행', summary: '세금계산서를 엑셀과 CSV로 일괄 발행' },
    { title: '세금계산서 내역 관리', summary: '내역 관리 페이지에서 필터와 상태 추가' },
    { title: '세금계산서 안내 메일 발송', summary: '공급받는자에게 이메일 발송' },
  ],
  sections: [
    {
      label: '세금계산서 정발행 기능 출시',
      title: '고객에게 발행하는 정발행 세금계산서를 발행하고 관리할 수 있습니다.',
      body:
        '이제, 역발행 뿐 아니라 정발행 기능을 콘솔에서 사용할 수 있습니다. 단건 발행 및 일괄 발행으로 정발행 세금계산서를 발행할 수 있게 되어 정산뿐만 아니라 모든 거래에 대한 세금계산서 커버가 가능해집니다. 기존 역발행과 다르게 정발행은 파트너 등록 및 국세청 연동 없이 이용할 수 있으며, 파트너 등록을 하지 않더라도 정발행시 입력한 공급받는 자(거래처) 정보를 다시 불러와 사용할 수 있습니다.',
    },
    {
      label: '엑셀, CSV 일괄 정/역발행',
      title: '세금계산서를 엑셀과 CSV로 간편하게 일괄 발행할 수 있습니다.',
      body:
        '기존 일괄 세금계산서 발행은 CSV 파일만 지원되었지만, 이번 업데이트를 통해 엑셀 파일 업로드도 가능해집니다. 제공되는 엑셀 및 CSV 파일 양식을 다운로드 받아 일괄적으로 세금계산서를 작성하여 업로드할 수 있습니다. 기존 역발행과 동일하게 미리보기 후 임시 저장하거나 즉시 발행할 수 있습니다.',
    },
    {
      label: '세금계산서 내역 관리',
      title: '세금계산서 내역과 일괄 세금계산서 내역 관리에 필터와 상태가 추가됩니다.',
      body:
        '기존 역발행 건과 정발행 건의 자연스러운 통합을 위해 세금계산서 내역 관리 페이지에 발행 유형 필터가 추가됩니다. 세금계산서 내역 테이블 내 사업자 정보 컬럼이 기존 공급자 정보에서 거래처(공급자/공급받는자) 정보로 변경되어 역발행의 경우 공급자, 정발행의 경우 공급받는자 정보가 표기됩니다. 일괄 세금계산서 내역 관리 페이지에서 발행 대기 상태와 발행 실패 상태가 추가됩니다. 발행 대기 상태는 일괄 세금계산서 발행 처리 중 상태를 의미하며 발행 실패 상태는 시스템 처리 실패를 의미합니다. 또한 정발행과 역발행을 구분하는 발행 유형 정보 및 필터가 추가됩니다',
    },
    {
      label: '세금계산서 안내 메일 발송',
      title: '공급받는 자에게 이메일이 발송됩니다.',
      body:
        '세금계산서를 발행하는 시점에 공급받는자 (고객) 에게 팝빌 (포트원과 연동된 세금계산서 서비스) 로부터 이메일이 발송됩니다. 공급자는 발행 주체이므로, 별도의 알림 이메일은 발송되지 않습니다.',
    },
  ],
  footer_date: '2025년 10월 31일',
};

const RESPONSE_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'portone_release_note_draft',
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['hero_date', 'hero_title', 'hero_intro', 'cards', 'sections'],
      properties: {
        hero_date: { type: 'string', description: '예: 10월 31일' },
        hero_title: {
          type: 'string',
          description: '짧은 제목 (간결, 명령문/명사형)',
          maxLength: 40,
        },
        hero_intro: {
          type: 'string',
          description: '인사로 시작하고 길지 않게 요약 (예: 안녕하세요 …)',
          maxLength: 160,
        },
        cards: {
          type: 'array',
          minItems: 4,
          maxItems: 4,
          items: {
            type: 'object',
            required: ['title', 'summary'],
            additionalProperties: false,
            properties: {
              title: { type: 'string', maxLength: 28 },
              summary: { type: 'string', maxLength: 90 },
            },
          },
        },
        sections: {
          type: 'array',
          minItems: 4,
          maxItems: 4,
          items: {
            type: 'object',
            required: ['label', 'title', 'body'],
            additionalProperties: false,
            properties: {
              label: { type: 'string', maxLength: 20 },
              title: { type: 'string', maxLength: 70 },
              body: { type: 'string', maxLength: 800 },
            },
          },
        },
        footer_date: { type: 'string', description: '푸터 작성일자' },
      },
    },
  },
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'OPENAI_API_KEY 환경 변수가 설정되어 있지 않습니다.' }) };
  }

  let brief;
  try {
    const payload = JSON.parse(event.body || '{}');
    brief = (payload && payload.brief ? String(payload.brief) : '').trim();
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: '잘못된 JSON 본문입니다.' }) };
  }
  if (!brief) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'brief 필드를 입력해주세요.' }) };
  }

  try {
    const aiResult = await getDraft({ apiKey, brief });
    const html = buildHtmlFromData(aiResult, brief);
    return { statusCode: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ html }) };
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.publicMessage || 'AI 작성 중 오류가 발생했습니다.';
    return { statusCode, headers: corsHeaders, body: JSON.stringify({ error: message, detail: error.detail || undefined }) };
  }
};

async function getDraft({ apiKey, brief }) {
  // 1) Responses API (gpt-4o-mini)
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content:
            '역할: 당신은 PortOne B2B 고객용 릴리즈 노트를 한국어로 간결하게 작성하는 비서입니다.\n' +
            '- JSON 스키마에 정확히 맞춰서만 응답하세요(추가 필드 금지).\n' +
            '- hero_title: 매우 짧은 제목(명사형/명령형, 최대 40자).\n' +
            "- hero_intro: 반드시 '안녕하세요'로 시작하고 한 문장으로 짧게 요약(최대 160자).\n" +
            '- cards: 4개, title은 최대 28자, summary는 최대 90자.\n' +
            '- sections: 4개, label 최대 20자, title 최대 70자, body 최대 800자.\n' +
            '- 모든 문자열은 줄바꿈 제거·공백 정리.\n',
        },
        { role: 'user', content: `기획서:\n${brief}` },
      ],
      response_format: RESPONSE_SCHEMA,
      temperature: 0.2,
    }),
  });
  const data = await safeJson(res);
  if (res.ok) {
    const text = data?.output?.[0]?.content?.[0]?.text || data?.output_text || data?.content?.[0]?.text;
    if (!text) throw createPublicError(500, 'OpenAI 응답에서 텍스트를 찾을 수 없습니다.');
    const parsed = parseJsonLenient(text);
    if (!parsed.ok) throw createPublicError(500, 'AI 응답을 JSON으로 변환할 수 없습니다.', { raw: text, error: parsed.error });
    return parsed.value;
  }

  // 자세한 에러 메시지 확보
  const openAiErr = extractOpenAIError(data) || 'OpenAI API 호출 중 오류가 발생했습니다.';

  // 2) Chat Completions 폴백
  const chat = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '역할: 한국어 릴리즈 노트 작성. JSON만 출력.\n' +
            '- hero_title: 짧은 제목(<=40자)\n' +
            "- hero_intro: '안녕하세요'로 시작, 한 문장(<=160자)\n" +
            '- cards: 4개, title<=28자, summary<=90자\n' +
            '- sections: 4개, label<=20자, title<=70자, body<=800자\n' +
            '- 추가 텍스트/설명 금지. JSON 외 출력 금지.',
        },
        { role: 'user', content: `기획서:\n${brief}` },
      ],
      temperature: 0.2,
    }),
  });
  const chatData = await safeJson(chat);
  if (chat.ok) {
    const content = chatData?.choices?.[0]?.message?.content;
    if (!content) throw createPublicError(500, 'OpenAI 응답에서 텍스트를 찾을 수 없습니다.');
    const parsed = parseJsonLenient(content);
    if (!parsed.ok) throw createPublicError(500, 'AI 응답을 JSON으로 변환할 수 없습니다.', { raw: content, error: parsed.error });
    return parsed.value;
  }

  throw createPublicError(chat.status || 500, extractOpenAIError(chatData) || openAiErr, { responses: data, chat: chatData });
}

function createPublicError(statusCode, message, detail) {
  const e = new Error(message);
  e.statusCode = statusCode;
  e.publicMessage = message;
  if (detail) e.detail = detail;
  return e;
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

function extractOpenAIError(d) {
  return d?.error?.message || d?.message || d?.error || null;
}

function parseJsonLenient(text) {
  try {
    // 1) 그대로 시도
    return { ok: true, value: JSON.parse(text) };
  } catch (e1) {
    try {
      // 2) ```json ... ``` 혹은 ``` ... ``` 제거
      const unfenced = text.replace(/```json\s*([\s\S]*?)\s*```/i, '$1').replace(/```\s*([\s\S]*?)\s*```/g, '$1').trim();
      return { ok: true, value: JSON.parse(unfenced) };
    } catch (e2) {
      try {
        // 3) 첫 여는 중괄호부터 마지막 닫는 중괄호까지 추출
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const sliced = text.slice(start, end + 1);
          return { ok: true, value: JSON.parse(sliced) };
        }
      } catch (e3) {
        // fallthrough
      }
      return { ok: false, error: e2?.message || e1?.message || 'parse-failed' };
    }
  }
}

function ensureDraft(ai, brief) {
  const normalizedBrief = String(brief || '').replace(/\s+/g, ' ').trim();
  const fallbackTitle = normalizedBrief.slice(0, 40) || '업데이트 안내';
  const today = new Date();
  const fallbackDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const normalize = (v, max = 300) => String(v || '').replace(/\s+/g, ' ').trim().slice(0, max);

  const hero_date = normalize(ai.hero_date || fallbackDate, 30);
  const hero_title = normalize(ai.hero_title || fallbackTitle, 80);
  const hero_intro = normalize(ai.hero_intro || normalizedBrief, 240);
  const footer_date = normalize(ai.footer_date || fallbackDate, 30);

  // 카드/섹션 추출: brief에서 키워드 기반으로 4개 후보를 생성
  const keywords = extractKeywordsFromBrief(normalizedBrief);
  const generatedCards = Array.from({ length: 4 }, (_, i) => ({
    title: keywords[i] || `항목 ${i + 1}`,
    summary: normalize(normalizedBrief, 100) || `세부 내용 ${i + 1}`,
  }));

  const generatedSections = Array.from({ length: 4 }, (_, i) => ({
    label: keywords[i] || `섹션 ${i + 1}`,
    title: `${keywords[i] || `섹션 ${i + 1}`} 상세`,
    body: normalize(normalizedBrief, 360) || `${keywords[i] || `섹션 ${i + 1}`}에 대한 설명`,
  }));

  const cards = Array.isArray(ai.cards) && ai.cards.length > 0 ? ai.cards.slice(0,4) : generatedCards;
  const sections = Array.isArray(ai.sections) && ai.sections.length > 0 ? ai.sections.slice(0,4) : generatedSections;

  // 각 카드/섹션의 필수 필드 보정(비어 있으면 간단히 채움)
  const safeCards = Array.from({ length: 4 }, (_, i) => ({
    title: normalize(cards[i]?.title || generatedCards[i].title, 60),
    summary: normalize(cards[i]?.summary || generatedCards[i].summary, 120),
  }));
  const safeSections = Array.from({ length: 4 }, (_, i) => ({
    label: normalize(sections[i]?.label || generatedSections[i].label, 30),
    title: normalize(sections[i]?.title || generatedSections[i].title, 80),
    body: normalize(sections[i]?.body || generatedSections[i].body, 700),
  }));

  return { hero_date, hero_title, hero_intro, footer_date, cards: safeCards, sections: safeSections };
}

function extractKeywordsFromBrief(text) {
  if (!text) return [];
  // 숫자 목록, 쉼표, 슬래시 기준으로 분리 후 중요한 단어만 추출
  const parts = text
    .split(/\n|\r|\d+[)\.\-]\s+|,|\/|・|·/)
    .map((s) => s.trim())
    .filter(Boolean);
  const top = [];
  for (const p of parts) {
    // 너무 짧거나 일반적인 단어는 제외
    if (p.length < 2) continue;
    if (/^카드|섹션|라벨|제목|본문|요약$/i.test(p)) continue;
    top.push(p.slice(0, 20));
    if (top.length >= 6) break;
  }
  // 키워드가 거의 없으면 제목/브리프 일부로 대체
  if (top.length === 0) return [text.slice(0, 12)];
  return top;
}

function buildHtmlFromData(raw, brief) {
  // AI 값만 사용 (DEFAULT_CONTENT 미사용)
  const ai = sanitizeObject(raw || {});
  const ensured = ensureDraft(ai, brief || '');

  const heroDate = escapeHtml(ensured.hero_date || '');
  const heroTitle = escapeHtml(ensured.hero_title || '');
  const heroIntro = escapeHtml(ensured.hero_intro || '');
  const footerDate = escapeHtml(ensured.footer_date || '');

  const cardsInput = ensured.cards.map(sanitizeObject);
  const sectionsInput = ensured.sections.map(sanitizeObject);

  const cardCells = cardsInput.map((card, index) => `
                  <td width="50%" valign="top" style="${index % 2 === 0 ? 'padding-right:8px;' : 'padding-left:8px;'}">
                    <table role="presentation" width="260" height="140" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate; border-radius:16px; background:#f5f8ff;">
                      <tr>
                        <td valign="middle" align="center" style="padding:0; height:140px; text-align:center;">
                          <div style="font-size:24px; line-height:32px; color:#2873ff;">${['➊','➋','➌','➍'][index] || '•'}</div>
                          <p style="margin:6px 0 0; font-size:18px; line-height:21px; font-weight:600; color:#111827;">${escapeHtml(card.title)}</p>
                          <p style="margin:2px 0 0; font-size:14px; line-height:17px; font-weight:500; color:#4b5563;">${escapeHtml(card.summary)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>`);

  const cardRows = [];
  for (let i = 0; i < cardCells.length; i += 2) {
    cardRows.push(`<tr>${cardCells[i] || ''}${cardCells[i + 1] || ''}</tr>`);
  }
  const topCardRows = cardRows[0] || '';
  const bottomCardRows = cardRows[1] || '';

  const sectionBlocks = sectionsInput
    .map((section, index) => {
      const slotComment = `<!-- SLOT:section${index + 1} -->`;
      return `
              <!-- 섹션 ${index + 1} -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:16px 26px 6px;">
                    <p style="margin:0; font-size:16px; line-height:19px; font-weight:600; color:#2873ff;">${escapeHtml(section.label)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 26px 10px;">
                    <p style="margin:0; font-size:20px; line-height:24px; font-weight:600; color:#111827;">${escapeHtml(section.title)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 26px 16px;">
                    <p style="margin:0; font-size:16px; line-height:23px; color:#111827;">${escapeHtml(section.body)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px;" align="center">
        ${slotComment}
                  </td>
                </tr>
              </table>

              <!-- 구분선 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:16px 26px 16px;">
                    <div style="border-top:1px solid #d1d5db; width="100%"; font-size:0; line-height:0;">&nbsp;</div>
                  </td>
                </tr>
              </table>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>PortOne 업데이트</title>
</head>
<body style="margin:0; padding:0; width:100%; background:#ffffff;">
  <!-- wrapper -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0; table-layout:fixed;">
    <tr>
      <td align="center">
        <!-- container -->
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0; font-family:Pretendard, Tahoma, Arial, sans-serif; width:600px; min-width:600px;">
          <tr>
            <td style="padding:0;">
              <!-- 헤더 이미지 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding:0 0 16px 0;">
                    <img src="https://share1.cloudhq-mkt3.net/1189373c84d5d6.png" width="600" height="200" alt="" style="display:block; width:600px; height:auto; border:0; outline:none; text-decoration:none;">
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding:16px 26px;">
                    <p style="margin:0; font-size:20px; line-height:24px; font-weight:600; color:#111827;">
                      <span style="color:#2873ff;">${heroDate}</span> 반가운 포트원 소식
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding:16px 26px 6px;">
                    <h3 style="margin:0; font-size:24px; line-height:28px; font-weight:700; color:#111827;">${heroTitle}</h3>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding:6px 26px 16px;">
                    <p style="margin:0; font-size:16px; line-height:23px; color:#111827; font-weight:400;">${heroIntro}</p>
                  </td>
                </tr>
              </table>

              <!-- 2컬럼 카드 영역 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:16px 26px 14px;">
                ${topCardRows}
              </table>

              <!-- 2컬럼 카드 영역 2 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:16px 26px 23px;">
                ${bottomCardRows}
              </table>

              <!-- 구분선 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:16px 26px 16px;">
                    <div style="border-top:1px solid #d1d5db; width:100%; line-height:0; font-size:0;">&nbsp;</div>
                  </td>
                </tr>
              </table>

${sectionBlocks}

              <!-- 푸터 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="padding:16px 26px 24px;">
                    <p style="margin:0; font-size:12px; line-height:17px; color:#4b5563;">
                      작성일자: ${footerDate}<br>
                      일반 문의: <a href="mailto:cs@portone.io" target="_blank" rel="noopener" style="color:#4b5563; text-decoration:underline; font-weight:600;">cs@portone.io</a> 또는 <span style="font-weight:600;">채널톡</span><br>
                      기술지원 문의: <a href="mailto:support.b2b@portone.io" target="_blank" rel="noopener" style="color:#4b5563; text-decoration:underline; font-weight:600;">support.b2b@portone.io</a> 또는 파트너스 슬랙 채널<br><br>
                      서울특별시 성동구 성수이로20길 16 제이케이타워 4층<br>
                      Copyright © 2025 PortOne Korea Corp. All rights reserved.<br><br>
                      <img src="https://share1.cloudhq-mkt3.net/6a54b5238d7802.png" width="94" height="16" alt="" style="display:block; border:0;">
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 26px 16px; font-size:10px; color:#999999;">
                    <a href="$%unsubscribe%$" style="color:#999999; text-decoration:none;">수신거부</a>
                  </td>
                </tr>
                <tr>
                  <td style="height:16px; line-height:16px; font-size:0;">&nbsp;</td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!-- /container -->
      </td>
    </tr>
  </table>
  <!-- /wrapper -->
</body>
</html>`;
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) out[k] = v.map((i) => (typeof i === 'object' && i !== null ? sanitizeObject(i) : i));
    else if (typeof v === 'object') out[k] = sanitizeObject(v);
    else out[k] = String(v);
  });
  return out;
}

// normalize helpers는 더 이상 사용하지 않습니다 (AI 값만 사용)

function escapeHtml(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}


