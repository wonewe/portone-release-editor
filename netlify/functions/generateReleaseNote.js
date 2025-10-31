const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DEFAULT_CONTENT = {
  hero_date: '10월 31일의',
  hero_title: '정발행 세금계산서 출시 안내',
  hero_intro: '안녕하세요 포트원 파트너정산 팀입니다. /n 8월 21일, 정발행 세금계산서를 콘솔에서 이용하실 수 있는 업데이트가 진행되어 안내드립니다. /n 이제 공급자가 직접 세금계산서를 발행할 수 있어 거래처 신뢰성을 높이고, 세무 안정성을 강화할 수 있습니다. 기존 역발행과 함께, 정발행을 모두 지원하여 다양한 거래 상황에 유연하게 대응할 수 있습니다.',
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
      body: '이제, 역발행 뿐 아니라 정발행 기능을 콘솔에서 사용할 수 있습니다. 단건 발행 및 일괄 발행으로 정발행 세금계산서를 발행할 수 있게 되어 정산뿐만 아니라 모든 거래에 대한 세금계산서 커버가 가능해집니다. 기존 역발행과 다르게 정발행은 파트너 등록 및 국세청 연동 없이 이용할 수 있으며, 파트너 등록을 하지 않더라도 정발행시 입력한 공급받는 자(거래처) 정보를 다시 불러와 사용할 수 있습니다.',
    },
    {
      label: '엑셀, CSV 일괄 정/역발행',
      title: '세금계산서를 엑셀과 CSV로 간편하게 일괄 발행할 수 있습니다.',
      body: '기존 일괄 세금계산서 발행은 CSV 파일만 지원되었지만, 이번 업데이트를 통해 엑셀 파일 업로드도 가능해집니다. 제공되는 엑셀 및 CSV 파일 양식을 다운로드 받아 일괄적으로 세금계산서를 작성하여 업로드할 수 있습니다. 기존 역발행과 동일하게 미리보기 후 임시 저장하거나 즉시 발행할 수 있습니다.',
    },
    {
      label: '세금계산서 내역 관리',
      title: '세금계산서 내역과 일괄 세금계산서 내역 관리에 필터와 상태가 추가됩니다.',
      body: '기존 역발행 건과 정발행 건의 자연스러운 통합을 위해 세금계산서 내역 관리 페이지에 발행 유형 필터가 추가됩니다. 세금계산서 내역 테이블 내 사업자 정보 컬럼이 기존 공급자 정보에서 거래처(공급자/공급받는자) 정보로 변경되어 역발행의 경우 공급자, 정발행의 경우 공급받는자 정보가 표기됩니다. 일괄 세금계산서 내역 관리 페이지에서 발행 대기 상태와 발행 실패 상태가 추가됩니다. 발행 대기 상태는 일괄 세금계산서 발행 처리 중 상태를 의미하며 발행 실패 상태는 시스템 처리 실패를 의미합니다. 또한 정발행과 역발행을 구분하는 발행 유형 정보 및 필터가 추가됩니다'
    },
    {
      label: '세금계산서 안내 메일 발송',
      title: '공급받는 자에게 이메일이 발송됩니다.',
      body: '세금계산서를 발행하는 시점에 공급받는자 (고객) 에게 팝빌 (포트원과 연동된 세금계산서 서비스) 로부터 이메일이 발송됩니다. 공급자는 발행 주체이므로, 별도의 알림 이메일은 발송되지 않습니다.',
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
        hero_title: { type: 'string', description: '히어로 영역의 메인 제목' },
        hero_intro: { type: 'string', description: '히어로 영역의 도입 문장' },
        cards: {
          type: 'array',
          minItems: 4,
          maxItems: 4,
          items: {
            type: 'object',
            required: ['title', 'summary'],
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              summary: { type: 'string' },
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
              label: { type: 'string', description: '섹션 상단의 소제목/카테고리' },
              title: { type: 'string', description: '섹션 제목 (굵은 글씨)' },
              body: { type: 'string', description: '섹션 본문 내용' },
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
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'OPENAI_API_KEY 환경 변수가 설정되어 있지 않습니다.' }),
    };
  }

  let brief;
  try {
    const payload = JSON.parse(event.body || '{}');
    brief = (payload && payload.brief ? String(payload.brief) : '').trim();
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: '잘못된 JSON 본문입니다.' }),
    };
  }

  if (!brief) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'brief 필드를 입력해주세요.' }),
    };
  }

  try {
    const aiResult = await getReleaseDraftFromOpenAI({ apiKey, brief });

    const html = buildHtmlFromData(aiResult);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    };
  } catch (error) {
    console.error('AI generation handler error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.publicMessage || 'AI 작성 중 오류가 발생했습니다.';
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({ error: message }),
    };
  }
};

