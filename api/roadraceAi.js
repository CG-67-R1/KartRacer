/**
 * KartRacer AI – in-app Driver Coach & Kart Setup.
 * Uses OpenAI Chat Completions with a system prompt derived from ST (Track Day GPT).
 * API key must be set in OPENAI_API_KEY (server-side only).
 */

import OpenAI from 'openai';
import { enrichRulesSources } from './momsOnlineUrls.js';
import { prepareRulesQueryTokens, retrieveForRules } from './qa.js';
import { formatFaqsForPrompt, loadRiderAiFaqs } from './riderAiFaqs.js';
import { getAiPrompts, getPrimaryManifest } from './packLoader.js';
import { stripChatMarkdown } from './stripChatMarkdown.js';

function packAi() {
  return getAiPrompts() || {};
}

function coachHome() {
  return (
    packAi().coachHomeContext ||
    'You are an expert Australian kart racing coach. Junior-friendly, evidence-based, Australian spelling (tyre).'
  );
}

function bikeHome() {
  return (
    packAi().bikeSetupHomeContext ||
    'You are an expert Australian kart chassis tuner. Live axle, no motorcycle suspension. Cheap reversible changes first.'
  );
}

function askPriority() {
  return (
    packAi().askPriority ||
    'Priority: Australian karting (KA, AKC, state/club) first, then F1 / Supercars / IndyCar / F1 Academy / GT / NASCAR / WEC as general interest.'
  );
}

function webSearchCountry() {
  return packAi().webSearchCountry || getPrimaryManifest()?.isoCountries?.[0] || 'AU';
}

function rulesHome() {
  return (
    packAi().rulesHomeContext ||
    'You are a Karting Australia Manual rule-check assistant. Cite the 2026 Update 1 snapshot. Supp Regs override.'
  );
}

function rulesModeName() {
  return packAi().rulesModeName || '2026 Australian Karting Manual';
}

function localeContextLabel() {
  return getPrimaryManifest()?.displayName || 'Australian';
}

const COACH_SYSTEM = `${coachHome()} You give direct, practical karting advice.

Sign off exactly: KartRacer Coach — informational guidance only; change one thing at a time; brake, steering, or axle work should be checked by a qualified mechanic; a parent/guardian signs off changes for junior drivers.

Current mode: COACH. Focus on technique, cornering, braking (rear only on sprint karts; KZ2 adds front), race craft, lines, session feedback, and mental approach. Tyre advice from the KB is OK. No width/caster/axle/seat prescriptions — redirect those to chassis mode. Never invent corners or turn hands. Never advise car/bike trail-braking. If the user has not said class, chassis, or track, ask briefly but stay helpful. Be encouraging, junior-friendly, and concise.`;

const BIKESETUP_SYSTEM = `${bikeHome()} You give direct, practical kart chassis advice.

Sign off exactly: KartRacer Coach — informational guidance only; change one thing at a time; brake, steering, or axle work should be checked by a qualified mechanic; a parent/guardian signs off changes for junior drivers.

Stop-list before numeric setup: chassis make/model (950 vs 1050 matters); class + engine; tyre spec (LH03/LOH/LPM/Maxxis); track condition and weather; driver age group and weight. Missing → ask 2–4 questions; general theory only; Low confidence. Never invent per-class psi.

Fix priority (cheap + reversible first): pressures → hubs/track width → caster/camber/toe → ride height → axle/hubs → torsion bars/struts → seat. One change at a time. ≤0.1 bar per pressure step. Confirm it is not the driver before rewriting the chassis.

Current mode: CHASSIS. Setup only. No motorcycle suspension, sag, damping clicks, rake, or trail. Sprint karts brake with the rear only (KZ2 adds front). If required context is missing, give general principles only. Be encouraging, junior-friendly, and concise.`;

