const equivalentMarks = { '‘': "'", '’': "'", '“': '"', '”': '"', '–': '-', '—': '-' };

export function isAutomatic(char, autoSpace) {
    return autoSpace && /\s/u.test(char);
}

export function characters(text, autoSpace = true) {
    return Array.from(text.normalize('NFC'))
        .filter(char => !isAutomatic(char, autoSpace))
        .map(char => equivalentMarks[char] ?? char);
}

export function bindTyping(input, { preview, commit, countBefore = text => characters(text).length }) {
    let composition = null;
    let selection = null;
    let settling = false;
    let revision = 0;

    function selectedCharacters() {
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? start;
        return {
            start: countBefore(input.value.slice(0, start)),
            end: countBefore(input.value.slice(0, end)),
        };
    }

    function finish() {
        revision++;
        settling = false;
        const range = selection;
        selection = null;
        commit(range);
    }

    function showInput() {
        preview(input.value, input.selectionStart ?? input.value.length);
    }

    input.addEventListener('beforeinput', event => {
        if (!composition && !settling && !event.isComposing) {
            selection = event.inputType?.startsWith('delete') ? null : selectedCharacters();
        }
    });
    input.addEventListener('compositionstart', () => {
        if (settling) finish();
        selection = selectedCharacters();
        const start = input.selectionStart ?? input.value.length;
        composition = {
            before: input.value.slice(0, start),
            after: input.value.slice(input.selectionEnd ?? start),
        };
        showInput();
    });
    input.addEventListener('compositionupdate', event => {
        if (composition && typeof event.data === 'string') {
            const prefix = composition.before + event.data;
            preview(prefix + composition.after, prefix.length);
        }
    });
    input.addEventListener('compositionend', () => {
        composition = null;
        settling = true;
        showInput();
        const currentRevision = ++revision;
        queueMicrotask(() => {
            if (settling && revision === currentRevision) finish();
        });
    });
    input.addEventListener('input', event => {
        if (composition || event.isComposing) showInput();
        else finish();
    });

    return function resetInput() {
        composition = null;
        selection = null;
        settling = false;
        revision++;
    };
}

export function readInput(value, target, autoSpace) {
    if (!autoSpace) return { input: characters(value, false), formatted: value };

    const normalized = value.normalize('NFC');
    const input = [];
    let index = 0;
    let formatted = '';
    for (const char of normalized) {
        if (isAutomatic(char, true)) continue;
        while (index < target.length && isAutomatic(target[index], true)) {
            formatted += target[index++];
        }
        input.push(equivalentMarks[char] ?? char);
        formatted += char;
        index++;
    }
    if (/\s$/u.test(normalized) && index < target.length && isAutomatic(target[index], true)) {
        formatted += target[index];
    }
    return { input, formatted };
}

export function canAutoAdvance(text, mode) {
    return mode === 'complete' || text.trimEnd().endsWith('.');
}

export function isLineComplete(line) {
    return line.input.length === line.target.length &&
        line.target.every((char, index) => line.input[index] === char);
}

export function commitInput(line, next, selection) {
    let first = 0;
    while (first < line.input.length && first < next.length && line.input[first] === next[first]) first++;
    if (first === line.input.length && first === next.length) return false;

    let oldEnd = line.input.length;
    let newEnd = next.length;
    while (oldEnd > first && newEnd > first && line.input[oldEnd - 1] === next[newEnd - 1]) {
        oldEnd--;
        newEnd--;
    }

    if (selection) {
        const { start, end } = selection;
        const insertedEnd = next.length - (line.input.length - end);
        if (insertedEnd >= start &&
            next.slice(0, start).join('') === line.input.slice(0, start).join('') &&
            next.slice(insertedEnd).join('') === line.input.slice(end).join('')) {
            first = start;
            newEnd = insertedEnd;
        }
    }

    for (let index = first; index < newEnd; index++) {
        line.attempts++;
        if (next[index] !== line.target[index]) line.errors++;
    }
    line.input = next;
    return true;
}

function unitsFor(character, language) {
    if (/\s/u.test(character)) return 0;
    return language === 'ko' && /^[가-힣]$/u.test(character) ? character.normalize('NFD').length : 1;
}

export function measureLine(line, language) {
    let correctUnits = 0;
    let matchedCharacters = 0;
    for (let index = 0; index < line.input.length; index++) {
        const char = line.input[index];
        if (char !== line.target[index]) continue;
        correctUnits += unitsFor(char, language);
        matchedCharacters++;
    }
    return { correctUnits, matchedCharacters, attempts: line.attempts, errors: line.errors };
}

export function scoreTotals({ correctUnits, attempts, errors }, elapsedMs) {
    return {
        speed: elapsedMs > 0 ? Math.round(correctUnits * 60000 / elapsedMs) : 0,
        accuracy: attempts ? Math.round((attempts - errors) * 1000 / attempts) / 10 : 100,
        errors,
    };
}

export function scorePractice(lines, language, elapsedMs) {
    const totals = { correctUnits: 0, attempts: 0, errors: 0 };
    for (const line of lines) {
        const metrics = measureLine(line, language);
        totals.correctUnits += metrics.correctUnits;
        totals.attempts += metrics.attempts;
        totals.errors += metrics.errors;
    }
    return scoreTotals(totals, elapsedMs);
}