async function getReleaseDraftFromOpenAI({ apiKey, brief }) {
  // 1) 우선 Responses API 시도
  const responsesRes = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are an assistant that drafts concise Korean release notes for PortOne B2B customers. ' +
            'Respond using the provided JSON schema only. Focus on product improvements, automation tips, and clear action items.',
        },
        { role: 'user', content: `기획서:\n${brief}` },
      ],
      response_format: RESPONSE_SCHEMA,
    }),
  });

  const responsesData = await safeReadJson(responsesRes);
  if (responsesRes.ok) {
    const textContent =
      responsesData?.output?.[0]?.content?.[0]?.text ||
      responsesData?.output_text ||
      responsesData?.content?.[0]?.text;
    if (!textContent) {
      throw createPublicError(500, 'OpenAI 응답에서 텍스트를 찾을 수 없습니다.');
    }
    try {
      return JSON.parse(textContent);
    } catch (e) {
      console.error('JSON parsing failed (responses):', textContent);
      throw createPublicError(500, 'AI 응답을 JSON으로 변환할 수 없습니다.');
    }
  }

  // Responses 실패 → 자세한 오류 메시지 확보
  const openAiErrorMsg = extractOpenAIError(responsesData) || 'OpenAI API 호출 중 오류가 발생했습니다.';

  // 2) Chat Completions API로 폴백 시도 (일부 계정에서 Responses 미개통)
  const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
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
            'You are an assistant that drafts concise Korean release notes for PortOne B2B customers. ' +
            'Output strictly as minified JSON matching the given schema. No extra commentary.',
        },
        { role: 'user', content: `기획서:\n${brief}` },
      ],
      // Chat API의 json_schema 포맷 지원 모델에서만 동작. 미지원 시 minified JSON 강제 프롬프트에 의존.
      response_format: RESPONSE_SCHEMA,
      temperature: 0.2,
    }),
  });

  const chatData = await safeReadJson(chatRes);
  if (chatRes.ok) {
    const content = chatData?.choices?.[0]?.message?.content;
    if (!content) {
      throw createPublicError(500, 'OpenAI 응답에서 텍스트를 찾을 수 없습니다.');
    }
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('JSON parsing failed (chat):', content);
      throw createPublicError(500, 'AI 응답을 JSON으로 변환할 수 없습니다.');
    }
  }

  // 폴백도 실패 → 보다 구체적인 에러 표출
  const chatErrorMsg = extractOpenAIError(chatData);
  throw createPublicError(chatRes.status || 500, chatErrorMsg || openAiErrorMsg);
}

async function safeReadJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function extractOpenAIError(data) {
  return (
    data?.error?.message ||
    data?.message ||
    data?.error ||
    null
  );
}

