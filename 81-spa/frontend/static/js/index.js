import Home from './views/Home.js';
import Posts from './views/Posts.js';
import PostView from './views/PostView.js';
import Contacts from './views/Contacts.js';
// ===========================
// 🚀 Events Listeners
// ===========================
window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            history.pushState(null, null, e.target.href);
            router();
        }
    });

    router();
});

// ===========================
// 🚀 Functions
// ===========================
function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

function pathToRegex(path) {
    return new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');
}

async function router() {
    const routes = [
        {path: '/', view: Home},
        {path: '/posts', view: Posts},
        {path: '/posts/:id', view: PostView},
        {path: '/contacts', view: Contacts},
    ];

    const potentialMatches = routes.map(route => ({
        route: route,
        result: location.pathname.match(pathToRegex(route.path)),
    }));

    let match = potentialMatches.find(m => m.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname],
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector('#app').innerHTML = await view.getHtml();
}


