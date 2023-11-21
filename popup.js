let isActive = false;

if (document.getElementById("active")) {

  document.getElementById("active").addEventListener("click", function () {
    isActive = !isActive;
    document.getElementById("status").textContent = isActive ? "Active" : "Inactive";
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
      // Remplacer l'URL de la page par celle de la vidéo
      chrome.tabs.update(tab.id, { url: videoUrl });
    }
  }
}