function createPublicError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.publicMessage = message;
  return err;
}
function buildHtmlFromData(raw) {
  const content = {
    ...DEFAULT_CONTENT,
    ...sanitizeObject(raw),
  };

  content.cards = normalizeArray(content.cards, DEFAULT_CONTENT.cards);
  content.sections = normalizeArray(content.sections, DEFAULT_CONTENT.sections);

  const heroDate = escapeHtml(content.hero_date || DEFAULT_CONTENT.hero_date);
  const heroTitle = escapeHtml(content.hero_title || DEFAULT_CONTENT.hero_title);
  const heroIntro = escapeHtml(content.hero_intro || DEFAULT_CONTENT.hero_intro);
  const ctaBody = escapeHtml(content.cta_body || DEFAULT_CONTENT.cta_body);
  const ctaButtonText = escapeHtml(content.cta_button_text || DEFAULT_CONTENT.cta_button_text);
  const ctaUrl = escapeHtml(content.cta_url || DEFAULT_CONTENT.cta_url);
  const footerDate = escapeHtml(content.footer_date || DEFAULT_CONTENT.footer_date);
  const footerMessage = content.footer_message
    ? `${escapeHtml(content.footer_message)}<br><br>`
    : '';

  const cardCells = content.cards.map((card, index) => `
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
    const left = cardCells[i] || '';
    const right = cardCells[i + 1] || '';
    cardRows.push(`<tr>${left}${right}</tr>`);
  }

  const topCardRows = cardRows[0] || '';
  const bottomCardRows = cardRows[1] || '';

  const sectionBlocks = content.sections
    .map((section, index) => {
      const slotComment = `<!-- SLOT:section${index + 1} -->`;
      return `
              <!-- 섹션 ${index + 1} -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:16px 26px 6px;">
                    <p style="margin:0; font-size:16px; line-height:19px; font-weight:600; color:#2873ff;">${escapeHtml(
                      section.label
                    )}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 26px 10px;">
                    <p style="margin:0; font-size:20px; line-height:24px; font-weight:600; color:#111827;">${escapeHtml(
                      section.title
                    )}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 26px 16px;">
                    <p style="margin:0; font-size:16px; line-height:23px; color:#111827;">${escapeHtml(
                      section.body
                    )}</p>
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
                    <div style="border-top:1px solid #d1d5db; width:100%; font-size:0; line-height:0;">&nbsp;</div>
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

              <!-- 두 개의 하단 배너 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding:16px 0 16px;">
                    <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding-right:8px;">
                          <a href="https://developers.portone.io" target="_blank" rel="noopener" style="text-decoration:none;">
                            <img src="https://share1.cloudhq-mkt3.net/eb86f6f97c4332.png" width="296" alt="파트너 정산 기능을 더 자세히 알고싶다면?" style="display:block; border-radius:12px; border:0;">
                          </a>
                        </td>
                        <td align="center" style="padding-left:8px;">
                          <a href="https://blog.portone.io/?filter=%ED%94%8C%EB%9E%AB%ED%8F%BC%20%EC%A0%95%EC%82%B0" target="_blank" rel="noopener" style="text-decoration:none;">
                            <img src="https://share1.cloudhq-mkt3.net/43932b6afdba7f.png" width="296" alt="파트너 정산 도입 사례가 궁금하다면?" style="display:block; border-radius:12px; border:0;">
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:16px 26px 32px;">
                <tr>
                  <td style="padding:12px 0; text-align:center;">
                    <p style="margin:0 0 16px; font-size:16px; line-height:24px; color:#111827;">${ctaBody}</p>
                    <a href="${ctaUrl}" target="_blank" rel="noopener" style="display:inline-block; padding:12px 28px; background:#2873ff; color:#ffffff; border-radius:999px; font-weight:600; text-decoration:none;">
                      ${ctaButtonText}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 푸터 -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="padding:16px 26px 24px;">
                    <p style="margin:0; font-size:12px; line-height:17px; color:#4b5563;">
                      작성일자: ${footerDate}<br>
                      ${footerMessage}일반 문의: <a href="mailto:cs@portone.io" target="_blank" rel="noopener" style="color:#4b5563; text-decoration:underline; font-weight:600;">cs@portone.io</a> 또는 <span style="font-weight:600;">채널톡</span><br>
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
  const clone = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      clone[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? sanitizeObject(item) : item
      );
    } else if (typeof value === 'object') {
      clone[key] = sanitizeObject(value);
    } else {
      clone[key] = String(value);
    }
  });
  return clone;
}

function normalizeArray(input, fallbackArray) {
  if (!Array.isArray(input) || input.length === 0) return fallbackArray;
  const normalized = input
    .slice(0, fallbackArray.length)
    .map((item, index) => ({
      ...fallbackArray[index],
      ...sanitizeObject(item),
    }));
  while (normalized.length < fallbackArray.length) {
    normalized.push(fallbackArray[normalized.length]);
  }
  return normalized;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
