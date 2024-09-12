const form = document.getElementById("form");
const ayahText = document.getElementById("ayah-text");
const ayahCard = document.getElementById("ayah-card");
const paddingSlider = document.getElementById("padding-slider");
const widthSlider = document.getElementById("width-slider");
const fontSlider = document.getElementById("font-slider");
const lineHeightSlider = document.getElementById("line-height-slider");
const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", async () => {
  // creating image of ayahCard
  const ayahCardImage = await html2canvas(ayahCard);

  // creating a link to download the image
  const link = document.createElement("a");
  link.download = "ayah.png";
  link.href = ayahCardImage.toDataURL("image/png");
  link.click();
});

paddingSlider.addEventListener("input", (e) => {
  ayahCard.style.padding = `${e.target.value}px`;
});

widthSlider.addEventListener("input", (e) => {
  ayahCard.style.width = `${e.target.value}px`;
});

fontSlider.addEventListener("input", (e) => {
  ayahText.style.fontSize = `${e.target.value}px`;
});

lineHeightSlider.addEventListener("input", (e) => {
  ayahText.style.lineHeight = `${e.target.value}`;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const surah = document.getElementById("surah").value;
  const ayah = document.getElementById("ayah").value;

  const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`;
  const response = await fetch(url);
  const data = await response.json();

  if(response.status !== 200) {
    alert("Something went wrong");
    return;
  }

  ayahText.innerText = data.data.text;

});