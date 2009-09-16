// ==UserScript==
// @name        LDR with Social Bookmark Count Images
// @namespace   http://github.com/kga/userscripts
// @include     http://reader.livedoor.com/reader/
// @include     http://fastladder.com/reader/
// @require     http://labs.cybozu.co.jp/blog/mitsunari/2007/07/24/js/md5.js
// ==/UserScript==

// based on http://la.ma.la/blog/diary_200610182325.htm
// based on http://d.hatena.ne.jp/tnx/20060716/1152998347
// based on http://tokyoenvious.xrea.jp/b/web/livedoor_reader_meets_hatebu.html
// md5.js   http://labs.cybozu.co.jp/blog/mitsunari/2007/07/md5js_1.html

GM_addStyle(<><![CDATA[
    .widget_sbm_counter img {
        border: none;
        margin: 0px;
        vertical-align: middle;
    }
    .widget_sbm_counter a {
        margin: 0px 2.5px;
    }
]]></>);

var w = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;

var ignores  = /^http:\/\/(?:feeds\.feedburner|b\.hatena\.ne\.jp\/entry)/ig;
var services = {
    'Hatena::Bookmark': {
        enable: true,
        widget: function (link) {
            return [
                '<a href="http://b.hatena.ne.jp/entry/', link, '">',
                '<img src="http://d.hatena.ne.jp/images/b_entry.gif">',
                '<img src="http://api.b.st-hatena.com/entry/image/', link, '"></a>'
            ].join('');
        }
    },
    'livedoor Clip': {
        enable: false,
        widget: function (link) {
            return [
                '<a href="http://clip.livedoor.com/page/', link, '">',
                '<img src="http://parts.blog.livedoor.jp/img/cmn/clip_16_12_w.gif">',
                '<img src="http://image.clip.livedoor.com/counter/', link, '"></a>'
            ].join('');
        }
    },
    'del.icio.us': {
        enable: false,
        widget: function (link) {
            var md5 = CybozuLabs.MD5.calc_Fx(link);
            return [
                '<a href="http://del.icio.us/url/', md5, '">',
                '<img src="http://del.icio.us/favicon.ico">',
                '<img src="http://del.icio.us/feeds/img/savedcount/', md5, '?aggregate"></a>'
            ].join('');
        }
    },
    'POOKMARK Airlines': {
        enable: false,
        widget: function (link) {
            return [
                '<a href="http://pookmark.jp/url/', link, '">',
                '<img src="http://pookmark.jp/images/add/add.gif">',
                '<img src="http://pookmark.jp/count/', link, '"></a>'
            ].join('');
        }
    },
    'Buzzurl': {
        enable: false,
        widget: function (link) {
            var encoded = encodeURIComponent(link);
            return [
                '<a href="http://buzzurl.jp/entry/', link, '">',
                '<img src="http://buzzurl.jp/favicon.ico">',
                '<img src="http://api.buzzurl.jp/api/counter/v1/image?url=', encoded, '"></a>'
            ].join('');
        }
    },
    'Yahoo! Bookmark': {
        enable: false,
        widget: function (link) {
            var encoded = encodeURIComponent(link);
            return [
                '<a href="http://bookmarks.yahoo.co.jp/url?url=', encoded, '">',
                '<img src="http://bookmarks.yahoo.co.jp/favicon.ico">',
                '<img src="http://num.bookmarks.yahoo.co.jp/image/small/', link, '"></a>'
            ].join('');
        }
    },
    'fc2 Bookmark': {
        enable: false,
        widget: function (link) {
            var encoded = encodeURIComponent(link);
            return [
                '<a href="http://bookmark.fc2.com/search/detail?url=', encoded, '">',
                '<img src="http://bookmark.fc2.com/image/users/', link, '"></a>'
            ].join('');
        }
    }
};

w.entry_widgets.add('sbm_counter', function (feed, item) {
    var link = item.link.replace(/#/g, '%23');
    if (ignores.test(link)) return;

    var widgets = [];
    for (var s in services) {
        if (services[s].enable) widgets.push(services[s].widget(link));
    }
    return widgets.join('');
}, 'SBM count');
