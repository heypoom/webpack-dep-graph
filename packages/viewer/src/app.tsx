import type { ElementDefinition, Stylesheet } from "cytoscape"

import CytoscapeComponent from "react-cytoscapejs"

import { Analyzer } from "@analyzer"

const node = (id: string): ElementDefinition => ({ data: { id } })

const edge = (source: string, target: string): ElementDefinition => ({
  data: { source, target },
})

const elements: ElementDefinition[] = []

const stylesheet: Stylesheet[] = [
  {
    selector: "node",
    style: {
      "background-color": "#111",
      label: "data(id)",
      color: "#b8e994",
      "border-color": "#b8e994",
      "border-width": 2,
      "font-weight": 400,
      "text-valign": "center",
      "text-halign": "center",
    },
  },

  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#757575",
      "target-arrow-color": "#757575",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
]

const analyzer = new Analyzer({ modules: [] })
console.log(analyzer)

export function App() {
  return (
    <div style={{ background: "#111" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300,400&display=swap"
          rel="stylesheet"
        />
      </head>

      <CytoscapeComponent
        layout={{ name: "breadthfirst" }}
        stylesheet={stylesheet}
        elements={elements}
        style={{ width: "100vw", height: "100vh" }}
        hideEdgesOnViewport
        textureOnViewport
        motionBlur
      />
    </div>
  )
}
