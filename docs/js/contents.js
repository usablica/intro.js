/**
* @version 1.0.3
* @link https://github.com/gajus/contents for the canonical source repository
* @license https://github.com/gajus/contents/blob/master/LICENSE BSD 3-Clause
*/
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function S () {
    if (!(this instanceof S)) {
        return new S();
    }
    this._events = {};
}
S.prototype.on = function (name, listener) {
    this._events[name] = this._events[name] || [];
    this._events[name].push(listener);
    return this;
};
S.prototype.trigger = function (name, data) {
    var i,
        j;
    if (this._events[name]) {
        i = 0;
        j = this._events[name].length;
        while (i < j) {
            this._events[name][i++](data);
        }
    }
};
module.exports = S;
},{}],2:[function(require,module,exports){
var Sister = require('sister'),
    contents;

/**
 * @param {object} config
 * @return {object}
 */
contents = function (config) {
    var list,
        emitter;

    config = contents.config(config);

    list = contents.makeList(config.articles);

    contents.forEach(list.querySelectorAll('li'), function (guide, i) {
        config.link(guide, config.articles[i]);
    });

    config.contents.appendChild(list);

    emitter = contents.bind(list, config);

    return {
        list: list,
        eventProxy: emitter
    };
};

/**
 * @param {HTMLElement} Table of contents root element (<ol>).
 * @param {object} config Result of contents.config.
 * @return {object} Result of contents.eventEmitter.
 */
contents.bind = function (list, config) {
    var emitter = Sister(),
        windowHeight,
        /**
         * @var {Array}
         */
        articleOffsetIndex,
        lastArticleIndex,
        guides = list.querySelectorAll('li');

    emitter.on('resize', function () {
        windowHeight = contents.windowHeight();
        articleOffsetIndex = contents.indexOffset(config.articles);

        emitter.trigger('scroll');
    });

    emitter.on('scroll', function () {
        var articleIndex,
            changeEvent;

        articleIndex = contents.getIndexOfClosestValue(contents.windowScrollY() + windowHeight * 0.2, articleOffsetIndex);

        if (articleIndex !== lastArticleIndex) {
            changeEvent = {};

            changeEvent.current = {
                article: config.articles[articleIndex],
                guide: guides[articleIndex]
            };

            if (lastArticleIndex !== undefined) {
                changeEvent.previous = {
                    article: config.articles[lastArticleIndex],
                    guide: guides[lastArticleIndex]
                };
            }

            emitter.trigger('change', changeEvent);

            lastArticleIndex = articleIndex;
        }
    });

    // This allows the script that constructs Contents
    // to catch the first ready, resize and scroll events.
    setTimeout(function () {
        emitter.trigger('resize');
        emitter.trigger('ready');

        window.addEventListener('resize', contents.throttle(function () {
            emitter.trigger('resize');
        }, 100));

        window.addEventListener('scroll', contents.throttle(function () {
            emitter.trigger('scroll');
        }, 100));
    }, 10);

    return emitter;
};

/**
 * @return {Number}
 */
contents.windowHeight = function () {
    return window.innerHeight || document.documentElement.clientHeight;
};

/**
 * @return {Number}
 */
contents.windowScrollY = function () {
    return window.pageYOffset || document.documentElement.scrollTop;
};

/**
 * Interpret execution configuration.
 *
 * @param {Object} config
 * @return {Object}
 */
contents.config = function (config) {
    var properties = ['contents', 'articles', 'link'];

    config = config || {};

    contents.forEach(Object.keys(config), function (name) {
        if (properties.indexOf(name) === -1) {
            throw new Error('Unknown configuration property.');
        }
    });

    if (!config.contents) {
        throw new Error('Option "contents" is not set.');
    } else if (!(config.contents instanceof HTMLElement)) {
        throw new Error('Option "contents" is not an HTMLElement object.');
    }

    if (config.articles) {
        if (!config.articles.length || !(config.articles[0] instanceof HTMLElement)) {
            throw new Error('Option "articles" is not a collection of HTMLElement objects.');
        }
    } else {
        config.articles = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    }

    if (config.link) {
        if (typeof config.link !== 'function') {
            throw new Error('Option "link" must be a function.');
        }
    } else {
        config.link = contents.link;
    }

    return config;
};

/**
 * Derive ID from articleName using formatId.
 * Ensure that ID is unique across the document.
 *
 * @param {String} articleName
 * @param {Function} formatId
 * @return {String}
 */
contents.id = function (articleName, formatId) {
    var formattedId,
        assignedId,
        i = 1;

    if (!formatId) {
        formatId = contents.formatId;
    }

    formattedId = formatId(articleName);

    if (!formattedId.match(/^[a-z]+[a-z0-9\-_:\.]*$/)) {
        throw new Error('Invalid ID.');
    }

    assignedId = formattedId;

    while (document.querySelector('#' + assignedId)) {
        assignedId = formattedId + '-' + (i++);
    }

    return assignedId;
};

/**
 * Format text into an ID/anchor safe value.
 *
 * @see http://stackoverflow.com/a/1077111/368691
 * @param {String} str
 * @return {String}
 */
contents.formatId = function (str) {
    return str
        .toLowerCase()
        .replace(/[ãàáäâ]/g, 'a')
        .replace(/[ẽèéëê]/g, 'e')
        .replace(/[ìíïî]/g, 'i')
        .replace(/[õòóöô]/g, 'o')
        .replace(/[ùúüû]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]+/g, '-')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '')
        .replace(/^[^a-z]+/g, '');
};

