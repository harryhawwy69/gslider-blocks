/**
 * Reads the attribute JSON out of the first block comment.
 * Gutenberg's parser fills in defaults, so the comment itself is the list of
 * attributes that were actually stored.
 * @param markup
 */
export function commentAttributes(markup) {
    const commentAt = markup.indexOf('<!-- wp:');
    if (commentAt < 0) {
        return null;
    }
    // The comment ends at its own `-->`, so a `{` in the HTML that follows it,
    // or in a later block, is never read as this block's attributes
    const commentClose = markup.indexOf('-->', commentAt);
    const commentEnd = commentClose < 0 ? markup.length : commentClose;
    const jsonAt = markup.indexOf('{', commentAt);
    // No JSON in the comment means every attribute is at its default, which is
    // how Gutenberg writes a block whose attributes are all defaults
    if (jsonAt < 0 || jsonAt > commentEnd) {
        return {};
    }
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = jsonAt; index < commentEnd; index += 1) {
        const character = markup[index];
        if (inString) {
            if (escaped) {
                escaped = false;
            }
            else if (character === '\\') {
                escaped = true;
            }
            else if (character === '"') {
                inString = false;
            }
            continue;
        }
        if (character === '"') {
            inString = true;
            continue;
        }
        if (character === '{') {
            depth += 1;
        }
        else if (character === '}') {
            depth -= 1;
            if (depth === 0) {
                try {
                    return JSON.parse(markup.slice(jsonAt, index + 1));
                }
                catch {
                    throw new Error('markup has malformed attribute JSON in the block comment.');
                }
            }
        }
    }
    throw new Error('markup has malformed attribute JSON in the block comment.');
}
export function blockNameFromMarkup(markup) {
    const match = markup.match(/<!--\s+wp:([a-z0-9/-]+)/);
    return match ? match[1] : null;
}
//# sourceMappingURL=markup.js.map