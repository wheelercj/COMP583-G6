const shortLinkElement = document.getElementById('shortLink');
const copyButton = document.getElementById('copyButton');

function fallbackCopy() {
    shortLinkElement.focus();
    shortLinkElement.select();
    try {
        let successful = document.execCommand('copy');
        if (successful) {
            copyButton.innerHTML = '<img src="/public/images/check.svg" alt="check" />';
        } else {
            copyButton.innerText = 'Error';
        }
    } catch (err) {
        console.error('Fallback: unable to copy because ', err);
    }
}

function copyToClipboard() {
    if (!navigator.clipboard) {
        fallbackCopy();
    } else {
        navigator.clipboard.writeText(shortLinkElement.value).then(function () {
            copyButton.innerHTML = '<img src="/public/images/check.svg" alt="check" />';
        }, function (err) {
            copyButton.innerText = 'Error';
            console.log(err);
        });
    }
}
