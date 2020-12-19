setTimeoutVal = null;

let font;

function loadFontResourceIfNeeded(doc, name) {
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
    if (resourceUrl != null && !doc.getElementById(id)) {
        var head = doc.getElementsByTagName('head')[0];
        var link = doc.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = resourceUrl;
        link.media = 'all';
        head.appendChild(link);
    }
}

function setAttributesToElement(elem, extraClass) {
    elem.setAttribute("dir", "auto");
    if (font != null && font != 'null') {

        loadFontResourceIfNeeded(document, font);
        elem.classList.add(extraClass, font);
    } else {
        elem.classList.add(extraClass);
    }
}

function updateJiraDirection(event) {
    setTimeoutVal = null;
    document.querySelectorAll(
        '.user-content-block, .actionContainer .action-body, .content #summary, #addcomment textarea, .wiki-edit textarea'
    ).forEach(
        (function (x) {
            setAttributesToElement(x, 'rtlContent')
        })
    );
    document.querySelectorAll(
        '.activity-item .user-content, .activity-item textarea, #activity-stream blockquote p, .activity-item p'
    ).forEach(
        (function (x) {
            setAttributesToElement(x, 'notRtlContent')
        })
    );
    var iframe = document.querySelector('.rte-container iframe');
    if (iframe != null) {
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        var jiraAutoDirectionStyle = innerDoc.getElementById('jiraAutoDirectionStyle');
        if (jiraAutoDirectionStyle == null) {
            var style = document.createElement('style');
            style.id = 'jiraAutoDirectionStyle';
            style.textContent =
                '.rtlContent {' +
                'line-height: 2rem;' +
                '}';
            if (font != null && font != 'null') {
                style.textContent +=
                    'body p {' +
                    'font-family: ' + font + ", 'San Francisco Text', 'ubuntu', sans-serif !important;" +
                    '}'
            }
            iframe.contentDocument.head.appendChild(style);
            loadFontResourceIfNeeded(innerDoc, font);
            innerDoc.body.setAttribute("dir", "auto");
        }




    }

}

function updateConfluenceDirection(event) {
    setTimeoutVal = null;
    document.querySelectorAll(
        '#content #main-content, #title-text, #content #main-content p, #content #main-content h1, #content #main-content h2, #content #main-content h3, #content #main-content h4, #content #main-content h5, #content #main-content h6'
    ).forEach(
        (function (x) {
            x.setAttribute("dir", "auto");
            if (font != null && font != 'null') {
                loadFontResourceIfNeeded(font);
                x.classList.add(font);
            }
        })
    );
}

if (location.host.startsWith('jira.')) {
    chrome.storage.sync.get('font', function (data) {
        font = data['font'];
        updateJiraDirection(null);
    });

    document.addEventListener('DOMNodeInserted', (event) => {
        if (setTimeoutVal != null) {
            clearTimeout(setTimeoutVal);
        }
        setTimeoutVal = setTimeout(
            () => updateJiraDirection(event),
            1000
        );
    });
} else if (location.host.startsWith('confluence.')) {
    chrome.storage.sync.get('font', function (data) {
        font = data['font'];
        updateConfluenceDirection(null);
    });

    document.addEventListener('DOMNodeInserted', (event) => {
        if (setTimeoutVal != null) {
            clearTimeout(setTimeoutVal);
        }
        setTimeoutVal = setTimeout(
            () => updateConfluenceDirection(event),
            1000
        );
    });
}