const ASK_SYSTEM = `You are a knowledgeable kart racing and motorsport Q&A assistant for KartRacer.

Current mode: GENERAL Q&A WITH WEB SEARCH. Answer factual questions about Australian karting first, then general motorsport history (Formula 1, Supercars, IndyCar, F1 Academy, GT, NASCAR, WEC) and karting-origin pathways.

Scope (critical):
- Prefer Australian karting (Karting Australia, AKC, state/club, classes, licences, venues).
- Pathway / general-interest series are in scope when the user asks (F1, Supercars, IndyCar, F1 Academy, GT, NASCAR, WEC).
- Do not answer as a motorcycle road-racing coach. Do not invent pressures, weights, restrictors, or calendar dates.

Search and priority:
- Use web search for factual claims. Prefer karting.net.au, KartSportNews, and official series sites.
- ${askPriority()}
- If search finds nothing reliable, say so clearly. Do not invent dates, results, venues, or rules.

Style:
- One clear, concise answer (a few short paragraphs at most). No sign-off joke.
- Mention key sources briefly when useful.
- If the user asks for personalized coaching, session feedback, corner-by-corner advice, or detailed chassis setup, give a brief general pointer only and tell them to use Driver Coach or Kart Setup.
- Official ${rulesModeName()} lookups belong in Official rule check? — do not invent clause numbers.
- Safety first. Junior-friendly language.
- Write in plain text for a phone chat bubble. Do not use Markdown. Do not start lines with hash marks. Do not wrap words in asterisks or backticks.`;

const RULES_SYSTEM = `${rulesHome()}

Current mode: OFFICIAL RULE CHECK. Answer ONLY from the Karting Australia Manual excerpts provided in this prompt. Do not use the internet, browsing, or general training knowledge for rule substance. Do not invent clause numbers or requirements.

Required answer format (plain text labels, no Markdown hashes or asterisks):
1) Answer — Plain-language yes/no or short explanation in everyday words (not a raw dump of the clause). Base it only on the excerpts.
2) Quote — Verbatim quotation from the most relevant excerpt (use the excerpt text; do not invent wording).
3) Citation — Exactly: KA Manual {edition}, {clauseId or Location}, effective {effectiveDate}. If edition/date are in the excerpt headers, use them. Never say only "the latest rule book uploaded".
4) Note — One line: club/series Supplementary Regulations may also apply; guidance only, not legal advice.

Rules:
- Prefer the excerpt whose Location/clauseId best matches the question.
- This corpus is the 2026 Australian Karting Manual Update 1 snapshot (kb-au-rules) plus class/tyre extracts. If excerpts do not cover the question, say so and do not guess.
- Keep answers concise. No coaching advice, no sign-off joke.
- Write in plain text for a phone chat bubble. Do not use Markdown. Do not start lines with hash marks. Do not wrap words in asterisks or backticks.`;

const SHARED_RULES = `

Style: Friendly, practical, safety first. Never make users feel bad about not knowing. ${localeContextLabel()} context.

Write in plain text for a phone chat bubble. Do not use Markdown. Do not start lines with hash marks. Do not wrap words in asterisks or backticks. Short paragraphs, numbered lists, and simple dashes are fine.

Limitations: You cannot physically inspect karts or guarantee lap times. Recommend a qualified mechanic for safety-critical or axle/brake/steering work. A parent/guardian signs off junior changes.

Driver vs chassis ambiguity: Drivers often do not know if a problem is technique or chassis setup. If the user's issue is clearly better handled by the other mode, give a short useful answer in your current mode, then say which tab to try next and why (e.g. lines / braking / race craft → Coach; pressures / width / caster / axle / seat → Kart Setup). End your reply with exactly one of these markers on its own last line (omit the marker if staying in the current mode):
[[SUGGEST_MODE:coach]]
[[SUGGEST_MODE:bikesetup]]`;

const SUGGEST_MODE_RE = /\[\[SUGGEST_MODE:(coach|bikesetup)\]\]\s*$/i;

/**
 * Strip optional [[SUGGEST_MODE:...]] trailer from model output.
 * @param {string} content
 * @param {'coach' | 'bikesetup'} currentMode
 * @returns {{ content: string, suggestMode?: 'coach' | 'bikesetup' }}
 */
function parseSuggestMode(content, currentMode) {
  const text = (content || '').trim();
  if (!text) return { content: '' };
  const match = text.match(SUGGEST_MODE_RE);
  if (!match) return { content: stripChatMarkdown(text) };
  const suggested = match[1].toLowerCase() === 'bikesetup' ? 'bikesetup' : 'coach';
  const cleaned = stripChatMarkdown(text.replace(SUGGEST_MODE_RE, '').trim());
  if (suggested === currentMode) return { content: cleaned };
  return { content: cleaned, suggestMode: suggested };
}

