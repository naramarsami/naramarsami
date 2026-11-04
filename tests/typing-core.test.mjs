import assert from 'node:assert/strict';
import test from 'node:test';
import { bindTyping, characters, commitInput, readInput, isLineComplete, scorePractice } from '../typing-core.mjs';

function line(text, autoSpace = true) {
    return { reference: Array.from(text.normalize('NFC')), autoSpace, target: characters(text, autoSpace), input: [], attempts: 0, errors: 0 };
}

function enter(state, value, selection) {
    const { input, formatted } = readInput(value, state.reference, state.autoSpace);
    commitInput(state, input, selection);
    return formatted;
}

test('restores original spaces and accepts manually entered spaces and normalized Hangul', () => {
    assert.equal(enter(line('별 헤는 밤'), '별헤는밤'), '별 헤는 밤');
    assert.equal(enter(line('one two'), 'one  two'), 'one two');
    const state = line('한 글');
    enter(state, '한 글'.normalize('NFD'));
    assert.equal(isLineComplete(state), true);
    assert.deepEqual(scorePractice([state], 'ko', 60000), { speed: 6, accuracy: 100, errors: 0 });
});

test('an empty line, a trailing error and corrected text affect progress and score separately', () => {
    const state = line('abc');
    assert.equal(isLineComplete(state), false);
    assert.equal(scorePractice([state], 'en', 60000).speed, 0);
    enter(state, 'abx');
    assert.equal(isLineComplete(state), false);
    assert.deepEqual(scorePractice([state], 'en', 60000), { speed: 2, accuracy: 66.7, errors: 1 });
    enter(state, 'abc');
    assert.equal(isLineComplete(state), true);
    assert.deepEqual(scorePractice([state], 'en', 60000), { speed: 3, accuracy: 75, errors: 1 });
    enter(state, 'abcd');
    assert.equal(isLineComplete(state), false);
    assert.deepEqual(scorePractice([state], 'en', 60000), { speed: 3, accuracy: 60, errors: 2 });
});

test('uses Hangul jamo and English characters without counting automatic spaces or weighting', () => {
    const ko = line('까 값 와 갔');
    enter(ko, '까값와갔');
    assert.equal(scorePractice([ko], 'ko', 60000).speed, 10);
    const en = line('one two');
    enter(en, 'one two');
    enter(en, 'onetwo');
    assert.equal(en.attempts, 6);
    assert.equal(scorePractice([en], 'en', 30000).speed, 12);
});

test('uses the edit position to score repeated characters inserted in the middle', () => {
    const state = line('aba');
    enter(state, 'aa');
    enter(state, 'aaa', { start: 1, end: 1 });
    assert.deepEqual(scorePractice([state], 'en', 60000), { speed: 2, accuracy: 33.3, errors: 2 });
});

test('PC requires typed spaces but fills punctuation without counting it as keystrokes', () => {
    const text = '“안녕,” 반가워.';
    const missingSpace = line(text, false);
    enter(missingSpace, '안녕반가워');
    assert.equal(isLineComplete(missingSpace), false);

    const state = line(text, false);
    enter(state, '안녕 반가워');
    assert.equal(isLineComplete(state), true);
    assert.equal(state.attempts, 6);
    assert.deepEqual(scorePractice([state], 'ko', 60000), { speed: 13, accuracy: 100, errors: 0 });
});

test('mobile fills spaces and accepts optional punctuation from the reference', () => {
    const text = "It's fine.";
    const state = line(text);
    assert.equal(enter(state, 'Itsfine'), 'Its fine');
    assert.equal(enter(state, "It's fine."), "It's fine.");
    assert.equal(isLineComplete(state), true);
    assert.equal(state.attempts, 7);
    assert.equal(scorePractice([state], 'en', 60000).speed, 7);
});

test('wrong, misplaced, or extra punctuation counts as an error on PC and mobile', () => {
    for (const autoSpace of [false, true]) {
        for (const wrong of ['안녕? 친구', '안,녕 친구', '안녕,, 친구', '안녕 친구!']) {
            const state = line('안녕, 친구.', autoSpace);
            assert.match(enter(state, wrong), /[?,!]/u);
            assert.equal(isLineComplete(state), false, wrong);
            assert.ok(state.errors > 0, wrong);
        }
        for (const correct of ['안녕 친구', '안녕, 친구.']) {
            const state = line('안녕, 친구.', autoSpace);
            enter(state, correct);
            assert.equal(isLineComplete(state), true, correct);
            assert.equal(state.errors, 0);
        }
    }
});

test('a mistyped apostrophe lowers accuracy immediately and correction allows progress', () => {
    const state = line("It's fine.", false);
    enter(state, 'It');
    enter(state, 'It?');
    assert.deepEqual(scorePractice([state], 'en', 60000), { speed: 2, accuracy: 66.7, errors: 1 });
    enter(state, 'It');
    enter(state, "It's fine");
    assert.equal(isLineComplete(state), true);
    assert.equal(state.errors, 1);
});

test('matching the final character cannot complete a line with an earlier typo', () => {
    const state = line('한 줄을 확인해요.', false);
    enter(state, '한 줄을 확인해');
    assert.equal(isLineComplete(state), false);
    enter(state, '한 글을 확인해요');
    assert.equal(state.input.length, state.target.length);
    assert.equal(isLineComplete(state), false);
    enter(state, '한 줄을 확인해요');
    assert.equal(isLineComplete(state), true);
});

class TypingField extends EventTarget {
    value = '';
    selectionStart = 0;
    selectionEnd = 0;

    emit(type, properties = {}) {
        this.dispatchEvent(Object.assign(new Event(type), properties));
    }

    enter(value, isComposing = false) {
        this.value = value;
        this.selectionStart = this.selectionEnd = value.length;
        this.emit('input', { isComposing });
    }
}

test('paints Korean IME changes immediately and scores only the committed syllable', async () => {
    const field = new TypingField();
    const state = line('한글');
    const previews = [];
    bindTyping(field, {
        preview: value => previews.push(value),
        commit: selection => enter(state, field.value, selection),
    });

    field.emit('compositionstart');
    field.emit('compositionupdate', { data: 'ㅎ' });
    assert.equal(previews.at(-1), 'ㅎ');
    field.enter('하', true);
    assert.equal(previews.at(-1), '하');
    assert.equal(state.attempts, 0);

    field.enter('한', true);
    field.emit('compositionend', { data: '한' });
    field.enter('한');
    await Promise.resolve();
    assert.deepEqual(state.input, ['한']);
    assert.equal(state.attempts, 1);
    assert.equal(state.errors, 0);
});

test('commits a composition without a trailing input event and cancels stale commits on reset', async () => {
    const field = new TypingField();
    const commits = [];
    const reset = bindTyping(field, { preview() {}, commit: () => commits.push(field.value) });
    field.emit('compositionstart');
    field.enter('가', true);
    field.emit('compositionend');
    await Promise.resolve();
    assert.deepEqual(commits, ['가']);

    field.emit('compositionstart');
    field.enter('가나', true);
    field.emit('compositionend');
    reset();
    field.value = '';
    await Promise.resolve();
    assert.deepEqual(commits, ['가']);
});
