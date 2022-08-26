// import fs from "fs"
import cytoscape from "cytoscape";
var elements = [];
var cyStyle = [
    {
        selector: "node",
        style: {
            "background-color": "#111",
            label: "data(id)",
            color: "#b8e994",
            "border-color": "#b8e994",
            "border-width": "2",
            "text-valign": "center",
            "text-halign": "center",
        },
    },
    {
        selector: "edge",
        style: {
            width: "2",
            "line-color": "#757575",
            "target-arrow-color": "#757575",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
        },
    },
];
function draw() {
    var fileName = "cytoscape.json";
    // const statString = fs.readFileSync(fileName, "utf-8")
    // const elements: { data: NodeDataDefinition | EdgeDataDefinition }[] =
    // JSON.parse(statString)
    // console.log(`\n------- loading ${statFileName} ------\n`)
    var container = document.querySelector(".app-view");
    if (fileName) {
        var cy = cytoscape({
            elements: elements,
            container: container,
            hideEdgesOnViewport: true,
            textureOnViewport: true,
            motionBlur: true,
            style: cyStyle,
        });
    }
}
function openFile() {
    var file = null;
    var MAX_FILE_SIZE_BYTES = 1000 * 1000 * 10; // 10M
    var content = null;
    var fileReader = new FileReader();
    var inputFileDOMElem = document.querySelector('#inputFileDOMElem');
    console.log('file open');
    if (inputFileDOMElem.files instanceof Array &&
        inputFileDOMElem.files.length > 0) {
        // file selected
        file = inputFileDOMElem.files[0];
    }
    if (file instanceof File &&
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
        ["text/json"].includes(file.type) &&
        file.size <= MAX_FILE_SIZE_BYTES) {
        // get content
        fileReader.onload = function (e) {
            var _a;
            content = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.result;
            console.log("file content", content);
        };
        // fire content reading
        fileReader.readAsText(file);
        // fileReader.readAsArrayBuffer(file)
    }
    else {
        console.log("wrong file");
    }
}
