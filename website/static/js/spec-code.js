window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    let i = ["ios", "web", "android"].indexOf(platform ? platform.toLowerCase() : "");
    console.log(`spec-code`, platform, i);
    if (platform && i != -1) {
        changeTabActive(platform.toLowerCase(), "nav-link");
        changePanActive("tab-pane", i);
    }
});

function changeTabActive(platform, className) {
    const list = document.getElementsByClassName(className);
    [].forEach.call(list, element => {
        if (element.textContent.toLowerCase().indexOf(platform) != -1) {
            element.className = `${className} active`;
        } else {
            element.className = `${className}`;
        }
    });
}

function changePanActive(className, i, total=3) {
    const list = document.getElementsByClassName(className);
    [].forEach.call(list, (element, index) => {
        if (index % total == i) {
            element.className = `${className} active`;
        } else {
            element.className = `${className}`;
        }
    });
}