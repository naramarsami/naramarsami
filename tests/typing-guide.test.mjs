import assert from 'node:assert/strict';
import test from 'node:test';
import { keyboardRows, nextKeyFor } from '../typing-guide.mjs';

test('guides the next physical key during Korean syllable composition', () => {
    assert.deepEqual(nextKeyFor('한'), { key: 'g', shift: false });
    assert.deepEqual(nextKeyFor('한', '하'), { key: 's', shift: false });
    assert.deepEqual(nextKeyFor('값', '갑'), { key: 't', shift: false });
    assert.deepEqual(nextKeyFor('과', '고'), { key: 'k', shift: false });
    assert.deepEqual(nextKeyFor('까'), { key: 'r', shift: true });
});

test('maps spaces, Latin capitals and shifted punctuation to keys shown in the guide', () => {
    for (const [character, key, shift] of [[' ', 'Space', false], ['T', 't', true], ['?', '/', true], ['"', "'", true], ['.', '.', false]]) {
        assert.deepEqual(nextKeyFor(character), { key, shift });
        assert.ok(keyboardRows.flat().includes(key));
    }
});
