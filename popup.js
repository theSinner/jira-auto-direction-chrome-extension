// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let fontType = 'default';
let font = 'null';
let freeFontSelect = document.getElementById('free_fonts');
let paidFontSelect = document.getElementById('paid_fonts');
function disableSelectTag(id) {
    document.getElementById(id).setAttribute('disabled', 'disabled')
}

function enableSelectTag(id) {
    document.getElementById(id).removeAttribute('disabled')
}

function checkRadioButton(id) {
    document.getElementById(id).checked = true;
}

function uncheckRadioButton(id) {
    document.getElementById(id).checked = false;
}

function setListeners() {
    document.getElementById('default').addEventListener('change', function () {
        disableSelectTag('free_fonts');
        disableSelectTag('paid_fonts');
        fontType = 'default';
    });
    document.getElementById('free').addEventListener('change', function () {
        enableSelectTag('free_fonts');
        disableSelectTag('paid_fonts');
        fontType = 'free';
    });
    document.getElementById('paid').addEventListener('change', function () {
        disableSelectTag('free_fonts');
        enableSelectTag('paid_fonts');
        fontType = 'paid';
    });
}


setListeners();
chrome.storage.sync.get('fontType', function (data) {
    fontType = data['fontType'];
    if (fontType === 'paid') {
        disableSelectTag('free_fonts');
        enableSelectTag('paid_fonts');
        uncheckRadioButton('default');
        uncheckRadioButton('free');
        checkRadioButton('paid');
    } else if (fontType === 'free') {
        enableSelectTag('free_fonts');
        disableSelectTag('paid_fonts');
        uncheckRadioButton('default');
        checkRadioButton('free');
        uncheckRadioButton('paid');
    } else {
        disableSelectTag('free_fonts');
        disableSelectTag('paid_fonts');
        checkRadioButton('default');
        uncheckRadioButton('free');
        uncheckRadioButton('paid');
    }
    chrome.storage.sync.get('font', function (data) {
        console.log(data);
        font = data['font'];
        if (fontType === 'free') {
            freeFontSelect.value = font;
        } else {
            paidFontSelect.value = font;
        }
    });
});


document.getElementById('submit').onclick = function (element) {
    font = 'null'
    if (fontType === 'free') {
        font = freeFontSelect.options[freeFontSelect.selectedIndex].value;
    } else if (fontType == 'paid') {
        font = paidFontSelect.options[paidFontSelect.selectedIndex].value;
    }
    if (font == 'null' && fontType != 'default') {
        return;
    }
    chrome.storage.sync.set({ fontType: fontType }, function () {
    });
    chrome.storage.sync.set({ font: font }, function () {
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
    window.close();
};
