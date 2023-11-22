let isActive = false;
let newTab = false;

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['isActive'], function (result) {
    isActive = result.isActive || false;
    document.getElementById('status').textContent = isActive ? "Active" : "Inactive";
    document.getElementById('active').checked = isActive;
  });

  chrome.storage.local.get(['newTab'], function (result) {
    newTab = result.newTab || false;
    document.getElementById('tabs-status').textContent = newTab ? "New tab" : "Same tab";
    document.getElementById('tabs-status').checked = newTab;

  });
});

if (document.getElementById("active")) {

  document.getElementById("active").addEventListener("click", function () {
    isActive = !isActive;
    document.getElementById("status").textContent = isActive ? "Active" : "Inactive";
    chrome.storage.local.set({ 'isActive': isActive });

  });
}

if (document.getElementById("newtabs")) {
  document.getElementById("newtabs").addEventListener("click", function () {
    newTab = !newTab;
    document.getElementById("tabs-status").textContent = newTab ? "New tab" : "Same tab";
    chrome.storage.local.set({ 'newTab': newTab });
  });
}

// Écouter la création de nouveaux onglets
chrome.tabs.onCreated.addListener(function (tab) {
  checkYoutubeAndAct(tab);
});

// Écouter la mise à jour des onglets
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Vérifier si l'URL a changé
  if (changeInfo.url) {
    checkYoutubeAndAct(tab);
  }
});

function checkYoutubeAndAct(tab) {
  // Exécuter la logique uniquement si l'extension est active
  if (isActive && tab.url && tab.url.includes("youtube.com")) {
    console.log("Switch is active on YouTube");
    // Regarde si sur une vidéo
    if (tab.url.includes("watch")) {
      // Récupérer l'ID de la vidéo
      const videoId = tab.url.split("v=")[1].split("&")[0];
      // Récupérer l'URL de la vidéo
      const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      if (newTab) {
        console.log("New tab");
        // Créer un nouvel onglet
        chrome.tabs.create({ url: videoUrl });
        // Et retourner sur l'onglet précédent
        chrome.tabs.update(tab.id, { url: "https://www.youtube.com/" });
      } else {
        console.log("Same tab");
        // Remplacer l'URL de la page par celle de la vidéo
        chrome.tabs.update(tab.id, { url: videoUrl });
      }
    }
  }
}
