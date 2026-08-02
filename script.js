document.getElementById("last-updated").textContent = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
});
