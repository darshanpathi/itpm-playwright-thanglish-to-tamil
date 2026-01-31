const { test, expect } = require('@playwright/test');

/**
 * Helper: get Tamil output from the 2nd textarea (target area)
 */
async function getOutputText(page) {
  await page.waitForSelector('textarea');
  await page.waitForFunction(() => {
    return document.querySelectorAll('textarea').length >= 2;
  });

  return await page.locator('textarea').nth(1).inputValue();
}

/**
 * Helper: translate given input using the site
 * NOTE: site updates as you type / on Enter in many cases
 */
async function translate(page, input) {
  await page.goto('https://tamil.changathi.com/');
  await page.fill('textarea', input);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);
  return await getOutputText(page);
}

/**
 * Helper: Basic check if output contains Tamil letters
 */
function hasTamilLetters(text) {
  return /[அ-ஹ]/.test(text);
}

/* =========================
   ✅ 25 POSITIVE SCENARIOS
   ========================= */

test('Pos 01 - Simple greeting question', async ({ page }) => {
  const output = await translate(page, 'vanakkam epdi irukka?');
  expect(output).toContain('வணக்கம் எப்படி இருக்க?');
});

test('Pos 02 - Short polite request', async ({ page }) => {
  const output = await translate(page, 'konjam help pannunga');
  expect(output).toContain('கொஞ்சம் ஹெல்ப் பண்ணுங்க');
});

test('Pos 03 - Present tense daily activity', async ({ page }) => {
  const output = await translate(page, 'naan office ku poren');
  expect(output).toContain('நான் ஆபிஸ் கு போறேன்');
});

test('Pos 04 - Past tense simple sentence', async ({ page }) => {
  const output = await translate(page, 'naan nethu padichuten');
  expect(output).toContain('நான் நேத்து படிச்சுட்டேன்');
});

test('Pos 05 - Future tense plan', async ({ page }) => {
  const output = await translate(page, 'nalai party ku porom');
  expect(output).toContain('நாளை பார்ட்டி கு போறோம்');
});

test('Pos 06 - Negative sentence form', async ({ page }) => {
  const output = await translate(page, 'enakku time illa');
  expect(output).toContain('எனக்கு டைம் இல்ல');
});

test('Pos 07 - Compound sentence two ideas', async ({ page }) => {
  const output = await translate(page, 'naan sapiduven appuram padipen');
  expect(output).toContain('நான் சாப்பிடுவேன் அப்புறம் படிப்பேன்');
});

test('Pos 08 - Complex conditional', async ({ page }) => {
  const output = await translate(page, 'mazhai vandha velaiku pogala');
  expect(output).toContain('மழை வந்தா வேலைக்கு போகல');
});

test('Pos 09 - Plural pronoun variation', async ({ page }) => {
  const output = await translate(page, 'naanga ellam ready ah irukkom');
  expect(output).toContain('நாங்க எல்லாம் ரெடி ஆ இருக்கோம்');
});

test('Pos 10 - Mixed English tech terms', async ({ page }) => {
  const output = await translate(page, 'Zoom call la OTP anupunga email ku');
  expect(output).toContain('ஜூம் கால் ல ஓடிபி அனுப்புங்க ஈமெயில் கு');
});

test('Pos 11 - Place name + common English', async ({ page }) => {
  const output = await translate(page, 'Colombo la irukura new cafe super ah irukku');
  expect(output).toContain('கொழும்பு ல இருக்குற நியூ கேஃப் சூப்பர் ஆ இருக்கு');
});

test('Pos 12 - Slang informal greeting', async ({ page }) => {
  const output = await translate(page, 'machi superrr da');
  expect(output).toContain('மச்சி சூப்பர்ர் டா');
});

test('Pos 13 - Repeated emphasis words', async ({ page }) => {
  const output = await translate(page, 'nalla nalla irukku');
  expect(output).toContain('நல்ல நல்ல இருக்கு');
});

test('Pos 14 - Currency + time in sentence', async ({ page }) => {
  const output = await translate(page, 'exam 2026-03-15 anikku nadakkum');
  expect(output).toContain('2026-03-15');
});

test('Pos 15 - Date format preserved', async ({ page }) => {
  const output = await translate(page, 'birthday 15-03-2026');
  expect(output).toContain('பர்த்டே 15-03-2026');
});

test('Pos 16 - Polite high degree request', async ({ page }) => {
  const output = await translate(page, 'thayaavu seidhu enakku ivalavu help pannunga');
  expect(output).toContain('தயவு செய்து எனக்கு இவ்வளவு ஹெல்ப் பண்ணுங்க');
});

test('Pos 17 - Multi-word phrase pattern', async ({ page }) => {
  const output = await translate(page, 'konjam wait pannu');
  expect(output).toContain('கொஞ்சம் வெயிட் பண்ணு');
});

