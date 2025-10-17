'use client';

import React from 'react';

const EpistemicTopologySimulation = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br 
from-blue-900 via-purple-900 to-indigo-900 rounded-lg shadow-2xl border border-purple-500/20">                                              <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Simulação Interativa
        </h3>
        <p className="text-purple-200 mb-6">
          Visualização em tempo real da propagação de conhecimento 
no espaço-tempo                                                            </p>
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentCo
lor" viewBox="0 0 20 20">                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0
 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />                                  </svg>
          </div>
          <p className="text-gray-300">
            Simulação em desenvolvimento - Em breve disponível
          </p>
        </div>
      </div>
    </div>
  );
};

export default EpistemicTopologySimulation;