/**
 * @param {NodeList} articles
 * @return {HTMLElement}
 */
contents.makeList = function (articles) {
    var rootList = document.createElement('ol'),
        list = rootList,
        lastListInLevelIndex = [],
        lastListInLevelOrLower,
        lastListItem,
        lastLevel;

    lastListInLevelOrLower = function (level) {
        while (level > 0) {
            if (lastListInLevelIndex[level]) {
                return lastListInLevelIndex[level];
            }
            level--;
        }

        throw new Error('Invalid markup.');
    };

    contents.forEach(articles, function (article) {
        var level,
            li = document.createElement('li');

        level = contents.level(article);

        lastListInLevelIndex = lastListInLevelIndex.slice(0, level + 1);

        if (!lastLevel || lastLevel === level) {
            list.appendChild(li);
        } else if (lastLevel < level) {
            list = document.createElement('ol');
            list.appendChild(li);
            lastListItem.appendChild(list);
        } else {
            list = lastListInLevelOrLower(level);
            list.appendChild(li);
        }

        lastListInLevelIndex[level] = list;
        lastLevel = level;
        lastListItem = li;
    });

    return rootList;
};

/**
 * Extract element level used to construct list hierarchy, e.g. <h1> is 1, <h2> is 2.
 * When element is not a heading, use contents.level data attribute. Default to 1.
 *
 * @param {HTMLElement} element
 * @return {Number}
 */
contents.level = function (element) {
    var tagName = element.tagName.toLowerCase();

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(tagName) !== -1) {
        return parseInt(tagName.slice(1), 10);
    }

    if (element.dataset['gajus.contents.level'] !== undefined) {
        return parseInt(element.dataset['gajus.contents.level'], 10);
    }

    if (jQuery && jQuery.data(element, 'gajus.contents.level') !== undefined) {
        return jQuery.data(element, 'gajus.contents.level');
    }

    return 1;
};

/**
 * This function is called after the table of contents is generated.
 * It is called for each article in the index.
 * Used to represent article in the table of contents and to setup navigation.
 *
 * @param {HTMLElement} guide An element in the table of contents representing an article.
 * @param {HTMLElement} article The represented content element.
 */
contents.link = function (guide, article) {
    var guideLink = document.createElement('a'),
        articleLink = document.createElement('a'),
        articleName = article.innerText,
        articleId = article.id || contents.id(articleName);

    article.id = articleId;

    articleLink.href = '#' + articleId;

    while (article.childNodes.length) {
        articleLink.appendChild(article.childNodes[0], articleLink);
    }

    article.appendChild(articleLink);

    guideLink.appendChild(document.createTextNode(articleName));
    guideLink.href = '#' + articleId;
    guide.insertBefore(guideLink, guide.firstChild);
};

/**
 * Produce a list of offset values for each element.
 *
 * @param {NodeList} articles
 * @return {Array}
 */
contents.indexOffset = function (elements) {
    var scrollYIndex = [],
        i = 0,
        j = elements.length,
        element,
        offset;

    while (i < j) {
        element = elements[i++];

        offset = element.offsetTop;

        // element.offsetTop might produce a float value.
        // Round to the nearest multiple of 5 (either up or down).
        // This is done to help readability and testing.
        offset = 5*(Math.round(offset/5));

        scrollYIndex.push(offset);
    }

    return scrollYIndex;
};

/**
 * Find the nearest value to the needle in the haystack and return the value index.
 *
 * @see http://stackoverflow.com/a/26366951/368691
 * @param {Number} needle
 * @param {Array} haystack
 * @return {Number}
 */
contents.getIndexOfClosestValue = function (needle, haystack) {
    var closestValueIndex = 0,
        lastClosestValueIndex,
        i = 0,
        j = haystack.length;

    if (!j) {
        throw new Error('Haystack must be not empty.');
    }

    while (i < j) {
        if (Math.abs(needle - haystack[closestValueIndex]) > Math.abs(haystack[i] - needle)) {
            closestValueIndex = i;
        }

        if (closestValueIndex === lastClosestValueIndex) {
            break;
        }

        lastClosestValueIndex = closestValueIndex;

        i++;
    }

    return closestValueIndex;
};

/**
 * @callback throttleCallback
 * @param {...*} var_args
 */

/**
 * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly,
 * will only call the original function at most once per every wait milliseconds.
 *
 * @see https://remysharp.com/2010/07/21/throttling-function-calls
 * @param {throttleCallback} throttled
 * @param {Number} threshold Number of milliseconds between firing the throttled function.
 * @param {Object} context The value of "this" provided for the call to throttled.
 */
contents.throttle = function (throttled, threshold, context) {
    var last,
        deferTimer;

    threshold = threshold || 250;
    context = context || {};

    return function () {
        var now = +new Date(),
            args = arguments;

        if (last && now < last + threshold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                throttled.apply(context, args);
            }, threshold);
        } else {
            last = now;
            throttled.apply(context, args);
        }
    };
};

/**
 * @callback forEachCallback
 * @param {Number} index
 */

/**
 * Iterates over elements of a collection, executing the callback for each element.
 *
 * @param {Number} n The number of times to execute the callback.
 * @param {forEachCallback} callback
 */
contents.forEach = function (collection, callback) {
    var i = 0,
        j = collection.length;

    while (i < j) {
        callback(collection[i], i);

        i++;
    }
};

window.gajus = window.gajus || {};
window.gajus.contents = contents;
},{"sister":1}]},{},[2])