function summarizeSource(content) {
  const normalized = String(content || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  return normalized.length > 120 ? `${normalized.slice(0, 117).trimEnd()}...` : normalized;
}

function formatRulesContext(chunks) {
  if (!chunks.length) {
    return '\n\n**KA Manual excerpts:** None matched this question. Tell the user you could not find a matching rule in the uploaded Karting Australia Manual snapshot.';
  }
  const blocks = chunks.map((c, i) => {
    const loc = c.location || c.title || 'KA Manual';
    const clause = c.clauseId ? ` | clauseId: ${c.clauseId}` : '';
    const edition = c.edition ? ` | edition: ${c.edition}` : '';
    const effective = c.effectiveDate ? ` | effectiveDate: ${c.effectiveDate}` : '';
    const page = typeof c.page === 'number' ? ` | page: ${c.page}` : '';
    const origin = c.origin ? ` | file: ${c.origin}` : '';
    return `[${i + 1}] Location: ${loc}${clause}${edition}${effective}${page}${origin}\n${c.content}`;
  });
  return `\n\n**KA Manual excerpts (use Answer / Quote / Citation / Note format; cite Location + edition + effectiveDate):**\n\n${blocks.join('\n\n')}`;
}

const RULES_KEYWORD_REWRITE_SYSTEM = `You extract search keywords for the 2026 Australian Karting Manual.
Reply with 3 to 8 space-separated keywords only (no sentences, no punctuation, no numbering).
Prefer KA vocabulary: licence, class, weight, restrictor, Cadet, KA3, X30, TaG, transponder, flag, tyre, wet, scrutineering.
Map slang to KA terms (e.g. P plate → D Grade observed driving; cadet → Cadet 9 Cadet 12).
Do not answer the user's question.`;

/**
 * Cheap OpenAI rewrite: natural question → MoMS search keywords.
 * Used only when deterministic tokenization leaves a thin query (0–1 content tokens).
 * @param {OpenAI} client
 * @param {string} question
 * @returns {Promise<string|null>}
 */
async function rewriteRulesKeywords(client, question) {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: RULES_KEYWORD_REWRITE_SYSTEM },
        { role: 'user', content: question },
      ],
      max_tokens: 48,
      temperature: 0,
    });
    const raw = completion.choices?.[0]?.message?.content?.trim() || '';
    if (!raw) return null;
    // Keep alphanumeric tokens only; drop fluff if the model returns a sentence
    const keywords = raw
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1)
      .slice(0, 8)
      .join(' ');
    return keywords || null;
  } catch (err) {
    console.warn('Rules keyword rewrite failed:', err?.message || err);
    return null;
  }
}

/**
 * Build MoMS search strings: always try LLM keywords for natural paraphrases.
 * @param {OpenAI} client
 * @param {string} question
 * @returns {Promise<{ merged: string, keywords: string|null }>}
 */
async function prepareRulesSearchQuery(client, question) {
  const rewritten = await rewriteRulesKeywords(client, question);
  if (rewritten && prepareRulesQueryTokens(rewritten).length > 0) {
    return { merged: `${question} ${rewritten}`.trim(), keywords: rewritten };
  }
  return { merged: question, keywords: null };
}

/**
 * Rerank lexical MoMS candidates with a cheap LLM pick (falls back to input order).
 * @param {OpenAI} client
 * @param {string} question
 * @param {Array<object>} candidates
 * @param {number} [limit=6]
 */
