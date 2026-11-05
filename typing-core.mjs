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
    const input = characters(value, autoSpace);
    if (!autoSpace) return { input, formatted: value };

    let index = 0;
    let formatted = '';
    for (const char of value.normalize('NFC')) {
        if (isAutomatic(char, true)) continue;
        while (index < target.length && isAutomatic(target[index], true)) {
            formatted += target[index++];
        }
        formatted += char;
        index++;
    }
    return { input, formatted };
}

export function isLineComplete(line) {
    return line.input.length === line.target.length &&
        line.target.every((char, index) => line.input[index] === char);
}

export function commitInput(line, next, selection) {
    if (next.join('') === line.input.join('')) return;
    let first = 0;
    while (first < line.input.length && first < next.length && line.input[first] === next[first]) first++;

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
}

function unitsFor(character, language) {
    if (/\s/u.test(character)) return 0;
    return language === 'ko' && /^[가-힣]$/u.test(character) ? character.normalize('NFD').length : 1;
}

export function scorePractice(lines, language, elapsedMs) {
    let correctUnits = 0;
    let attempts = 0;
    let errors = 0;
    for (const line of lines) {
        attempts += line.attempts;
        errors += line.errors;
        line.input.forEach((char, index) => {
            if (char === line.target[index]) correctUnits += unitsFor(char, language);
        });
    }
    return {
        speed: elapsedMs > 0 ? Math.round(correctUnits * 60000 / elapsedMs) : 0,
        accuracy: attempts ? Math.round((attempts - errors) * 1000 / attempts) / 10 : 100,
        errors,
    };
}
