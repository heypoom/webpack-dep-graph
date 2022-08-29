export interface IGraphmlNode {
	key: string
	label: string
	x: number
	y: number
	height: number
	weight: number
}

export const GRAPHML_HODE_DEFAULT: IGraphmlNode = {
	key: "n0",
	label: "",
	x: 10,
	y: 10,
	height: 30,
	weight: 30,
}

export interface IGraphmlEdge {
	id: string
	sourceKey: string
	targetKey: string
	label: string
}

export const GRAPHML_EDGE_DEFAULT: IGraphmlEdge = {
	id: "e0",
	sourceKey: "n0",
	targetKey: "n0",
	label: "",
}

export const GRAPHML_HEADER = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:java="http://www.yworks.com/xml/yfiles-common/1.0/java" xmlns:sys="http://www.yworks.com/xml/yfiles-common/markup/primitives/2.0" xmlns:x="http://www.yworks.com/xml/yfiles-common/markup/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xmlns:yed="http://www.yworks.com/xml/yed/3" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
    <!--Created by yEd 3.22-->
    <key attr.name="Description" attr.type="string" for="graph" id="d0"/>
    <key for="port" id="d1" yfiles.type="portgraphics"/>
    <key for="port" id="d2" yfiles.type="portgeometry"/>
    <key for="port" id="d3" yfiles.type="portuserdata"/>
    <key attr.name="url" attr.type="string" for="node" id="d4"/>
    <key attr.name="description" attr.type="string" for="node" id="d5"/>
    <key for="node" id="d6" yfiles.type="nodegraphics"/>
    <key for="graphml" id="d7" yfiles.type="resources"/>
    <key attr.name="url" attr.type="string" for="edge" id="d8"/>
    <key attr.name="description" attr.type="string" for="edge" id="d9"/>
    <key for="edge" id="d10" yfiles.type="edgegraphics"/>
    <graph edgedefault="directed" id="G">
        <data key="d0"/>
`

export const GRAPHML_FOOTER = `
    </graph>
    <data key="d7">
        <y:Resources/>
    </data>
</graphml>
`

