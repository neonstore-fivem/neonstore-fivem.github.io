(function () {
    var C = window.NEON_CONFIG || {};
    var API = 'https://headless.tebex.io/api/accounts/' + encodeURIComponent(C.token || '');
    var BAPI = 'https://headless.tebex.io/api/baskets/';
    var KEY = 'neon_basket_ident';
    var PENDING = 'neon_pending_package';
    var LOGO = 'neon-logo.png';
    var BANNER = 'neon-banner.jpg';

    var state = { store: null, categories: [], packages: [], basket: null, pages: [] };
    var view = document.querySelector('[data-view]');

    var I = {
        arrow: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
        arrowLg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
        crumb: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
        bag: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.5 11h-11z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
        bagLg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.5 11h-11z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
        check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
        checkSm: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
        trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
        lock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        login: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>',
        shield: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/></svg>',
        info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>',
        bolt: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
        card: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/></svg>',
        back: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
        search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
        sort: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/></svg>',
        layers: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4"/></svg>',
        noResult: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8 11h6"/></svg>',
        emptyBag: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.5 11h-11z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
        doc: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
        link: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
        prev: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
        next: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
        play: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        refresh: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
        chat: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        lockSm: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
        chev: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
        discord: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.6 5.3A16.6 16.6 0 0 0 15.5 4l-.5 1a15.3 15.3 0 0 0-6 0L8.5 4a16.6 16.6 0 0 0-4.1 1.3C1.8 9.2 1.1 13 1.5 16.7a16.8 16.8 0 0 0 5 2.6l1.1-1.8a10.8 10.8 0 0 1-1.7-.8l.4-.3a11.9 11.9 0 0 0 11.4 0l.4.3a10.8 10.8 0 0 1-1.7.8l1.1 1.8a16.7 16.7 0 0 0 5-2.6c.5-4.3-.8-8.1-2.9-11.4ZM8.7 14.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/></svg>',
        clock: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4"/></svg>',
        shieldLg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
        globe: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>'
    };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function money(v) {
        return (Math.round((Number(v) || 0) * 100) / 100).toFixed(2);
    }

    function currency() {
        return (state.basket && state.basket.currency) || (state.store && state.store.currency) || '';
    }

    function catKey(c) {
        return c.slug ? c.slug : String(c.id);
    }

    function catLink(c) {
        return '#/category/' + encodeURIComponent(catKey(c));
    }

    function pkgLink(p) {
        return '#/package/' + encodeURIComponent(p.id);
    }

    function isPlaceholder(h) {
        var t = stripHtml(h).toLowerCase();
        return t.indexOf('this is a custom page which you can add') !== -1 ||
            t.indexOf('from within the tebex store control panel') !== -1 ||
            t.indexOf('lorem ipsum') !== -1;
    }

    function stripHtml(h) {
        var d = document.createElement('div');
        d.innerHTML = h || '';
        return d.textContent || '';
    }

    function tagsOf(p) {
        var t = (p.name + ' ' + stripHtml(p.description) + ' ' + (p.category && p.category.name ? p.category.name : '')).toLowerCase();
        return {
            free: priceOf(p) === 0,
            esx: t.indexOf('esx') !== -1,
            qbcore: t.indexOf('qbcore') !== -1 || t.indexOf('qb-core') !== -1 || t.indexOf('qb core') !== -1,
            qbox: t.indexOf('qbox') !== -1 || t.indexOf('qbx') !== -1,
            open: t.indexOf('open source') !== -1 || t.indexOf('open-source') !== -1 || t.indexOf('opensource') !== -1
        };
    }

    function tagString(t) {
        return ['free', 'esx', 'qbcore', 'qbox', 'open'].filter(function (k) { return t[k]; }).join(' ');
    }

    function mainImage(p) {
        var m = (p.media || []).filter(function (x) { return x.type !== 'video'; })[0];
        if (m && m.url) return m.url;
        if (p.image) return p.image;
        return '';
    }

    function youtubeId(u) {
        var s = String(u || '');
        var m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
        return m ? m[1] : s;
    }

    function api(url, opts) {
        opts = opts || {};
        var init = { method: opts.method || 'GET', headers: { 'Accept': 'application/json' } };
        if (opts.body) {
            init.headers['Content-Type'] = 'application/json';
            init.body = JSON.stringify(opts.body);
        }
        return fetch(url, init).then(function (r) {
            return r.text().then(function (txt) {
                var json = null;
                try { json = txt ? JSON.parse(txt) : null; } catch (e) { json = null; }
                if (!r.ok) {
                    var msg = (json && (json.detail || json.message || json.title)) || ('Request failed (' + r.status + ')');
                    var err = new Error(msg);
                    err.status = r.status;
                    throw err;
                }
                return json;
            });
        });
    }

    function toast(text, type) {
        var host = document.querySelector('[data-toast-host]');
        host.innerHTML = '';
        var el = document.createElement('div');
        el.className = 'toast toast-' + (type || 'success');
        el.setAttribute('role', 'status');
        el.innerHTML = '<span class="toast-icon">' + (type === 'danger' ? I.info : I.check) + '</span><span>' + esc(text) + '</span>' +
            '<button type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
        host.appendChild(el);
        var hide = function () {
            el.classList.add('is-leaving');
            setTimeout(function () { el.remove(); }, 200);
        };
        el.querySelector('button').addEventListener('click', hide);
        setTimeout(hide, 5000);
    }

    function baseUrl() {
        return window.location.href.split('#')[0];
    }

    function saveIdent(ident) {
        try {
            if (ident) localStorage.setItem(KEY, ident);
            else localStorage.removeItem(KEY);
        } catch (e) {}
    }

    function readIdent() {
        try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; }
    }

    function setBasket(b) {
        state.basket = b && !b.complete ? b : null;
        saveIdent(state.basket ? state.basket.ident : '');
        updateHeader();
    }

    function loadBasket() {
        var ident = state.basket ? state.basket.ident : readIdent();
        if (!ident) {
            setBasket(null);
            return Promise.resolve(null);
        }
        return api(API + '/baskets/' + encodeURIComponent(ident)).then(function (r) {
            setBasket(r && r.data);
            return state.basket;
        }).catch(function () {
            setBasket(null);
            return null;
        });
    }

    function ensureBasket() {
        if (state.basket) return Promise.resolve(state.basket);
        return api(API + '/baskets', {
            method: 'POST',
            body: {
                complete_url: baseUrl() + '#/thanks',
                cancel_url: baseUrl() + '#/checkout',
                complete_auto_redirect: true
            }
        }).then(function (r) {
            setBasket(r.data);
            return state.basket;
        });
    }

    function basketCount() {
        if (!state.basket || !state.basket.packages) return 0;
        return state.basket.packages.reduce(function (n, p) {
            return n + ((p.in_basket && p.in_basket.quantity) || 1);
        }, 0);
    }

    function inBasket(p) {
        if (!state.basket || !state.basket.packages) return false;
        return state.basket.packages.some(function (b) { return String(b.id) === String(p.id); });
    }

    function setPending(ident) {
        try {
            if (ident) localStorage.setItem(PENDING, ident);
            else localStorage.removeItem(PENDING);
        } catch (e) {}
    }

    function readPending() {
        try { return localStorage.getItem(PENDING) || ''; } catch (e) { return ''; }
    }

    function goLogin(returnHash, btn) {
        if (btn) btn.classList.add('is-busy');
        return ensureBasket().then(function (b) {
            return api(API + '/baskets/' + encodeURIComponent(b.ident) + '/auth?returnUrl=' + encodeURIComponent(baseUrl() + returnHash));
        }).then(function (r) {
            var list = Array.isArray(r) ? r : (r && r.data) || [];
            var first = list.filter(function (x) { return x && x.url; })[0];
            if (!first) throw new Error('Login is not available right now.');
            window.location.href = first.url;
        }).catch(function (e) {
            toast(e.message || 'Login is not available right now.', 'danger');
            if (btn) btn.classList.remove('is-busy');
        });
    }

    function addToBasket(p, btn) {
        if (btn) btn.classList.add('is-busy');
        if (!state.basket || !state.basket.username) {
            setPending(p.ident || String(p.id));
            return goLogin('#/checkout', btn);
        }
        return ensureBasket().then(function (b) {
            return api(BAPI + encodeURIComponent(b.ident) + '/packages', {
                method: 'POST',
                body: { package_id: p.ident || String(p.id), quantity: 1 }
            });
        }).then(function (r) {
            if (r && r.data) setBasket(r.data);
            else return loadBasket();
        }).then(function () {
            toast(p.name + ' added to your basket.');
            render();
        }).catch(function (e) {
            if (e && e.status === 404) setBasket(null);
            toast(e.message || 'Could not add this script.', 'danger');
            if (btn) btn.classList.remove('is-busy');
        });
    }

    function removeFromBasket(id, btn) {
        if (!state.basket) return;
        if (btn) btn.classList.add('is-busy');
        var p = findPackage(id);
        api(BAPI + encodeURIComponent(state.basket.ident) + '/packages/remove', {
            method: 'POST',
            body: { package_id: p && p.ident ? p.ident : String(id) }
        }).then(function (r) {
            if (r && r.data) setBasket(r.data);
            else return loadBasket();
        }).then(function () {
            render();
        }).catch(function (e) {
            toast(e.message || 'Could not remove this script.', 'danger');
            if (btn) btn.classList.remove('is-busy');
        });
    }

    function applyCoupon(code, btn) {
        if (!state.basket || !code) return;
        btn.classList.add('is-busy');
        api(API + '/baskets/' + encodeURIComponent(state.basket.ident) + '/coupons', {
            method: 'POST',
            body: { coupon_code: code }
        }).then(function () {
            return loadBasket();
        }).then(function () {
            toast('Coupon applied.');
            render();
        }).catch(function (e) {
            toast(e.message || 'This coupon is not valid.', 'danger');
            btn.classList.remove('is-busy');
        });
    }

    function login(btn) {
        goLogin('#/checkout', btn);
    }

    function addPending() {
        var ident = readPending();
        if (!ident || !state.basket || !state.basket.username) return Promise.resolve();
        setPending('');
        var p = findPackage(ident) || state.packages.filter(function (x) { return x.ident === ident; })[0];
        if (!p || inBasket(p)) return Promise.resolve();
        return api(BAPI + encodeURIComponent(state.basket.ident) + '/packages', {
            method: 'POST',
            body: { package_id: ident, quantity: 1 }
        }).then(function (r) {
            if (r && r.data) setBasket(r.data);
            else return loadBasket();
        }).then(function () {
            toast(p.name + ' added to your basket.');
        }).catch(function (e) {
            toast(e.message || 'Could not add this script.', 'danger');
        });
    }

    function pay(btn) {
        btn.classList.add('is-busy');
        loadBasket().then(function (b) {
            btn.classList.remove('is-busy');
            if (!b || !b.packages || !b.packages.length) {
                render();
                return;
            }
            if (!window.Tebex || !window.Tebex.checkout) {
                if (b.links && b.links.checkout) window.location.href = b.links.checkout;
                return;
            }
            window.Tebex.checkout.init({
                ident: b.ident,
                theme: 'dark',
                colors: [
                    { name: 'primary', color: '#c46bff' },
                    { name: 'secondary', color: '#ff5fd0' }
                ]
            });
            window.Tebex.checkout.on('payment:complete', function () {
                setBasket(null);
                window.location.hash = '#/thanks';
            });
            window.Tebex.checkout.launch();
        });
    }

    function findPackage(id) {
        var s = String(id);
        return state.packages.filter(function (p) { return String(p.id) === s || p.ident === s || p.slug === s; })[0] || null;
    }

    function findCategory(key) {
        var s = decodeURIComponent(String(key));
        return state.categories.filter(function (c) { return catKey(c) === s || String(c.id) === s; })[0] || null;
    }

    function updateHeader() {
        var total = document.querySelector('[data-basket-total]');
        var count = document.querySelector('[data-basket-count]');
        var n = basketCount();
        total.textContent = money(state.basket ? state.basket.total_price : 0) + ' ' + currency();
        count.textContent = n;
        count.hidden = n === 0;
        var user = document.querySelector('[data-user]');
        var name = state.basket && state.basket.username;
        user.hidden = !name;
        var lb = document.querySelector('[data-header-login]');
        if (lb) lb.hidden = !!name || !state.store;
        if (name) {
            document.querySelector('[data-user-avatar]').textContent = String(name).charAt(0).toUpperCase();
            document.querySelector('[data-user-name]').textContent = name;
            user.title = name;
        }
    }

    function buildChrome() {
        var nav = document.querySelector('[data-nav]');
        nav.innerHTML = '<a href="#/" data-nav-link><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>Home</a>' +
            state.categories.map(function (c) {
                return '<a href="' + catLink(c) + '" data-nav-link>' + esc(c.name) + '</a>';
            }).join('');

        var shop = document.querySelector('[data-footer-shop]');
        shop.innerHTML = '<b>Shop</b>' + state.categories.slice(0, 6).map(function (c) {
            return '<a href="' + catLink(c) + '">' + esc(c.name) + '</a>';
        }).join('');

        var help = document.querySelector('[data-footer-help]');
        state.pages.forEach(function (p) {
            if (!p.slug || p.private) return;
            var a = document.createElement('a');
            a.href = '#/page/' + encodeURIComponent(p.slug);
            a.textContent = p.title;
            help.appendChild(a);
        });

        document.querySelectorAll('[data-discord]').forEach(function (a) {
            if (C.discord) {
                a.href = C.discord;
                a.hidden = false;
            }
        });

        if (C.announcement) {
            document.querySelector('[data-announce-text]').textContent = C.announcement;
            document.querySelector('[data-announce]').hidden = false;
        }
        if (C.footerText) document.querySelector('[data-footer-text]').textContent = C.footerText;
        var name = C.storeName || (state.store && state.store.name) || 'Neon Store';
        document.querySelector('[data-copyright]').textContent = '© ' + new Date().getFullYear() + ' ' + name + '. All rights reserved.';

        var headerLogin = document.querySelector('[data-header-login]');
        headerLogin.addEventListener('click', function () {
            var here = window.location.hash || '#/';
            goLogin(here.split('?')[0], headerLogin);
        });

        var toggle = document.querySelector('[data-nav-toggle]');
        var setOpen = function (open) {
            nav.classList.toggle('open', open);
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(!nav.classList.contains('open'));
        });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
        window.addEventListener('hashchange', function () { setOpen(false); });
    }

    function markNav(path) {
        document.querySelectorAll('[data-nav-link]').forEach(function (a) {
            var target = a.getAttribute('href').replace(/^#/, '');
            a.classList.toggle('is-active', target === path || (target !== '/' && path.indexOf(target) === 0));
        });
    }

    function priceOf(p) {
        var v = p.base_price != null ? Number(p.base_price) : Number(p.total_price);
        return Math.round((v || 0) * 100) / 100;
    }

    function oldPriceOf(p) {
        var d = Number(p.discount) || 0;
        return d > 0 ? Math.round((priceOf(p) + d) * 100) / 100 : 0;
    }

    function priceHtml(p, big) {
        if (priceOf(p) === 0) return '<strong>Free</strong>';
        var sub = p.type === 'subscription' && big ? ' / month' : '';
        var old = oldPriceOf(p);
        return '<strong>' + money(priceOf(p)) + '</strong><span class="currency">' + esc(p.currency || currency()) + sub + '</span>' +
            (old ? '<del>' + money(old) + '</del>' : '');
    }

    function buyButton(p, big) {
        var cls = big ? 'btn btn-primary btn-wide btn-lg' : 'btn btn-primary';
        if (inBasket(p)) {
            return '<a class="' + (big ? 'btn btn-primary btn-wide btn-lg' : 'btn btn-soft') + '" href="#/checkout">' + I.check + (big ? 'In basket, go to checkout' : 'In basket') + '</a>';
        }
        var t = tagsOf(p);
        var label = p.type === 'subscription' ? 'Subscribe' : (t.free ? (big ? 'Get for free' : 'Get free') : (big ? 'Add to basket' : 'Add'));
        return '<button type="button" class="' + cls + '" data-add="' + esc(p.id) + '">' + (big ? I.bagLg : I.bag) + label + '</button>';
    }

    function cardHtml(p, order) {
        var t = tagsOf(p);
        var img = mainImage(p);
        var tags = tagString(t);
        return '<article class="package-card" data-card data-name="' + esc(p.name.toLowerCase()) + '" data-price="' + priceOf(p) + '" data-tags="' + tags + '" data-order="' + order + '">' +
            '<a class="package-media" href="' + pkgLink(p) + '" tabindex="-1" aria-hidden="true">' +
            (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '<img class="placeholder" src="' + LOGO + '" alt="" loading="lazy">') +
            (oldPriceOf(p) ? '<span class="tag">-' + Math.round((1 - priceOf(p) / oldPriceOf(p)) * 100) + '%</span>' : (t.free ? '<span class="tag">FREE</span>' : '')) +
            (p.type === 'subscription' ? '<span class="tag tag-right">Monthly</span>' : '') +
            '</a>' +
            '<div class="package-body">' +
            '<a class="package-name" href="' + pkgLink(p) + '">' + esc(p.name) + '</a>' +
            '<div class="chips">' +
            (t.esx ? '<span class="chip">ESX</span>' : '') +
            (t.qbcore ? '<span class="chip">QBCORE</span>' : '') +
            (t.qbox ? '<span class="chip">QBOX</span>' : '') +
            (t.open ? '<span class="chip chip-open">OPEN SOURCE</span>' : '') +
            '</div>' +
            '<div class="package-foot"><div class="price">' + priceHtml(p) + '</div>' +
            '<div class="package-actions">' + buyButton(p) + '</div></div>' +
            '</div></article>';
    }

    function fwInfo(c) {
        var n = c.name.toLowerCase();
        if (n.indexOf('free') !== -1 || n.indexOf('ücretsiz') !== -1) return { note: 'No cost, no catch', mark: 'FREE', kind: 'free' };
        if (n.indexOf('open') !== -1 || n.indexOf('source') !== -1) return { note: 'Full, editable code', mark: '&lt;/&gt;', kind: 'code' };
        if (n.indexOf('qbox') !== -1 || n.indexOf('qbx') !== -1) return { note: 'qbx_core', mark: 'QBX', kind: 'fw' };
        if (n.indexOf('qb') !== -1) return { note: 'qb-core', mark: 'QB', kind: 'fw' };
        if (n.indexOf('esx') !== -1) return { note: 'es_extended', mark: 'ESX', kind: 'fw' };
        if (n.indexOf('escrow') !== -1) return { note: 'Cfx.re escrow protected', mark: esc(c.name.slice(0, 3).toUpperCase()), kind: 'fw' };
        return { note: 'FiveM resources', mark: esc(c.name.slice(0, 3).toUpperCase()), kind: 'fw' };
    }

    function renderHome() {
        var first = state.categories[0];
        var firstLink = first ? catLink(first) : '#/';
        var limit = window.matchMedia('(max-width: 760px)').matches ? 4 : 8;
        var paid = state.packages.filter(function (p) { return priceOf(p) > 0; });
        var free = state.packages.filter(function (p) { return priceOf(p) === 0; });
        var picked = paid.concat(free).slice(0, limit);
        var discord = C.discord;

        view.innerHTML =
            '<section class="hero">' +
            '<img class="hero-art" src="' + esc(C.heroPhoto || BANNER) + '" alt="" fetchpriority="high">' +
            '<div class="hero-shade"></div>' +
            '<div class="hero-body">' +
            '<p class="hero-line">' + esc(C.heroBadge || 'FiveM resources for ESX, QBCore and Qbox') + '</p>' +
            '<h1>' + esc(C.heroTitle || 'Neon Store') + '</h1>' +
            '<p class="hero-sub">' + esc(C.heroSubtitle || '') + '</p>' +
            '<div class="hero-actions">' +
            '<a class="btn btn-primary btn-lg" href="' + firstLink + '">Browse scripts' + I.arrowLg + '</a>' +
            (discord ? '<a class="btn btn-ghost btn-lg" href="' + esc(discord) + '" target="_blank" rel="noopener">' + I.discord + 'Discord</a>' : '') +
            '</div></div>' +
            '<ul class="hero-bar">' +
            '<li>' + I.clock + '<div><b>Fast Services</b><span>Delivered to your Cfx.re portal right after payment</span></div></li>' +
            '<li>' + I.shieldLg + '<div><b>Trusted Services</b><span>Tested on live servers, supported on Discord</span></div></li>' +
            '<li>' + I.globe + '<div><b>Global Services</b><span>Pay in your currency, checkout by Tebex</span></div></li>' +
            '</ul></section>' +

            (state.categories.length ? '<section class="section"><div class="section-head"><h2>Frameworks</h2></div><div class="fw-grid">' +
                state.categories.map(function (c) {
                    var f = fwInfo(c);
                    return '<a class="fw-card is-' + f.kind + '" href="' + catLink(c) + '">' +
                        '<span class="fw-mark" aria-hidden="true">' + f.mark + '</span>' +
                        '<span class="fw-name">' + esc(c.name) + '</span>' +
                        '<span class="fw-note">' + f.note + '</span>' +
                        '<span class="fw-go">Browse' + I.arrow + '</span></a>';
                }).join('') + '</div></section>' : '') +

            (picked.length ? '<section class="section"><div class="section-head"><h2>Scripts</h2><a class="head-link" href="' + firstLink + '">View all' + I.arrow + '</a></div>' +
                '<div class="package-grid">' + picked.map(cardHtml).join('') + '</div></section>' : '') +

            '<section class="section help"><div class="help-side"><h2>Questions</h2>' +
            '<p>Can\'t find your answer here? Open a ticket on Discord and the developers will get back to you.</p>' +
            (discord ? '<a class="btn btn-discord" href="' + esc(discord) + '" target="_blank" rel="noopener">' + I.discord + 'Open a ticket</a>' : '') +
            '</div><div class="faq">' +
            faq('How do I get my script after paying?', 'It is added to the Cfx.re account you logged in with. Go to portal.cfx.re, open Granted Assets and download it. Drop the folder in your resources and add it to your server.cfg.', true) +
            faq('Does it work with my framework?', 'Every script lists the frameworks it supports on its card and in the compatibility table on its page.') +
            faq('Escrow or open source?', 'Scripts marked Open Source ship with the full code. The rest use Cfx.re escrow, with config files and locales left open so you can still adjust them.') +
            faq('Do I get updates?', 'Yes. Updates appear in your Cfx.re portal automatically and changelogs are posted on Discord.') +
            '</div></section>' +
            (state.store && state.store.description ? '<section class="section card prose">' + state.store.description + '</section>' : '');
    }

    function faq(q, a, open) {
        return '<details' + (open ? ' open' : '') + '><summary>' + esc(q) + I.chev + '</summary><p>' + esc(a) + '</p></details>';
    }

    function renderCategory(key) {
        var c = findCategory(key);
        if (!c) return renderNotFound();
        var list = c.packages || [];
        view.innerHTML =
            '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>' + I.crumb + '<span>' + esc(c.name) + '</span></nav>' +
            '<section class="banner"><img class="banner-photo" src="' + BANNER + '" alt=""><div class="banner-shade"></div><div class="banner-body">' +
            '<h1>' + esc(c.name) + '</h1>' +
            (c.description && stripHtml(c.description).trim() ? '<div class="banner-desc prose">' + c.description + '</div>' : '') +
            '<span class="count-pill">' + list.length + ' ' + (list.length === 1 ? 'script' : 'scripts') + '</span></div></section>' +
            (list.length ?
                '<div class="toolbar" data-toolbar>' +
                '<label class="search">' + I.search + '<input type="search" placeholder="Search scripts" aria-label="Search scripts" data-search></label>' +
                '<div class="filters" data-filters role="group" aria-label="Filter">' +
                '<button type="button" class="filter is-active" data-filter="all">All</button>' +
                '<button type="button" class="filter" data-filter="esx">ESX</button>' +
                '<button type="button" class="filter" data-filter="qbcore">QBCore</button>' +
                '<button type="button" class="filter" data-filter="qbox">Qbox</button>' +
                '<button type="button" class="filter" data-filter="free">Free</button>' +
                '<button type="button" class="filter" data-filter="open">Open source</button>' +
                '</div>' +
                '<label class="sort">' + I.sort + '<select aria-label="Sort" data-sort>' +
                '<option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option>' +
                '</select></label></div>' +
                '<div class="package-grid" data-grid>' + list.map(function (p, i) { return cardHtml(p, i + 1); }).join('') + '</div>' +
                '<div class="empty is-hidden" data-no-results>' + I.noResult + '<p>No scripts match your search.</p><button type="button" class="btn btn-ghost" data-reset>Clear filters</button></div>'
                :
                '<div class="empty">' + I.layers + '<p>No scripts in this category yet. New releases are announced on Discord first.</p><a class="btn btn-primary" href="#/">Back to home</a></div>');
        bindFilters();
    }

    function bindFilters() {
        var grid = view.querySelector('[data-grid]');
        if (!grid) return;
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
        var search = view.querySelector('[data-search]');
        var sort = view.querySelector('[data-sort]');
        var filters = view.querySelectorAll('[data-filter]');
        var noResults = view.querySelector('[data-no-results]');
        var reset = view.querySelector('[data-reset]');
        var active = 'all';

        filters.forEach(function (btn) {
            var key = btn.getAttribute('data-filter');
            if (key === 'all') return;
            var used = cards.some(function (c) { return (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + key + ' ') !== -1; });
            if (!used) btn.hidden = true;
        });
        var visible = Array.prototype.filter.call(filters, function (b) { return !b.hidden; });
        if (visible.length < 2) view.querySelector('[data-filters]').hidden = true;

        var apply = function () {
            var term = search ? search.value.trim().toLowerCase() : '';
            var shown = 0;
            cards.forEach(function (card) {
                var tags = ' ' + card.getAttribute('data-tags') + ' ';
                var okTag = active === 'all' || tags.indexOf(' ' + active + ' ') !== -1;
                var okTerm = !term || card.getAttribute('data-name').indexOf(term) !== -1 || tags.indexOf(term) !== -1;
                card.hidden = !(okTag && okTerm);
                if (okTag && okTerm) shown++;
            });
            if (noResults) noResults.classList.toggle('is-hidden', shown > 0);
        };
        var order = function () {
            var mode = sort ? sort.value : 'featured';
            cards.slice().sort(function (a, b) {
                var pa = parseFloat(a.getAttribute('data-price')) || 0;
                var pb = parseFloat(b.getAttribute('data-price')) || 0;
                if (mode === 'price-asc') return pa - pb;
                if (mode === 'price-desc') return pb - pa;
                if (mode === 'name') return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                return a.getAttribute('data-order') - b.getAttribute('data-order');
            }).forEach(function (c) { grid.appendChild(c); });
        };
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                active = btn.getAttribute('data-filter');
                filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
                apply();
            });
        });
        if (search) search.addEventListener('input', apply);
        if (sort) sort.addEventListener('change', order);
        if (reset) reset.addEventListener('click', function () {
            search.value = '';
            active = 'all';
            filters.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-filter') === 'all'); });
            apply();
        });
    }

    function renderPackage(id) {
        var p = findPackage(id);
        if (!p) return renderNotFound();
        var t = tagsOf(p);
        var cat = p.category ? state.categories.filter(function (c) { return String(c.id) === String(p.category.id); })[0] : null;
        var media = (p.media || []).slice();
        if (!media.length && p.image) media = [{ type: 'image', url: p.image }];
        var row = function (label, ok, yes, no) {
            return '<div class="compat-row"><span>' + label + '</span>' + (ok ? '<span class="yes">' + I.checkSm + yes + '</span>' : '<span class="no">' + no + '</span>') + '</div>';
        };

        var slides = media.length ? media.map(function (m, i) {
            if (m.type === 'video') {
                return '<div class="slide video' + (i === 0 ? ' is-active' : '') + '" data-slide><iframe src="https://www.youtube.com/embed/' + esc(youtubeId(m.url)) + '?color=white&amp;rel=0" title="' + esc(p.name) + '" loading="lazy" allowfullscreen></iframe></div>';
            }
            return '<img class="slide' + (i === 0 ? ' is-active' : '') + '" src="' + esc(m.url) + '" alt="' + esc(p.name) + '" data-slide>';
        }).join('') : '<div class="slide is-active slide-empty" data-slide><img class="placeholder" src="' + LOGO + '" alt=""></div>';

        var multi = media.length > 1;
        view.innerHTML =
            '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>' + I.crumb +
            '<a href="' + (cat ? catLink(cat) : '#/') + '">' + esc(cat ? cat.name : 'Scripts') + '</a>' + I.crumb +
            '<span>' + esc(p.name) + '</span></nav>' +
            '<div class="package-page"><div class="package-main">' +
            '<div class="gallery" data-gallery tabindex="0"><div class="gallery-stage" data-stage>' + slides +
            (multi ? '<button type="button" class="gallery-nav prev" aria-label="Previous" data-prev>' + I.prev + '</button><button type="button" class="gallery-nav next" aria-label="Next" data-next>' + I.next + '</button>' : '') +
            '</div>' +
            (multi ? '<div class="thumbs" data-thumbs>' + media.map(function (m, i) {
                var src = m.type === 'video' ? 'https://img.youtube.com/vi/' + esc(youtubeId(m.url)) + '/mqdefault.jpg' : esc(m.url);
                return '<button type="button" class="thumb' + (i === 0 ? ' is-active' : '') + '" data-thumb="' + i + '" aria-label="Show media ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy">' + (m.type === 'video' ? '<span class="play">' + I.play + '</span>' : '') + '</button>';
            }).join('') + '</div>' : '') +
            '</div>' +
            (p.description && stripHtml(p.description).trim() ? '<section class="card"><h2 class="card-title">' + I.doc + 'Description</h2><div class="prose">' + p.description + '</div></section>' : '') +
            '</div>' +
            '<aside class="buy-box"><div class="buy-head">' +
            (cat ? '<a class="buy-cat" href="' + catLink(cat) + '">' + esc(cat.name) + '</a>' : '') +
            '<h1>' + esc(p.name) + '</h1><div class="chips">' +
            (t.free ? '<span class="chip chip-free">FREE</span>' : '') +
            (t.esx ? '<span class="chip">ESX</span>' : '') +
            (t.qbcore ? '<span class="chip">QBCORE</span>' : '') +
            (t.qbox ? '<span class="chip">QBOX</span>' : '') +
            (t.open ? '<span class="chip chip-open">OPEN SOURCE</span>' : '') +
            (p.type === 'subscription' ? '<span class="chip">SUBSCRIPTION</span>' : '') +
            '</div></div>' +
            '<div class="price big">' + priceHtml(p, true) + '</div>' +
            '<div class="buy-actions">' + buyButton(p, true) +
            '<button type="button" class="btn btn-ghost btn-wide" data-copy-link>' + I.link + '<span data-copy-label>Copy link</span></button></div>' +
            '<div class="compat"><b>Compatibility</b>' +
            row('ESX', t.esx, 'Supported', 'Not listed') +
            row('QBCore', t.qbcore, 'Supported', 'Not listed') +
            row('Qbox', t.qbox, 'Supported', 'Not listed') +
            row('Source code', t.open, 'Open', 'Escrow protected') +
            '</div>' +
            '<ul class="perks">' +
            '<li><span class="perk-icon">' + I.bolt + '</span>Instant delivery to your Cfx.re portal</li>' +
            '<li><span class="perk-icon">' + I.refresh + '</span>Free lifetime updates</li>' +
            '<li><span class="perk-icon">' + I.chat + '</span>Support through Discord tickets</li>' +
            '<li><span class="perk-icon">' + I.lockSm + '</span>Secure payment through Tebex</li>' +
            '</ul></aside></div>';
        document.title = p.name + ' | ' + (C.storeName || 'Neon Store');
        bindGallery();
        bindCopy();
    }

    function bindGallery() {
        var gallery = view.querySelector('[data-gallery]');
        if (!gallery) return;
        var slides = gallery.querySelectorAll('[data-slide]');
        var thumbs = gallery.querySelectorAll('[data-thumb]');
        var current = 0;
        var show = function (i) {
            current = (i + slides.length) % slides.length;
            slides.forEach(function (s, idx) {
                var on = idx === current;
                s.classList.toggle('is-active', on);
                if (!on) {
                    var f = s.querySelector('iframe');
                    if (f) f.src = f.src;
                }
            });
            thumbs.forEach(function (t, idx) { t.classList.toggle('is-active', idx === current); });
            var a = thumbs[current];
            if (a && a.parentNode) a.parentNode.scrollLeft = a.offsetLeft - a.parentNode.clientWidth / 2 + a.clientWidth / 2;
        };
        thumbs.forEach(function (t) {
            t.addEventListener('click', function () { show(parseInt(t.getAttribute('data-thumb'), 10)); });
        });
        var prev = gallery.querySelector('[data-prev]');
        var next = gallery.querySelector('[data-next]');
        if (prev) prev.addEventListener('click', function () { show(current - 1); });
        if (next) next.addEventListener('click', function () { show(current + 1); });
        gallery.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });
    }

    function bindCopy() {
        view.querySelectorAll('[data-copy-link]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var label = btn.querySelector('[data-copy-label]');
                var done = function () {
                    label.textContent = 'Link copied';
                    setTimeout(function () { label.textContent = 'Copy link'; }, 1800);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(window.location.href).then(done, done);
                else done();
            });
        });
    }

    function renderCheckout() {
        var b = state.basket;
        var items = b && b.packages ? b.packages : [];
        var user = b && b.username;
        var head = '<section class="page-head"><h1>Basket</h1><ol class="progress" aria-label="Checkout steps">' +
            '<li class="is-done"><span>1</span>Basket</li>' +
            '<li class="' + (items.length ? 'is-current' : '') + '"><span>2</span>Payment</li>' +
            '<li><span>3</span>Download</li></ol></section>';

        if (!items.length) {
            view.innerHTML = head + '<div class="empty">' + I.emptyBag + '<p>Your basket is empty. Find something for your server.</p><a class="btn btn-primary" href="#/">Browse scripts</a></div>';
            return;
        }

        view.innerHTML = head + '<div class="checkout"><div class="basket-list">' +
            items.map(function (it) {
                var p = findPackage(it.id);
                var img = it.image || (p ? mainImage(p) : '');
                var qty = it.in_basket && it.in_basket.quantity ? it.in_basket.quantity : 1;
                var price = it.in_basket && it.in_basket.price != null ? it.in_basket.price : (p ? priceOf(p) : 0);
                return '<div class="basket-row"><div class="basket-thumb">' +
                    (img ? '<img src="' + esc(img) + '" alt="">' : '<img class="placeholder" src="' + LOGO + '" alt="">') +
                    '</div><div class="basket-name"><b>' + esc(it.name) + '</b><span>' + (qty > 1 ? 'Qty ' + qty + ' &middot; ' : '') + 'Digital delivery</span></div>' +
                    '<div class="basket-price">' + money(price) + ' <small>' + esc(currency()) + '</small></div>' +
                    '<button type="button" class="icon-btn icon-danger" data-remove="' + esc(it.id) + '" aria-label="Remove ' + esc(it.name) + '" title="Remove">' + I.trash + '</button></div>';
            }).join('') +
            '<a class="back" href="#/">' + I.back + 'Continue shopping</a></div>' +
            '<div class="summary"><h2 class="card-title">Order summary</h2>' +
            '<div class="summary-row"><span>Items</span><b>' + basketCount() + '</b></div>' +
            (b.coupons && b.coupons.length ? '<div class="summary-row"><span>Coupons</span><b>' + b.coupons.map(function (c) { return esc(c.code || 'Applied'); }).join(', ') + '</b></div>' : '') +
            (user ? '<div class="summary-row"><span>Delivered to</span><b>' + esc(user) + '</b></div>' : '') +
            (Number(b.sales_tax) > 0 ? '<div class="summary-row"><span>Tax</span><b>' + money(b.sales_tax) + ' ' + esc(currency()) + '</b></div>' : '') +
            '<div class="summary-row total"><span>Total</span><b>' + money(b.total_price) + ' ' + esc(currency()) + '</b></div>' +
            '<form class="coupon-form" data-coupon><input type="text" placeholder="Coupon code" aria-label="Coupon code" autocomplete="off"><button type="submit" class="btn btn-ghost">Apply</button></form>' +
            (user ?
                '<button type="button" class="btn btn-primary btn-wide btn-lg" data-pay>' + I.lock + 'Pay securely</button>' :
                '<p class="login-note">' + I.info + '<span>Log in with your Cfx.re account first. Your scripts are delivered to that account.</span></p>' +
                '<button type="button" class="btn btn-primary btn-wide btn-lg" data-login>' + I.login + 'Login with Cfx.re</button>') +
            '<p class="secure-note">' + I.shield + 'Gift cards can be added in the payment window.</p>' +
            '<ul class="summary-perks"><li>' + I.bolt + 'Delivered instantly to your Cfx.re portal</li><li>' + I.card + 'Cards, PayPal and local payment methods</li></ul>' +
            '</div></div>';

        view.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { removeFromBasket(btn.getAttribute('data-remove'), btn); });
        });
        var form = view.querySelector('[data-coupon]');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            applyCoupon(form.querySelector('input').value.trim(), form.querySelector('button'));
        });
        var loginBtn = view.querySelector('[data-login]');
        if (loginBtn) loginBtn.addEventListener('click', function () { login(loginBtn); });
        var payBtn = view.querySelector('[data-pay]');
        if (payBtn) payBtn.addEventListener('click', function () { pay(payBtn); });
    }

    function renderThanks() {
        view.innerHTML = '<div class="empty thanks-box">' + I.check +
            '<h1>Thank you for your purchase</h1>' +
            '<p>Your scripts are on their way to your Cfx.re account. Open Granted Assets in the Cfx.re portal to download them.</p>' +
            '<a class="btn btn-primary" href="https://portal.cfx.re/assets/granted-assets" target="_blank" rel="noopener">Open my downloads</a>' +
            '<a class="btn btn-ghost" href="#/">Back to store</a></div>';
    }

    function renderPage(slug) {
        var p = state.pages.filter(function (x) { return x.slug === decodeURIComponent(slug); })[0];
        if (!p) return renderNotFound();
        view.innerHTML = '<section class="page-head"><h1>' + esc(p.title) + '</h1></section><article class="card prose">' + (p.content || '') + '</article>';
    }

    function renderNotFound() {
        view.innerHTML = '<div class="empty">' + I.noResult + '<p>This page could not be found.</p><a class="btn btn-primary" href="#/">Back to home</a></div>';
    }

    function renderSetup(msg) {
        view.innerHTML = '<div class="empty setup-box">' + I.info + '<p>' + msg + '</p></div>';
    }

    function bindAdd() {
        view.querySelectorAll('[data-add]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var p = findPackage(btn.getAttribute('data-add'));
                if (p) addToBasket(p, btn);
            });
        });
    }

    function render() {
        var hash = window.location.hash.replace(/^#/, '') || '/';
        var path = hash.split('?')[0];
        var parts = path.split('/').filter(Boolean);
        document.title = C.storeName || 'Neon Store';
        if (parts[0] === 'category' && parts[1]) renderCategory(parts[1]);
        else if (parts[0] === 'package' && parts[1]) renderPackage(parts[1]);
        else if (parts[0] === 'checkout') renderCheckout();
        else if (parts[0] === 'thanks') renderThanks();
        else if (parts[0] === 'page' && parts[1]) renderPage(parts[1]);
        else if (!parts.length) renderHome();
        else renderNotFound();
        bindAdd();
        markNav(path);
    }

    function start() {
        if (!C.token) {
            renderSetup('Add your Tebex public token to <code>config.js</code> to load the store.');
            return;
        }
        Promise.all([
            api(API),
            api(API + '/categories?includePackages=1'),
            api(API + '/pages').catch(function () { return { data: [] }; })
        ]).then(function (res) {
            state.store = res[0] && res[0].data;
            if (state.store && isPlaceholder(state.store.description)) state.store.description = '';
            state.categories = (res[1] && res[1].data) || [];
            state.pages = ((res[2] && res[2].data) || []).filter(function (p) { return !isPlaceholder(p.content); });
            var seen = {};
            state.categories.forEach(function (c) {
                (c.packages || []).forEach(function (p) {
                    if (!p.category) p.category = { id: c.id, name: c.name };
                    if (seen[p.id]) return;
                    seen[p.id] = true;
                    state.packages.push(p);
                });
            });
            buildChrome();
            return loadBasket();
        }).then(function () {
            return addPending();
        }).then(function () {
            render();
            var after = window.location.hash.split('?')[0];
            if (after === '#/thanks') setBasket(null);
        }).catch(function () {
            renderSetup('The store could not be loaded. Check the public token in <code>config.js</code> and try again.');
        });
        window.addEventListener('hashchange', function () {
            window.scrollTo(0, 0);
            if (window.location.hash.indexOf('#/checkout') === 0) {
                loadBasket().then(render);
                return;
            }
            render();
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
