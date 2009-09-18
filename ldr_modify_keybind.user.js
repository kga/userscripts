// ==UserScript==
// @name        LDR modify keybind
// @namespace   http://github.com/kga/userscripts
// @include     http://reader.livedoor.com/reader/
// ==/UserScript==

location.href = 'javascript:void(' + encodeURIComponent(uneval(function () {

function mod_rate (n) {
    return function () {
        var feed = get_active_feed();
        if (!feed) return;
        var subs_id = feed.subscribe_id;
        var rate = subs_item(subs_id).rate + n;
        if (rate > 5 || 0 > rate) return;
        set_rate(subs_id, rate);
    };
}

function open_bookmark (prefix) {
    return function () {
        var item = get_active_item(true);
        if (!item) return;
        var link = prefix + item.link.unescapeHTML().replace(/#/g, '%23');
        open_link(link);
    };
}

function open_link (link) {
    window.open(link) || message('cannot_popup');
}

if (typeof Keybind != 'undefined') {
    register_hook('AFTER_SUBS_LOAD', Control.read_next_subs);
    Control.toggle_fullscreen();

    var kv = {
        I: mod_rate(+1),
        D: mod_rate(-1),
        A: function () {
            var feed = get_active_feed();
            if (!feed) return;
            feed.items.concat().reverse().forEach(function (item) {
                open_link(item.link.unescapeHTML());
                // pin.add(item.link, item.title, subs_item(feed.subscribe_id));
            });
        },
        g: function () {
            var feed = get_active_feed();
            if (feed) open_link(feed.channel.link);
        },
        q: function () {
            touch_all(get_active_feed().subscribe_id);
            Control.read_next_subs();
        },
        h: open_bookmark('http://b.hatena.ne.jp/entry/'),
        l: open_bookmark('http://clip.livedoor.com/page/'),
        r: function () { touch_all(get_active_feed().subscribe_id); },
        R: Control.reload_subs,
        x: function () {
            var item = get_active_item(true);
            if (!item) return;
            Control.show_subscribe_form();
            $('discover_url').value = item.link;
            $('discover_url').parentNode.submit();
        },
    };

    for (var key in kv) {
        Keybind.add(key, kv[key]);
    }

    Keybind.remove('ctrl+shift')
           .remove('shift+ctrl');
}
else setTimeout(arguments.callee, 100);

})) + ')()';
