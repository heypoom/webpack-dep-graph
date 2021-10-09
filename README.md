# Webpack Dependency Graph Visualizer

> This project is under development. Please use with care.

This tool visualizes the module dependency graph from Webpack's `stats.json` file.

It analyzes the dependency tree and generates a graphic for visualization.

## Use cases

- Detect a circular dependency in a large monorepo project.
- Figure out where the module is being used, imported and exported from.
- Analyze why webpack cannot tree-shake a particular module or dependency from the chunk.

## Web Usage (WIP)

Dropping your stats.json into https://webpack-graph.vercel.app will render the visualization.

## Command Line Usage (WIP)

Running `webpack-dep-graph` without any arguments will start the command line in an interactive mode.

- Generates a DOT graph: `webpack-dep-graph --dot graph.dot stats.json`
- Generates a text logfile: `webpack-dep-graph --log graph.log stats.json`
- Generates a JSON output: `webpack-dep-graph --json graph.json stats.json`
- Starts the interactive visualizer locally: `webpack-dep-graph --web stats.json`

## Prior Work

- https://github.com/g0t4/webpack-stats-graph (Unmaintained)
- https://github.com/pahen/madge