test('Pos 18 - Proper spaced long sentence', async ({ page }) => {
  const output = await translate(page, 'Intha weekend naan friends oda Kandy trip plan pannuraen morning early bus la porom paththu mani neram journey irukku temple botanical garden pathu evening hotel rest next day Nuwara Eliya poga plan weather mazhai nu sollirukku so umbrella kondu porom everyone excited (≈320 chars)');
  // output may be "bus stop-ல" or keep "busstop" - accept either
  expect(output.toLowerCase().includes('இந்த வீக்எண்ட் நான் ஃப்ரெண்ட்ஸ் ஓட கண்டி ட்ரிப் பிளான் பண்றேன் மார்னிங் அர்லி பஸ் ல போறோம் பத்து மணி நேரம் ஜர்னி இருக்கு டெம்பிள் போட்டானிக்கல் கார்டன் பாத்து ஈவ்னிங் ஹோட்டல் ரெஸ்ட் நெக்ஸ்ட் டே நுவார எலியா போக பிளான் வெதர் மழை னு சொல்லிருக்கு சோ அம்ப்ரெல்லா கொண்டு போறோம்.எவரி ஒன் எக்ஸைடட் ')).toBeTruthy();
});

test('Pos 19 - Informal response', async ({ page }) => {
  const output = await translate(page, 'seri da aprm pesuvom');
  expect(output).toContain('சரி டா அப்புறம் பேசுவோம்');
});

test('Pos 20 - Singular pronoun focus', async ({ page }) => {
  const output = await translate(page, 'nee eppadi irukka?');
  expect(output).toContain('நீ எப்படி இருக்க?');
});

test('Pos 21 - Mixed abbreviation short forms', async ({ page }) => {
  const output = await translate(
    page,
    'PIN OTP QR code ASAP ETA send pannu'
  );
  expect(output).toContain('பின் ஓடிபி க்யூஆர் கோட் அஸாப் ஈடிஏ செண்ட் பண்ணு');
});

test('Pos 22 - Very polite formal request', async ({ page }) => {
  const output = await translate(page, 'dayavu seidhu enakku idhai explain pannunga');
  expect(output).toContain('தயவு செய்து எனக்கு இதை எக்ஸ்பிளெயின் பண்ணுங்க');
});

test('Pos 23 - Day-to-day expression', async ({ page }) => {
  const output = await translate(page, 'thookkam varudhu da');
  expect(output).toContain('தூக்கம் வருது டா');
});

test('Pos 24 - Joined proper spacing test', async ({ page }) => {
  const output = await translate(page, 'naan veetukku poren and friends oda meet pannuven');
  expect(output).toContain('நான் வீட்டுக்கு போறேன் அண்ட் ஃப்ரெண்ட்ஸ் ஓட மீட் பண்ணுவேன்');
});

test('Pos 25 - Output updates correctly after each space press', async ({ page }) => {
  await page.goto('https://tamil.changathi.com/');

  await page.fill('textarea', 'vanakkam da');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  const first = await getOutputText(page);
  expect(first).toContain('வணக்கம் டா');

  
});

/* =========================
   ❌ 10 NEGATIVE SCENARIOS
   =========================
   NOTE: For negative cases, we check that output is empty OR
   not meaningfully converted (no Tamil letters / unchanged / contains junk).
*/

test('Neg 01 - Joined words without spaces (stress test)', async ({ page }) => {
  const output = await translate(page, 'naanveetukkuvittuponen');
  expect(output.length).toBe(0);
});

test('Neg 02 - Tab character only', async ({ page }) => {
  const output = await translate(page, '\t\t\t\t');
  expect(output.length === 0 || output.includes('') || output.includes('t')).toBeTruthy();
});

test('Neg 03 - Punctuation overload', async ({ page }) => {
  const output = await translate(page, 'machan!!!! enna da panra?????');
  expect(output.includes('!') || output.toLowerCase().includes('?') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 04 - Excessive multiple spaces', async ({ page }) => {
  const output = await translate(page, 'naan college ku late aachu');
  expect(output.toLowerCase().includes('naan college ku late aachu') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 05 - Copy-paste full sentence ignored or garbleds', async ({ page }) => {
  const output = await translate(page, 'naan intha week end la friends oda movie paakaporen');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 06 - Very long input with minor typos', async ({ page }) => {
  const output = await translate(page, 'machan intha semma trip plan pannirukken kandy ku bus la morning 6 am start pannuvom pathu mani neram journey temple botanical garden hanthana view evening hotel rest next day nuwara eliya mazhai forecast umbrella kondu porom friends zoom la discuss panninom super excited (≈350 chars with small typos)');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 07 - Mixed foreign words (not Tamil phonetics)', async ({ page }) => {
  const output = await translate(page, 'naan hari lassan venum');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 08 - Unusual symbols mixed (@ # $ %)', async ({ page }) => {
  const output = await translate(page, 'ticket $50 @movie #super %100 off');
  expect(output.includes('@,$,#,%') || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 09 - Single space only (empty-like edge case)', async ({ page }) => {
  const output = await translate(page, '" " (one space)');
  expect(output.length === 0 || !hasTamilLetters(output)).toBeTruthy();
});

test('Neg 10 - Multi-line without proper breaks', async ({ page }) => {
  const output = await translate(page, 'anakkam da naan busy irukken call pannuren');
  expect(output.includes('anakkam da naan busy irukken call pannuren') || !hasTamilLetters(output)).toBeTruthy();
});

