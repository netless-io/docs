window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    let i = ["web", "ios", "android"].indexOf(platform ? platform.toLowerCase() : "");
    if (platform && i != -1) {
        changeTabActive(platform.toLowerCase(), "nav-link");
        changePanActive("tab-pane", i);
    }
});

function changeTabActive(platform, className) {
    const list = document.getElementsByClassName(className);
    [].forEach.call(list, element => {
        if (element.textContent.toLowerCase().indexOf(platform) != -1) {
            element.classList.add("active");
        } else {
            element.classList.remove("active");
        }
    });
}

function changePanActive(className, order, total=3) {
    const list = document.getElementsByClassName(className);
    [].forEach.call(list, (element, index) => {
        if (index % total == order) {
            element.classList.add("active");
        } else {
            element.classList.remove("active");
        }
    });
}