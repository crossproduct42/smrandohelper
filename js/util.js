(function(window) {
    'use strict';
    
    window.compact = function(array) {
        var identity = function(x) { return x; };
        return array.filter(identity);
    };

    window.expand_last_by = function(array, iteratee) {
        if (array.length === 0) return array;
        var r;
        while ((r = iteratee(array[array.length-1]))) {
            array = array.slice(0, -1).concat(r);
        }
        return array;
    };

    window.flatten = function(array) {
        return array.reduce(function(acc, value) { return acc.concat(value); }, []);
    };

    window.memoize = function(func) {
        var memoized = function(value) {
            var cache = memoized._cache;
            return cache[value] || (cache[value] = func(value));
        };
        memoized._cache = {};
        return memoized;
    };

}(window));