async function rerankRulesChunks(client, question, candidates, limit = 6) {
  if (!Array.isArray(candidates) || candidates.length <= limit) {
    return (candidates || []).slice(0, limit);
  }
  const catalog = candidates.slice(0, 14).map((c, i) => {
    const loc = c.location || c.title || 'KA Manual';
    const snippet = String(c.content || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 220);
    return `${i + 1}. ${loc} — ${snippet}`;
  });
  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You rank Karting Australia Manual excerpts for relevance to the user question. Reply with up to 6 comma-separated excerpt numbers only (e.g. 3,1,7). Prefer excerpts that answer the question; skip boilerplate that only shares common words like "permitted".',
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nExcerpts:\n${catalog.join('\n')}`,
        },
      ],
      max_tokens: 32,
      temperature: 0,
    });
    const raw = completion.choices?.[0]?.message?.content?.trim() || '';
    const nums = [...raw.matchAll(/\d+/g)]
      .map((m) => Number(m[0]))
      .filter((n) => n >= 1 && n <= catalog.length);
    const seen = new Set();
    const picked = [];
    for (const n of nums) {
      if (seen.has(n)) continue;
      seen.add(n);
      picked.push(candidates[n - 1]);
      if (picked.length >= limit) break;
    }
    if (picked.length > 0) return picked;
  } catch (err) {
    console.warn('Rules rerank failed:', err?.message || err);
  }
  return candidates.slice(0, limit);
}

function mapRulesSources(chunks) {
  return chunks.map((c) => ({
    title: c.title,
    origin: c.origin,
    ...(c.location ? { location: c.location } : {}),
    ...(c.clauseId ? { clauseId: c.clauseId } : {}),
    ...(c.edition ? { edition: c.edition } : {}),
    ...(c.effectiveDate ? { effectiveDate: c.effectiveDate } : {}),
    ...(typeof c.page === 'number' ? { page: c.page } : {}),
    ...(summarizeSource(c.content) ? { summary: summarizeSource(c.content) } : {}),
  }));
}

const RIDER_SKILL_LAYERS = {
  novice: `
Driver experience: club days or getting into racing. Simplify prompts and replies.
- Everyday language. Avoid jargon, or explain it in a few words.
- One main focus. Recommend at most one change at a time.
- Keep replies short: a few sentences or a short list, not a race-engineer dump.
- Ask at most two follow-up questions.
- Coaching: throttle control, braking markers, vision. Sprint karts brake with the rear only.
- Chassis: safe basics only (tyre pressures, obvious feel). Do not dive into axle, seat, or ride-height work unless they ask and have data.`,
  intermediate: `
Driver experience: intermediate club racer. Give more coaching and chassis detail.
- Combine technique and setup when relevant.
- Introduce small, reversible adjustments and say what to check next.
- Coaching: throttle timing, line choice, consistency. No car/bike trail-brake advice.
- Chassis: pressures, front width, toe — explain why, still one change at a time.`,
  advanced: `
Driver experience: club or national racer. Use race-engineer depth when they have data.
- Precise, technical language is OK.
- Include why a change works and what to check next session.
- Coaching: fine throttle, edge grip, race craft, corner-specific detail.
- Chassis: width, caster, axle, tyre windows, gearing — still safety rules and one change at a time. Do not invent pressures or numbers.`,
};

const SKILL_MAX_TOKENS = {
  novice: 640,
  intermediate: 1024,
  advanced: 1400,
};

/**
 * @param {unknown} raw
 * @returns {'novice' | 'intermediate' | 'advanced'}
 */
export function normalizeRiderSkill(raw) {
  if (raw === 'intermediate' || raw === 'advanced' || raw === 'novice') return raw;
  return 'novice';
}

function getSystemPrompt(mode, faqs, riderSkill = 'novice') {
  const skill = normalizeRiderSkill(riderSkill);
  const base = mode === 'bikesetup' ? BIKESETUP_SYSTEM : COACH_SYSTEM;
  return `${base}${SHARED_RULES}${RIDER_SKILL_LAYERS[skill]}${formatFaqsForPrompt(faqs, mode, skill)}`;
}

/**
 * Collect URL citations / web_search sources from a Responses API payload.
 * @param {object} response
 * @returns {Array<{ title: string, origin?: string, onlineUrl?: string }>}
 */
function extractWebSources(response) {
  const sources = [];
  const seen = new Set();

  const push = (url, title) => {
    const href = typeof url === 'string' ? url.trim() : '';
    if (!href || seen.has(href)) return;
    seen.add(href);
    let host = href;
    try {
      host = new URL(href).hostname.replace(/^www\./, '');
    } catch {
      /* keep href */
    }
    sources.push({
      title: (typeof title === 'string' && title.trim()) || host || href,
      origin: href,
      onlineUrl: href,
    });
  };

  for (const item of response?.output || []) {
    if (item?.type === 'message') {
      for (const part of item.content || []) {
        for (const ann of part.annotations || []) {
          if (ann?.type === 'url_citation' && ann.url) {
            push(ann.url, ann.title);
          }
        }
      }
    }
    if (item?.type === 'web_search_call') {
      const actionSources = item.action?.sources;
      if (Array.isArray(actionSources)) {
        for (const s of actionSources) {
          if (typeof s === 'string') push(s);
          else if (s && typeof s === 'object') push(s.url || s.href, s.title);
        }
      }
    }
  }

  return sources.slice(0, 8);
}

/**
 * Single-shot Ask: web search (Responses API). Rules mode: MoMS local JSON only.
 * @param {string} message
 * @param {{ mode?: 'ask' | 'rules' }} [options]
 * @returns {Promise<{ content: string, sources: Array<object>, fromKb: boolean, momsOnline?: object, error?: string }>}
 */
export async function askChat(message, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      content: '',
      sources: [],
      fromKb: false,
      error: 'KartRacer AI is not configured. Set OPENAI_API_KEY on the server.',
    };
  }

  const text = (message || '').trim();
  if (!text) {
    return { content: '', sources: [], fromKb: false, error: 'message is required' };
  }

  const mode = options.mode === 'rules' ? 'rules' : 'ask';
  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (mode === 'rules') {
    const { merged: searchQuery, keywords } = await prepareRulesSearchQuery(client, text);
    const primary = await retrieveForRules(searchQuery, 12);
    if (!primary.available) {
      return {
        content: '',
        sources: [],
        fromKb: false,
        error:
          'Karting Australia Manual snapshot is not uploaded yet. Seed Q&A from kb-au-rules (node scripts/seed-qa-corpus.mjs) and redeploy the API.',
      };
    }
    const passes = [primary];
    if (keywords) passes.push(await retrieveForRules(keywords, 12));
    if (searchQuery !== text) passes.push(await retrieveForRules(text, 12));
    const seen = new Set();
    let candidates = [];
    for (const pass of passes) {
      for (const c of pass.candidates?.length ? pass.candidates : pass.chunks) {
        const key = `${c.clauseId || c.location}|${(c.content || '').slice(0, 80)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        candidates.push(c);
      }
    }
    candidates.sort((a, b) => (b.score || 0) - (a.score || 0));
    candidates = candidates.slice(0, 14);
    const chunks = await rerankRulesChunks(client, text, candidates, 6);
    const fromKb = chunks.length > 0;
    const systemPrompt = RULES_SYSTEM + formatRulesContext(chunks);
    const { sources, momsOnline } = await enrichRulesSources(mapRulesSources(chunks));

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        max_tokens: 1024,
      });

      const content = stripChatMarkdown(completion.choices?.[0]?.message?.content?.trim() || '');
      return { content, sources, fromKb, momsOnline };
    } catch (err) {
      const msg = err?.message || String(err);
      console.error('KartRacer AI ask error:', msg);
      return {
        content: '',
        sources: [],
        fromKb: false,
        error: msg.includes('rate limit')
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Something went wrong. Please try again.',
      };
    }
  }

  // General Ask: Responses API + hosted web search (Australia-first, then world).
  try {
    const response = await client.responses.create({
      model,
      instructions: ASK_SYSTEM,
      input: text,
      tools: [
        {
          type: 'web_search',
          user_location: {
            type: 'approximate',
            country: webSearchCountry(),
          },
          search_context_size: 'medium',
          filters: {
            blocked_domains: ['reddit.com', 'quora.com'],
          },
        },
      ],
      tool_choice: 'auto',
      include: ['web_search_call.action.sources'],
      max_output_tokens: 1024,
    });

    const content = stripChatMarkdown((response.output_text || '').trim());
    if (!content) {
      return {
        content: '',
        sources: [],
        fromKb: false,
        error: 'Ask returned an empty response.',
      };
    }
    const sources = extractWebSources(response);
    return { content, sources, fromKb: false };
  } catch (err) {
    const msg = err?.message || String(err);
    console.error('KartRacer AI ask web-search error:', msg);
    // Retry once without include/filters if the model rejects newer web_search options
    if (/unknown|unsupported|invalid|include|filters|search_context/i.test(msg)) {
      try {
        const fallback = await client.responses.create({
          model,
          instructions: ASK_SYSTEM,
          input: text,
          tools: [
            {
              type: 'web_search',
              user_location: {
                type: 'approximate',
                country: webSearchCountry(),
              },
            },
          ],
          tool_choice: 'auto',
          max_output_tokens: 1024,
        });
        const content = stripChatMarkdown((fallback.output_text || '').trim());
        if (!content) {
          return {
            content: '',
            sources: [],
            fromKb: false,
            error: 'Ask returned an empty response.',
          };
        }
        return { content, sources: extractWebSources(fallback), fromKb: false };
      } catch (err2) {
        console.error('KartRacer AI ask web-search fallback error:', err2?.message || err2);
      }
    }
    return {
      content: '',
      sources: [],
      fromKb: false,
      error: msg.includes('rate limit')
        ? 'Too many requests. Please wait a moment and try again.'
        : 'Something went wrong. Please try again.',
    };
  }
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_FILE_TYPES = [
  'text/plain',
  'application/json',
  'text/csv',
  'text/xml',
  'application/gpx+xml',
];

