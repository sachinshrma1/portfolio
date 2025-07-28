const gallery = document.getElementById("gallery");

const supportedExtensions = {
  image: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  video: [".mp4", ".webm", ".ogg"]
};

// Shuffle array items randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ✅ Fetch media file names from media-list.json (STATIC)
async function fetchMedia() {
  try {
    const response = await fetch("media-list.json");
    const files = await response.json();
    return files.filter(name =>
      supportedExtensions.image.concat(supportedExtensions.video).some(ext =>
        name.toLowerCase().endsWith(ext)
      )
    );
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}

// Check if file is image or video
function isMediaType(file, type) {
  return supportedExtensions[type].some(ext =>
    file.toLowerCase().endsWith(ext)
  );
}

// Create a media card element
function createMediaElement(file, type) {
  const card = document.createElement("div");
  card.className = "media-card";

  let element;
  if (type === "image") {
    element = document.createElement("img");
  } else if (type === "video") {
    element = document.createElement("video");
    element.controls = true;
  }

  element.src = file; // ✅ file already includes full path (assets/media/...)
  element.alt = file;

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerText = file.split("/").pop().replace(/[-_]/g, " ").replace(/\.[^/.]+$/, "");

  card.appendChild(element);
  card.appendChild(caption);
  card.setAttribute("data-type", type);

  return card;
}

// Filter and load gallery by type (shuffled)
async function filterMedia(type) {
  gallery.innerHTML = "";
  const files = await fetchMedia();
  const filteredFiles = shuffleArray(
    files.filter(file => isMediaType(file, type))
  );
  filteredFiles.forEach(file => {
    const card = createMediaElement(file, type);
    gallery.appendChild(card);
  });
}

// Initial load — only images by default
window.onload = () => {
  filterMedia("image");
};

// Lightbox logic
document.addEventListener("DOMContentLoaded", () => {
  gallery.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "IMG" || target.tagName === "VIDEO") {
      const clone = target.cloneNode(true);
      if (clone.tagName === "VIDEO") {
        clone.setAttribute("controls", true);
        clone.autoplay = true;
        clone.loop = true;
      }
      const lightboxContent = document.getElementById("lightbox-content");
      lightboxContent.innerHTML = "";
      lightboxContent.appendChild(clone);
      document.getElementById("lightbox").classList.remove("hidden");
    }
  });

  // Allow Escape key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}
