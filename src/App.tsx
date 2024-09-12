import { useRef, useState } from "react";
import { useScreenshot } from 'use-react-screenshot'


const ASPECT_RATIO = ["POST", "STORY"];

function App() {
  const [surah, setSurah] = useState("1");
  const [ayah, setAyah] = useState("");

  const [aspectRatioType, setAspectRatioType] = useState("POST");

  const [fontSize, setFontSize] = useState(16);

  const [ayahText, setAyahText] = useState("");

  const [_, takeScreenshot] = useScreenshot()

  const ref = useRef(null);

  const aspectRatioNum = aspectRatioType === "POST" ? 1 : 9 / 16;

  async function loadAyah() {
    const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      alert("Something went wrong");
      return;
    }

    setAyahText(data.data.text);
  }

  return (
    <div className="container mx-auto flex max-w-lg min-w-lg flex-col items-center gap-4 py-4">
      <select
        value={surah}
        onChange={(e) => setSurah(e.target.value)}
        className="border-2 border-gray-400 rounded-lg p-2 w-full"
      >
        {Array.from({ length: 114 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Surah {i + 1}
          </option>
        ))}
      </select>

      <input
        type="number"
        id="ayah"
        value={ayah}
        onChange={(e) => setAyah(e.target.value)}
        required
        placeholder="Enter Ayah Number"
        min="1"
        max="286"
        name="ayah"
        className="border-2 border-gray-400 rounded-lg p-2 w-full"
      />

      <button
        onClick={loadAyah}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded px-16"
      >
        Load
      </button>

      <div className="flex justify-center gap-2">
        {ASPECT_RATIO.map((type) => (
          <button
            key={type}
            onClick={() => setAspectRatioType(type)}
            className={`${
              aspectRatioType === type
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-gray-400 hover:bg-gray-500"
            } text-white font-bold py-2 rounded px-16`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <label htmlFor="font" className="text-xl">
          Font Size
        </label>
        <input
          type="range"
          min="8"
          max="100"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          id="font-slider"
          name="font"
          className="w-full"
        />
      </div>

      <div
        ref={ref}
        style={{
          aspectRatio: aspectRatioNum,
          fontSize: `${fontSize}px`,
          width: "100%",
        }}
        className="aspect-square text-center font-indopak text-white overflow-clip bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center"
      >
        {ayahText}
      </div>

      <button
        onClick={() => {
          takeScreenshot(ref.current).then((image: any) => {
            const link = document.createElement("a");
            link.href = image;
            link.download = "ayah.png";
            link.click();
          })
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded px-16"
      >
        Download Image
      </button>
    </div>
  );
}

export default App;