/**
 * @param {Array<{ role: 'user' | 'assistant', content: string }>} messages - conversation history (newest last)
 * @param {'coach' | 'bikesetup'} mode
 * @param {Array<{ type: 'image'|'file', name: string, mimeType?: string, data?: string, content?: string }>} attachments - only applied to the final user turn
 * @param {'novice' | 'intermediate' | 'advanced'} [riderSkill]
 * @returns {Promise<{ content: string, error?: string }>}
 */
function buildUserContent(text, attachments = []) {
  const safeText = (text || '').trim() || 'Please review the attached file(s) and give feedback.';
  if (!attachments.length) return safeText;

  const parts = [{ type: 'text', text: safeText }];
  for (const att of attachments) {
    if (att.type === 'image' && att.data) {
      const rawMime = String(att.mimeType || 'image/jpeg').toLowerCase();
      const mime = ALLOWED_IMAGE_TYPES.includes(rawMime) ? rawMime : 'image/jpeg';
      parts.push({
        type: 'image_url',
        image_url: { url: `data:${mime};base64,${att.data}` },
      });
    } else if (att.type === 'file' && att.content) {
      parts.push({
        type: 'text',
        text: `\n\n[Attached file: ${att.name}]\n${att.content}`,
      });
    }
  }
  return parts.length === 1 ? safeText : parts;
}

