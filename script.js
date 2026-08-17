document.getElementById("last-updated").textContent = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

/*
  GALLERY
  -------
  To add a photo:
  1. Upload the image file to a folder named "photos" in this repository
     (create the folder if it does not exist yet).
  2. Add a line below with the file name and the label (caption) you want
     shown under it.
  Example:
  { file: "photos/conference.jpg", label: "ICTS Summer School, 2023" },
*/
const galleryPhotos = [
  // { file: "photos/example.jpg", label: "Example caption" },
];

var galleryContent = document.getElementById("gallery-content");

if (galleryContent) {
  if (galleryPhotos.length === 0) {
    galleryContent.textContent = "No photos added yet.";
  } else {
    galleryPhotos.forEach(function (photo) {
      var item = document.createElement("figure");
      item.className = "gallery-item";

      var img = document.createElement("img");
      img.src = photo.file;
      img.alt = photo.label || "";

      var caption = document.createElement("figcaption");
      caption.className = "gallery-caption";
      caption.textContent = photo.label || "";

      item.appendChild(img);
      item.appendChild(caption);
      galleryContent.appendChild(item);
    });
  }
}

var galleryToggle = document.getElementById("gallery-toggle");

if (galleryToggle && galleryContent) {
  galleryToggle.addEventListener("click", function () {
    var isHidden = galleryContent.hasAttribute("hidden");
    if (isHidden) {
      galleryContent.removeAttribute("hidden");
      galleryToggle.textContent = "Hide Gallery";
    } else {
      galleryContent.setAttribute("hidden", "");
      galleryToggle.textContent = "Show Gallery";
    }
  });
}
