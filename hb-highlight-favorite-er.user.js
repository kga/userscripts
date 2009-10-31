// ==UserScript==
// @name        Hatena::Bookmark - Highlight Favorite-er
// @namespace   http://github.com/kga/userscripts
// @include     http://b.hatena.ne.jp/entry/*
// ==/UserScript==

(function () {
    var favs = Array.map(
        document.querySelectorAll('#favorite-userlist li img'),
        function (img) img.title
    );

    if (favs.length == 0) return;

    GM_addStyle(
        favs.map(function (id) '#bookmark-user-' + id).join(', ') + ' { ' +
            '-moz-border-radius: 0.5em !important;' +
            'border: 1px solid #CCC !important;' +
            'background-color: #FFF !important;' +
        ' }'
    );
})();
