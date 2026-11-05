import assert from 'node:assert/strict';
import test from 'node:test';
import { archivePracticeRecords, readPracticeRecords } from '../practice-history.mjs';

function browserStorage() {
    const entries = new Map();
    return {
        get length() { return entries.size; },
        key: index => [...entries.keys()][index] ?? null,
        getItem: key => entries.get(key) ?? null,
        setItem: (key, value) => entries.set(key, value),
    };
}

test('retains legacy and older practice records when the cookie rotates or expires', () => {
    const storage = browserStorage();
    const legacy = { title: '서시', date: '2026. 11. 5.', speed: 120 };
    assert.equal(archivePracticeRecords(storage, [legacy, legacy]), true);
    const newer = Array.from({ length: 14 }, (_, index) => ({
        id: 'attempt-' + index, title: '서시', savedAt: index + 1,
    }));
    for (const record of newer) assert.equal(archivePracticeRecords(storage, [record]), true);
    const withCookie = readPracticeRecords(storage, [...newer.slice(-12)].reverse());
    const afterExpiry = readPracticeRecords(storage, null);
    assert.deepEqual(withCookie, afterExpiry);
    assert.equal(afterExpiry.length, 16);
    assert.equal(afterExpiry[0].id, 'attempt-13');
});

test('falls back to the existing cookie when browser storage is blocked', () => {
    const record = { title: '진달래꽃', speed: 110 };
    assert.equal(archivePracticeRecords(null, [record]), false);
    assert.deepEqual(readPracticeRecords(null, [record]), [record]);
});
