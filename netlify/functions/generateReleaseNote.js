const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DEFAULT_CONTENT = {
  hero_date: '2025년 3월 2주차',
  hero_title: 'PortOne 주요 업데이트',
  hero_intro: '이번 릴리즈에서는 자동화와 운영 효율을 높일 수 있는 기능 개선 사항을 중심으로 안내드립니다.',
  cards: [
    { title: '정산 자동화', summary: '지급 일정 자동화와 드릴다운 리포트가 새로 추가되었습니다.' },
    { title: 'API 개선', summary: 'Webhook 응답 구조가 단순해지고 누락 알림 안전장치가 강화되었습니다.' },
    { title: '운영 도구', summary: '고객지원 팀을 위한 권한 관리와 히스토리 추적 기능이 공개됩니다.' },
    { title: '새로운 인사이트', summary: '일간 대시보드에 추세 비교와 예상 누락 탐지가 표시됩니다.' },
  ],
  sections: [
    {
      label: '정산/회계',
      title: '정산 일정 자동화 기능이 베타에서 정식 전환됩니다',
      body: '정산 대상 추출, 지급 승인, 전표 업로드까지 모든 단계가 자동 실행됩니다. 수기 처리 시간을 크게 줄일 수 있습니다.',
    },
    {
      label: '개발자 경험',
      title: 'Webhook 재시도 로직과 서명 검증이 간소화됩니다',
      body: '신규 SDK와 함께 서명 검증이 표준화되고, 실패 알림을 자동으로 슬랙/이메일로 받을 수 있습니다.',
    },
    {
      label: '운영 도구',
      title: '고객지원 도구에 상세 로그와 역할 기반 권한이 추가됩니다',
      body: '각 팀에 필요한 기능만 노출하도록 역할을 분리하고, 모든 변경 이력을 검색할 수 있습니다.',
    },
    {
      label: '데이터 인사이트',
      title: '일간 대시보드에 추세 비교와 목표 대비 지표가 공개됩니다',
      body: '주요 매출 지표와 전주 대비 추세를 한 화면에서 볼 수 있으며, 이상 감지 알림을 설정할 수 있습니다.',
    },
  ],
  cta_body: '신규 기능은 포트원 콘솔 > 설정 > 실험실 메뉴에서 바로 경험할 수 있습니다.',
  cta_button_text: '콘솔에서 살펴보기',
  cta_url: 'https://console.portone.io',
  footer_date: '2025-03-12',
  footer_message: '이번 업데이트가 파트너 여러분의 운영 효율을 높이는 데 도움이 되길 바랍니다.',
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
        hero_date: { type: 'string', description: '예: 2025년 3월 2주차' },
        hero_title: { type: 'string', description: '히어로 영역의 메인 제목' },
        hero_intro: { type: 'string', description: '히어로 영역의 간단한 도입 문장' },
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
        cta_body: { type: 'string', description: 'CTA 영역의 설명 문장' },
        cta_button_text: { type: 'string', description: 'CTA 버튼 라벨' },
        cta_url: { type: 'string', description: 'CTA 버튼 링크 URL' },
        footer_date: { type: 'string', description: '푸터 작성일자' },
        footer_message: { type: 'string', description: '푸터에서 전달할 추가 메시지' },
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
    const response = await fetch('https://api.openai.com/v1/responses', {
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
          {
            role: 'user',
            content: `기획서:\n${brief}`,
          },
        ],
        response_format: RESPONSE_SCHEMA,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error response:', data);
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'OpenAI API 호출 중 오류가 발생했습니다.' }),
      };
    }

    const textContent =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output?.text ||
      data?.content?.[0]?.text;

    if (!textContent) {
      throw new Error('OpenAI 응답에서 텍스트를 찾을 수 없습니다.');
    }

    let aiResult;
    try {
      aiResult = JSON.parse(textContent);
    } catch (error) {
      console.error('JSON parsing failed:', textContent);
      throw new Error('AI 응답을 JSON으로 변환할 수 없습니다.');
    }

    const html = buildHtmlFromData(aiResult);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    };
  } catch (error) {
    console.error('AI generation handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'AI 작성 중 오류가 발생했습니다.' }),
    };
  }
};

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
