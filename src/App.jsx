import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import names from "./names.json";
import certificateBg from "./assets/Certificate.png";
import "./App.css";

function App() {
  const certRef = useRef();
  const [index, setIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchUrn, setSearchUrn] = useState("");

  const currentName = names[index]?.name || "No more names";
  const currentTeam = names[index]?.team || "No more teams";
  const currentURN = names[index]?.urn || "No more urn";

  const nextName = () => {
    if (index < names.length - 1) {
      setIndex(index + 1);
    }
  };

  const renderCertificate = (name, team, urn) => {
    return new Promise((resolve) => {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "-9999px";
      tempDiv.className = "certificate";
      tempDiv.style.backgroundImage = `url(${certificateBg})`;

      const h1 = document.createElement("h1");
      h1.className = "name";
      h1.innerText = `${name} (${team})`;

      const p = document.createElement("p");
      p.className = "urn";
      p.innerText = urn;

      tempDiv.appendChild(h1);
      tempDiv.appendChild(p);
      document.body.appendChild(tempDiv);

      html2canvas(tempDiv).then((canvas) => {
        document.body.removeChild(tempDiv);
        canvas.toBlob((blob) => {
          resolve({ blob, filename: `${name}.png` });
        });
      });
    });
  };

  const handleBulkDownload = async () => {
    setIsGenerating(true);
    const zip = new JSZip();

    for (const { name, team, urn } of names) {
      const { blob, filename } = await renderCertificate(name, team, urn);
      zip.file(filename, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "certificates.zip");
    setIsGenerating(false);
  };

  const handleSingleDownload = () => {
    const element = certRef.current;
    if (!element) return;

    html2canvas(element).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const name = currentName.replace(/[\\/:*?"<>|]/g, "_"); // Sanitize filename
          saveAs(blob, `${name}.png`);
        }
      });
    });
  };

  const handleSearch = () => {
    const foundIndex = names.findIndex((n) => n.urn === searchUrn.trim());
    if (foundIndex !== -1) {
      setIndex(foundIndex);
    } else {
      alert("URN not found");
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          type="text"
          placeholder="Enter URN"
          value={searchUrn}
          onChange={(e) => setSearchUrn(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div
        className="certificate"
        ref={certRef}
        style={{ backgroundImage: `url(${certificateBg})` }}
      >
        <h1 className="name">{currentName} ({currentTeam})</h1>
        <p className="urn">{currentURN}</p>
      </div>

      <div className="buttons">
        <button onClick={handleSingleDownload}>Download Current Certificate</button>
        <button onClick={handleBulkDownload} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Download All as ZIP"}
        </button>
        <button onClick={nextName}>Next Name</button>
      </div>
    </div>
  );
}

export default App;
