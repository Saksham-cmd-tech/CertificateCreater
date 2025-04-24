import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import certificateBg from "./assets/Certificate.png";
import "./App.css";

function App() {
  const certRef = useRef();
  const [names, setNames] = useState([]);
  const [index, setIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchUrn, setSearchUrn] = useState("");
  const [customBg, setCustomBg] = useState(null);
  const [nameFontSize, setNameFontSize] = useState(30);
  const [urnFontSize, setUrnFontSize] = useState(16);
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(700);
  const [namePosition, setNamePosition] = useState({ x: 500, y: 350 }); // center x
  const [urnPosition, setUrnPosition] = useState({ x: 500, y: 640 });  // center x

  const currentName = names[index]?.name || "No more names";
  const currentTeam = names[index]?.team || "No more teams";
  const currentURN = names[index]?.urn || "No more uid";

  const nextName = () => {
    if (index < names.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomBg(imageUrl);
    }
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          setNames(parsed);
          setIndex(0);
        } else {
          alert("Invalid JSON format. Expected an array of objects.");
        }
      } catch (err) {
        alert("Failed to parse JSON.");
      }
    };
    reader.readAsText(file);
  };

  const renderCertificate = (name, team, urn) => {
    return new Promise((resolve) => {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "-9999px";
      tempDiv.className = "certificate";
      tempDiv.style.width = `${canvasWidth}px`;
      tempDiv.style.height = `${canvasHeight}px`;
      tempDiv.style.backgroundImage = `url(${customBg || certificateBg})`;
      tempDiv.style.backgroundSize = "cover";
      tempDiv.style.backgroundPosition = "center";

      const h1 = document.createElement("h1");
      h1.className = "name";
      h1.innerText = `${name} (${team})`;
      Object.assign(h1.style, {
        position: "absolute",
        top: `${namePosition.y}px`,
        left: `${namePosition.x}px`,
        transform: "translate(-50%, -50%)",
        fontSize: `${nameFontSize}px`,
        fontWeight: "bold",
        color: "#000",
        whiteSpace: "nowrap",
        textAlign: "center"
      });

      const p = document.createElement("p");
      p.className = "urn";
      p.innerText = urn;
      Object.assign(p.style, {
        position: "absolute",
        top: `${urnPosition.y}px`,
        left: `${urnPosition.x}px`,
        transform: "translate(-50%, -50%)",
        fontSize: `${urnFontSize}px`,
        fontWeight: "bold",
        color: "#000",
        whiteSpace: "nowrap",
        textAlign: "center"
      });

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
    if (!names.length) return alert("No names loaded.");
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
          const name = currentName.replace(/[\\/:*?"<>|]/g, "_");
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
      <div
        className="certificate"
        ref={certRef}
        style={{
          backgroundImage: `url(${customBg || certificateBg})`,
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          position: "relative"
        }}
      >
        <h1
          className="name"
          style={{
            position: "absolute",
            top: `${namePosition.y}px`,
            left: `${namePosition.x}px`,
            transform: "translate(-50%, -50%)",
            fontSize: `${nameFontSize}px`,
            fontWeight: "bold",
            color: "#000",
            whiteSpace: "nowrap",
            textAlign: "center"
          }}
        >
          {currentName} ({currentTeam})
        </h1>
        <p
          className="urn"
          style={{
            position: "absolute",
            top: `${urnPosition.y}px`,
            left: `${urnPosition.x}px`,
            transform: "translate(-50%, -50%)",
            fontSize: `${urnFontSize}px`,
            fontWeight: "bold",
            color: "#000",
            whiteSpace: "nowrap",
            textAlign: "center"
          }}
        >
          {currentURN}
        </p>
      </div>

      <div className="controls-container">
        <div className="upload-bg">
          <label>Upload Certificate Background:</label>
          <input type="file" accept="image/*" onChange={handleBackgroundChange} />
        </div>

        <div className="upload-json">
          <label>Upload Names JSON:</label>
          <input type="file" accept=".json" onChange={handleJsonUpload} />
        </div>

        <div className="font-controls">
          <label>
            Name Font Size:
            <input
              type="number"
              min="10"
              max="100"
              value={nameFontSize}
              onChange={(e) => setNameFontSize(parseInt(e.target.value))}
            />
          </label>

          <label>
            URN Font Size:
            <input
              type="number"
              min="10"
              max="50"
              value={urnFontSize}
              onChange={(e) => setUrnFontSize(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div className="position-controls">
          <label>
            Name X Position:
            <input
              type="number"
              value={namePosition.x}
              onChange={(e) =>
                setNamePosition({ ...namePosition, x: parseInt(e.target.value) })
              }
            />
          </label>

          <label>
            Name Y Position:
            <input
              type="number"
              value={namePosition.y}
              onChange={(e) =>
                setNamePosition({ ...namePosition, y: parseInt(e.target.value) })
              }
            />
          </label>

          <label>
            URN X Position:
            <input
              type="number"
              value={urnPosition.x}
              onChange={(e) =>
                setUrnPosition({ ...urnPosition, x: parseInt(e.target.value) })
              }
            />
          </label>

          <label>
            URN Y Position:
            <input
              type="number"
              value={urnPosition.y}
              onChange={(e) =>
                setUrnPosition({ ...urnPosition, y: parseInt(e.target.value) })
              }
            />
          </label>
        </div>

        <div className="buttons">
          <button onClick={handleSingleDownload}>Download Current Certificate</button>
          <button onClick={handleBulkDownload} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Download All as ZIP"}
          </button>
          <button onClick={nextName}>Next Name</button>
        </div>
      </div>
    </div>
  );
}

export default App;
