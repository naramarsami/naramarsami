const archivePrefix = 'narat-practice-record:';

export function practiceRecords(records) {
    return Array.isArray(records) ? records.filter(record => record && typeof record.title === 'string') : [];
}

function recordEntries(records) {
    const occurrences = new Map();
    return practiceRecords(records).map(record => {
        if (typeof record.id === 'string' && record.id) return [archivePrefix + record.id, record];
        const signature = JSON.stringify(record);
        const count = (occurrences.get(signature) ?? 0) + 1;
        occurrences.set(signature, count);
        return [archivePrefix + 'legacy:' + count + ':' + signature, record];
    });
}

export function archivePracticeRecords(storage, records) {
    try {
        for (const [key, record] of recordEntries(records)) {
            if (storage.getItem(key) === null) storage.setItem(key, JSON.stringify(record));
        }
        return true;
    } catch {
        return false;
    }
}

export function readPracticeRecords(storage, cookieRecords) {
    const records = new Map(recordEntries(cookieRecords));
    try {
        for (let index = 0; index < storage.length; index++) {
            const key = storage.key(index);
            if (!key?.startsWith(archivePrefix) || records.has(key)) continue;
            try {
                const record = JSON.parse(storage.getItem(key));
                if (record && typeof record.title === 'string') records.set(key, record);
            } catch {
                // Skip a damaged entry and keep reading the others.
            }
        }
    } catch {
        // Keep cookie records available when browser storage is blocked.
    }
    return [...records.values()].sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
}
