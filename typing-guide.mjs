export const keyboardRows = [
    [..."1234567890-=", 'Backspace'],
    [..."qwertyuiop[]"],
    [..."asdfghjkl;'"],
    ['Shift', ..."zxcvbnm,./"],
    ['Space'],
];

const koreanLabels = [...'ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅁㄴㅇㄹㅎㅗㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡ'];
export const koreanKeyLabels = Object.fromEntries(
    [...'qwertyuiopasdfghjklzxcvbnm'].map((key, index) => [key, koreanLabels[index]]),
);

const initials = [...'rRseEfaqQtTdwWczxvg'];
const vowels = ['k', 'o', 'i', 'O', 'j', 'p', 'u', 'P', 'h', 'hk', 'ho', 'hl', 'y', 'n', 'nj', 'np', 'nl', 'b', 'm', 'ml', 'l'];
const finals = ['', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt', 't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g'];
const jamoKeys = new Map([
    ...[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'].map((char, index) => [char, initials[index]]),
    ...[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'].map((char, index) => [char, vowels[index]]),
]);
const shiftedKeys = Object.fromEntries(
    [...'!@#$%^&*()_+{}:"<>?'].map((char, index) => [char, '1234567890-=[];\',./'[index]]),
);

function keystrokes(character) {
    if (!character) return '';
    const hangul = character.codePointAt(0) - 0xac00;
    if (hangul >= 0 && hangul < 11172) {
        return initials[Math.floor(hangul / 588)] +
            vowels[Math.floor(hangul / 28) % 21] + finals[hangul % 28];
    }
    return jamoKeys.get(character) ?? character;
}

export function nextKeyFor(character, interim) {
    const sequence = keystrokes(character);
    const prefix = keystrokes(interim);
    const next = sequence[sequence.startsWith(prefix) ? prefix.length : 0];
    if (!next) return null;
    if (/\s/u.test(next)) return { key: 'Space', shift: false };
    if (Object.hasOwn(shiftedKeys, next)) return { key: shiftedKeys[next], shift: true };
    const key = next.toLowerCase();
    return { key, shift: key !== next };
}
