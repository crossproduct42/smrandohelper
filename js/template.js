(function(window) {
    'use strict';

    window.template = function(text, data) {
        return render(parse(text), data);
    };

    function render(template, data) {
        return template.map(function(part) {
            if (typeof part === 'object') {
                var item = data[part.name] || false,
                    include = !!(item.hasOwnProperty('_') ? item._ : item);
                return include && part.parts ? render(part.parts, item) :
                    !include && part.alts ? render(part.alts, item) :
                    include ? item : '';
            }
            return part;
        }).join('');
    }

    var parse = memoize(_parse);
    function _parse(text, inner) {
        var m, name, label, parts, alt, alts;
        if (inner && (m = /^(\w+)($|:[^]*)/.exec(text || ''))) {
            name = m[1];
            label = m[2].startsWith(':');
            text = m[2].slice(1).replace(/\|[^]*/, '');
            alt = m[2].replace(/[^|]*([|]|$)/, '');
        }
        
        parts = compact(expand_last_by([text], find_parts));
        alts = alt ? compact(expand_last_by([alt], find_parts)) : null;
        
        return name && label ? { name: name, parts: parts, alts: alts } :
            name ? { name: name } : parts;
    }

    function find_parts(part) {
        var b = bounds(part);
        return b && flatten([
            part.slice(0, b[0]),
            _parse(part.slice(b[0]+1, b[1]), true),
            part.slice(b[1]+1)
        ]);
    }

    // Original source from https://github.com/juliangruber/balanced-match
    function bounds(text) {
        var index = function(d, i) { return text.indexOf(d, i || 0); },
            ai = index('{'),
            bi = index('}', ai + 1);

        if (ai < 0 || bi < 0) return null;

        var left = text.length, right,
            stack = [], i = ai;
        while (i >= 0) {
            if (i === ai) {
                stack.push(i);
                ai = index('{', i + 1);
            } else if (stack.length === 1) {
                return [stack.pop(), bi];
            } else {
                var t = stack.pop();
                if (t < left) { left = t; right = bi; }
                bi = index('}', i + 1);
            }

            i = ai >= 0 && ai < bi ? ai : bi;
        }

        return stack.length ? [left, right] : null;
    }
    // ---

}(window));
