setTimeoutVal = null;

let font;

function loadFontResourceIfNeeded(name) {
    let resourceUrl;
    if (name === 'vazir') {
        resourceUrl = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v27.0.3/dist/font-face.css';
    } else if (name === 'shabnam') {
        resourceUrl = 'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css';
    } else if (name === 'rubik') {
        resourceUrl = 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700';
    } else if (name === 'harmattan') {
        resourceUrl = 'https://fonts.googleapis.com/css2?family=Harmattan:wght@400;700';
    } else if (name === 'tajawal') {
        resourceUrl = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700';
    }
    const id = name + '_font_style';
    if (resourceUrl != null && !document.getElementById(id)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = resourceUrl;
        link.media = 'all';
        head.appendChild(link);
    }
}

function updateDirection(event) {
    setTimeoutVal = null;
    document.querySelectorAll(
        '.user-content-block, .actionContainer .action-body, #tinymce'
    ).forEach(
        (function (x) {
            x.setAttribute("dir", "auto");
            if (font != null && font != 'null') {
                loadFontResourceIfNeeded(font);
                x.classList.add('rtlContent', font);
            } else {
                x.classList.add('rtlContent');
            }

        })
    );

}

if (location.host.startsWith('jira.')) {
    chrome.storage.sync.get('font', function (data) {
        font = data['font'];
        updateDirection(null);
    });

    document.addEventListener('DOMNodeInserted', (event) => {
        if (setTimeoutVal != null) {
            clearTimeout(setTimeoutVal);
        }
        setTimeoutVal = setTimeout(
            () => updateDirection(event),
            1000
        );
    });
}