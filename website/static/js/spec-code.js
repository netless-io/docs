const platformList = ["web", "ios", "android"];

window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    let order = platformList.indexOf(platform ? platform.toLowerCase() : "");

    if (platform && order != -1) {
        updateStorage(platform);
        updateCodeTab(platform, order);
    } else {
        const localPlatform = localStorage.getItem("platform");
        if (localPlatform) {
            updateCodeTab(localPlatform, platformList.indexOf(localPlatform));
        }
    }
});

function updateStorage(platform) {
    localStorage.setItem("platform", platform.toLowerCase());
}

function updateCodeTab(platform, order) {
    changeTabActive(platform.toLowerCase(), "nav-link");
    changePanActive("tab-pane", order);
}

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

function changePanActive(className, order, total=platformList.length) {
    const list = document.getElementsByClassName(className);
    [].forEach.call(list, (element, index) => {
        if (index % total == order % total) {
            element.classList.add("active");
        } else {
            element.classList.remove("active");
        }
    });
}

window.addEventListener('load', function() {
    // add event listener for all tab
    document.querySelectorAll('.nav-link').forEach(function(el) {
      el.addEventListener('click', function(e) {
        const groupId = e.target.getAttribute('id');
        const result = groupId.match(/([\d]+)/g);
        if (result && result.length >= 2) {
            const order = parseInt(result[1]) - parseInt(result[0]) - 1;
            updateCodeTab(platformList[order], order)
            updateStorage(platformList[order]);
        }
      });
    });
  });