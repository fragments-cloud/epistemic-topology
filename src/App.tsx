import React from 'react'
import EpistemicTopologySimulation from './epistemic_topology_sim.tsx'
import EpistemicDataAnalysis from './epistemic_data_analysis.tsx'

function App() {
  return (
    <div className="App">
      <h1>Epistemic Topology</h1>
      <EpistemicTopologySimulation />
      <EpistemicDataAnalysis />
    </div>
  )
}

export default App