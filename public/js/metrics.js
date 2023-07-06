const shortLinkInput = document.getElementById('shortLinkInput');
const form = document.getElementById('form');

shortLinkInput.focus();

shortLinkInput.onkeyup = () => {
    validateShortUrl();
};
form.onsubmit = (event) => {
    event.preventDefault();
    if (validateShortUrl()) {
        const shortLink = shortLinkInput.value;
        if (shortLink) {
            window.location.href = `/metrics/${shortLink}`;
        }
    }
};

function validateShortUrl() {
    if (isValidShortUrl(shortLinkInput.value) || shortLinkInput.value.length === 0) {
        shortLinkInput.style.border = "solid 1px gray";
        shortLinkError.innerHTML = "";
        shortLinkError.style.height = "0";
        return true;
    } else {
        shortLinkInput.style.border = "2px solid red";
        shortLinkError.innerHTML = "Custom links can contain only letters, numbers, underscores, and/or dashes, and are 30 characters or less.";
        shortLinkError.style.height = "auto";
        return false;
    }
}