function normalizeAttachments(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const att of raw.slice(0, 3)) {
    if (!att || typeof att !== 'object') continue;
    if (att.type === 'image' && typeof att.data === 'string' && att.data.length > 0) {
      if (att.data.length > 6_000_000) continue;
      const rawMime = String(att.mimeType || 'image/jpeg').slice(0, 80).toLowerCase();
      const mime = ALLOWED_IMAGE_TYPES.includes(rawMime) ? rawMime : 'image/jpeg';
      out.push({
        type: 'image',
        name: String(att.name || 'photo.jpg').slice(0, 120),
        mimeType: mime,
        data: att.data,
      });
    } else if (att.type === 'file' && typeof att.content === 'string' && att.content.trim()) {
      const rawMime = String(att.mimeType || 'text/plain').slice(0, 80).toLowerCase();
      const mime = ALLOWED_FILE_TYPES.includes(rawMime) ? rawMime : 'text/plain';
      out.push({
        type: 'file',
        name: String(att.name || 'data.txt').slice(0, 120),
        mimeType: mime,
        content: att.content.slice(0, 24_000),
      });
    }
  }
  return out;
}

export async function chat(messages, mode = 'coach', attachments = [], riderSkill = 'novice') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { content: '', error: 'KartRacer AI is not configured. Set OPENAI_API_KEY on the server.' };
  }

  const skill = normalizeRiderSkill(riderSkill);
  const faqs = await loadRiderAiFaqs();
  const systemPrompt = getSystemPrompt(mode, faqs, skill);
  const normalizedAttachments = normalizeAttachments(attachments);
  const openaiMessages = [{ role: 'system', content: systemPrompt }];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const isLastUser = i === messages.length - 1 && m.role === 'user';
    if (isLastUser && normalizedAttachments.length) {
      openaiMessages.push({
        role: 'user',
        content: buildUserContent(m.content, normalizedAttachments),
      });
    } else {
      openaiMessages.push({ role: m.role, content: m.content });
    }
  }

  const usesVision = normalizedAttachments.some((a) => a.type === 'image');

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: usesVision
        ? process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini'
        : process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: openaiMessages,
      max_tokens: SKILL_MAX_TOKENS[skill],
    });

    const content = completion.choices?.[0]?.message?.content?.trim() || '';
    return parseSuggestMode(content, mode === 'bikesetup' ? 'bikesetup' : 'coach');
  } catch (err) {
    const message = err?.message || String(err);
    console.error('KartRacer AI error:', message);
    return {
      content: '',
      error: message.includes('rate limit')
        ? 'Too many requests. Please wait a moment and try again.'
        : 'Something went wrong. Please try again.',
    };
  }
}
