import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Cpu, Play } from 'lucide-react';

interface AgentTerminalProps {
  cityId: string;
  cityName: string;
  selectedWardName: string;
  selectedWardId: string;
  onTriggerEnforcement: (actionType: string) => void;
}

interface LogLine {
  agentName: 'System' | 'Attribution Agent' | 'Forecasting Agent' | 'Enforcement Agent';
  text: string;
  timestamp: string;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  cityName,
  selectedWardName,
  onTriggerEnforcement,
}) => {
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState<LogLine[]>([
    {
      agentName: 'System',
      text: 'AeroVardhan Agent Mesh initialized. 3 active nodes listening: [Attribution], [Forecasting], [Enforcement].',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      agentName: 'Attribution Agent',
      text: `Scanning spatiotemporal profiles for ${selectedWardName}, ${cityName}. Cross-referencing traffic counts and thermal data.`,
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      agentName: 'Forecasting Agent',
      text: `Atmospheric boundary layer height calculated at 450m. Checking dispersion index.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isTyping]);

  const addLog = (agentName: LogLine['agentName'], text: string) => {
    setLogs((prev) => [
      ...prev,
      {
        agentName,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const simulateAgentConversation = async (userPrompt: string) => {
    setIsTyping(true);
    const query = userPrompt.toLowerCase();
    
    // Step 1: Attribution Agent reasoning
    await new Promise((r) => setTimeout(r, 1200));
    if (query.includes('stubble') || query.includes('fire') || query.includes('delhi')) {
      addLog(
        'Attribution Agent',
        `[ATTRIBUTION] ALERT: Thermal anomaly flagged in outer grid of Dwarka (coordinates 28.6010, 77.0305). FRP reading: 48 MW. Stubble fire confirmed. Secondary emissions tracking: Wind (290° WNW) dispersion is pushing smoke plume toward central zones at 8km/h.`
      );
    } else if (query.includes('traffic') || query.includes('silk board') || query.includes('bengaluru')) {
      addLog(
        'Attribution Agent',
        `[ATTRIBUTION] Hotspot attributed: Central Silk Board traffic bottleneck. Congestion density index: 9.8/10. Particulate signature matches heavy diesel exhausts (NOx levels elevated at 58µg/m³). Primary local attribution: Mobile Vehicular (68%).`
      );
    } else if (query.includes('industrial') || query.includes('factory') || query.includes('chembur') || query.includes('ennore')) {
      addLog(
        'Attribution Agent',
        `[ATTRIBUTION] Spectral scan complete for industrial grid cells. Stack emissions detected at coordinates near Ennore thermal corridor. SO2 dominant peak at 45µg/m³. Confidence score: 94%.`
      );
    } else {
      addLog(
        'Attribution Agent',
        `[ATTRIBUTION] Analysing ${selectedWardName} grid cells. PM2.5 baseline is elevated. Attribution matrices report construction dust (28%) and heavy vehicle exhausts (45%) as primary local pollution vectors in this sector.`
      );
    }

    // Step 2: Forecasting Agent reasoning
    await new Promise((r) => setTimeout(r, 1400));
    if (query.includes('stubble') || query.includes('fire') || query.includes('delhi')) {
      addLog(
        'Forecasting Agent',
        `[FORECAST] Plume dispersion model run: Boundary layer compression (mixing height dropping to 350m overnight) will trap smoke particles. Hyperlocal forecast predicts a 24% AQI spike (AQI > 340) in Dwarka and Anand Vihar over the next 18 hours.`
      );
    } else if (query.includes('traffic') || query.includes('silk board') || query.includes('bengaluru')) {
      addLog(
        'Forecasting Agent',
        `[FORECAST] Night-time temperature inversion predicted. Low wind speed (5km/h) from the East will keep vehicular emissions trapped directly above the Silk Board flyover grid. Hyperlocal AQI forecasted to hit 210 between 08:00 - 11:00 AM tomorrow.`
      );
    } else {
      addLog(
        'Forecasting Agent',
        `[FORECAST] Grid forecast updated. 1km resolution predictive dispersion shows standard diurnal breathing pattern. Expected morning peak at 09:00 AM matching commuting hours, followed by solar mixing height expansion clearing boundary layers by 02:00 PM.`
      );
    }

    // Step 3: Enforcement Agent reasoning
    await new Promise((r) => setTimeout(r, 1500));
    setIsTyping(false);
    if (query.includes('stubble') || query.includes('fire') || query.includes('delhi')) {
      addLog(
        'Enforcement Agent',
        `[ENFORCEMENT] DECISION: Immediate intervention recommended. Dispatching agricultural drone squad to spray bio-decomposers at agricultural grids. Recommending stubble burning sub-metering audit in surrounding rural grids.`
      );
      // Trigger actual action callback
      onTriggerEnforcement('Stubble Burn Subsidies');
    } else if (query.includes('traffic') || query.includes('silk board') || query.includes('bengaluru')) {
      addLog(
        'Enforcement Agent',
        `[ENFORCEMENT] DECISION: Dispatching dynamic signals request. Coordinating with traffic control room to implement heavy vehicle diversion grids on Outer Ring Road from 07:00 to 11:00 AM. Activating municipal mechanical sweeping unit.`
      );
      onTriggerEnforcement('Traffic Restrictions (Odd-Even)');
    } else if (query.includes('dust') || query.includes('construction') || query.includes('whitefield') || query.includes('kurla')) {
      addLog(
        'Enforcement Agent',
        `[ENFORCEMENT] DECISION: Dust control intervention. Deploying water sprinklers to Silk Board/Kurla/Whitefield grids. Smog gun scheduled at active metro line construction coordinates.`
      );
      onTriggerEnforcement('Water Sprinklers');
    } else {
      addLog(
        'Enforcement Agent',
        `[ENFORCEMENT] Dispatch recommendation: Triggering localized water sprinkler units and construction dust inspection alerts at selected ward coordinates.`
      );
      onTriggerEnforcement('Water Sprinklers');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    addLog('System', `User Query: "${userPrompt}"`);
    setPrompt('');
    simulateAgentConversation(userPrompt);
  };

  return (
    <div className="glass-card flex-1 flex flex-col gap-3 min-h-[300px]">
      <div className="card-title">
        <span>
          <Terminal size={16} className="text-cyan-400" />
          Agent Reasoning Terminal
        </span>
        <span className="text-[10px] text-gray-500 font-mono">3 Active Nodes</span>
      </div>

      <div className="agent-terminal flex-1 overflow-y-auto flex flex-col gap-2 p-3 font-mono bg-black/60 rounded-md border border-slate-900 min-h-[180px]">
        <div className="terminal-header">
          <span>AeroVardhan Multi-Agent Core v2.4</span>
          <span>ONLINE</span>
        </div>
        {logs.map((log, index) => {
          let agentColorClass = 'text-green-500';
          if (log.agentName === 'Attribution Agent') agentColorClass = 'agent-attribution';
          if (log.agentName === 'Forecasting Agent') agentColorClass = 'agent-forecast';
          if (log.agentName === 'Enforcement Agent') agentColorClass = 'agent-enforcement';
          if (log.agentName === 'System') agentColorClass = 'text-gray-400 font-semibold';

          return (
            <div key={index} className="agent-log-line text-[11px] leading-relaxed">
              <span className="text-gray-600 text-[10px] mr-1">[{log.timestamp}]</span>
              {log.agentName !== 'System' && (
                <span className={`agent-name ${agentColorClass} mr-1`}>{log.agentName}:</span>
              )}
              <span className={log.agentName === 'System' ? 'text-gray-400' : 'text-slate-300'}>
                {log.text}
              </span>
            </div>
          );
        })}
        {isTyping && (
          <div className="text-[11px] text-cyan-400 font-bold animate-pulse flex items-center gap-2">
            <Cpu size={12} className="animate-spin" />
            Agents are analyzing and negotiating intervention plans...
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleSend} className="prompt-area mt-1">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Agents: 'Dispatch water sweepers' or 'Check stubble fires'..."
          className="prompt-input px-3 py-2 text-xs"
        />
        <button type="submit" className="prompt-btn bg-cyan-500 hover:bg-cyan-600 text-black p-2 rounded-md">
          <Send size={14} />
        </button>
      </form>

      <div className="flex gap-2 justify-between flex-wrap text-[10px] text-gray-500">
        <span className="font-semibold">Quick simulation prompts:</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => simulateAgentConversation('Check stubble fires in Delhi')}
            className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <Play size={8} /> Stubble Plume
          </button>
          <button
            type="button"
            onClick={() => simulateAgentConversation('Check Silk Board traffic density')}
            className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <Play size={8} /> Traffic Exhaust
          </button>
        </div>
      </div>
    </div>
  );
};
