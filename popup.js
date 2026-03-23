const tabsList = document.getElementById("tabsList");


const favorites = ["youtube.com", "google.com"];

function renderTabs() {
    chrome.tabs.query({}, function(tabs) {
        tabsList.innerHTML = ""; 

        const grouped = {};
        tabs.forEach(tab => {
            if(!tab.url) return; 
            let domain;
            try {
                domain = new URL(tab.url).hostname;
            } catch(e) {
                domain = "unknown";
            }
            if(!grouped[domain]) grouped[domain] = [];
            grouped[domain].push(tab);
        });

        for(const domain in grouped){
            const div = document.createElement("div");
            div.classList.add("tab-group"); 
            if(favorites.includes(domain)) div.classList.add("favorite");

            div.innerHTML = `<strong>${domain}:</strong> ${grouped[domain].length} tab(s) 
                <button class="closeBtn">Close All</button> 
                <button class="pinBtn">Pin/Unpin All</button>`;

           
            div.querySelector(".closeBtn").addEventListener("click", () => {
                grouped[domain].forEach(tab => chrome.tabs.remove(tab.id));
            });

            
            div.querySelector(".pinBtn").addEventListener("click", () => {
                grouped[domain].forEach(tab => chrome.tabs.update(tab.id, { pinned: !tab.pinned }));
            });

            tabsList.appendChild(div);
        }
    });
}


renderTabs();

setInterval(renderTabs, 5000);