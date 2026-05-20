import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  HardDrive, 
  MessageSquare, 
  ThumbsUp, 
  Zap, 
  Clock, 
  Code, 
  Settings, 
  Search, 
  ChevronRight,
  Database,
  Share2
} from 'lucide-react';

// --- MOCK DATA ---
const PARTS_DATA = [
  {
    id: "mc4000",
    name: "MC4000 Microcontroller",
    category: "Microcontrollers",
    cost: "¥3",
    power: "Low",
    icon: <Cpu size={24} className="text-emerald-400" />,
    datasheet: "The MC4000 is a low-cost, highly constrained programmable microcontroller. It forms the backbone of cost-optimized circuitry in most basic and intermediate consumer electronics.",
    specs: [
      { label: "Lines of Code", value: "9 Lines" },
      { label: "Registers", value: "acc, dat" },
      { label: "Simple I/O Pins", value: "2 (p0, p1)" },
      { label: "XBus Pins", value: "2 (x0, x1)" },
      { label: "Sleep Mode (slp)", value: "Supported" }
    ],
    technicalAnalysis: "Due to the extreme 9-line limitation, complex algorithms must often be distributed across multiple MC4000 units. XBus synchronization is critical here; a blocked read on x0 will halt the entire processor. This saves power, but can potentially deadlock the circuit if the downstream component never writes.",
    forumThreads: [
      {
        id: 101,
        title: "Squeezing 10 lines of logic into the MC4000?",
        author: "byte_me_88",
        reputation: 34,
        time: "2016-11-18 14:22",
        content: "I'm one line short for my PWM generator assignment. Is there any undocumented trick to get a 10th instruction in there?",
        replies: [
          {
            author: "ShenzhenVeteran",
            reputation: 1420,
            time: "2016-11-18 15:01",
            content: "No extra lines, but you can save lines using conditional execution instead of jumps. Instead of `teq acc 10` followed by `+ jmp reset`, try doing math in place or using `+ mov 0 acc` directly. You save the jump instruction entirely."
          },
          {
            author: "xBusHater",
            reputation: 211,
            time: "2016-11-19 09:15",
            content: "Don't forget that if you just need to wait for a state change, blocking on an XBus read doesn't consume active power! Drop the `slp 1` loop if you can rely on an XBus interrupt."
          }
        ]
      },
      {
        id: 102,
        title: "Bug? MC4000 skipping instructions after slp",
        author: "NoobEngineer",
        reputation: 5,
        time: "2017-02-04 11:10",
        content: "My code works perfectly on test run 1, but on test run 2 it completely desyncs. What gives?",
        replies: [
          {
            author: "RTFM_Plz",
            reputation: 899,
            time: "2017-02-04 11:45",
            content: "You aren't resetting your state at the end of the test cycle. If your MC4000 is sleeping (`slp`) when the test finishes, it wakes up in the middle of its execution loop for the next test. Put a `slp` at the END of your loop to sync with the test framework."
          }
        ]
      }
    ]
  },
  {
    id: "mc6000",
    name: "MC6000 Microcontroller",
    category: "Microcontrollers",
    cost: "¥5",
    power: "Medium",
    icon: <Cpu size={24} className="text-purple-400" />,
    datasheet: "The MC6000 is the versatile workhorse of the industry. Offering significantly more code space and I/O pins than the MC4000, it is used for central processing and complex routing.",
    specs: [
      { label: "Lines of Code", value: "14 Lines" },
      { label: "Registers", value: "acc, dat" },
      { label: "Simple I/O Pins", value: "2 (p0, p1)" },
      { label: "XBus Pins", value: "4 (x0, x1, x2, x3)" },
      { label: "Sleep Mode (slp)", value: "Supported" }
    ],
    technicalAnalysis: "The addition of 5 extra lines of code and 2 extra XBus pins allows the MC6000 to act as a primary router or state machine. It is particularly effective when multiplexing data from several sensors. However, at ¥5, overusing them will quickly ruin your cost optimization metrics.",
    forumThreads: [
      {
        id: 201,
        title: "Cycle-perfect P-pin multiplexing using XBus blocking?",
        author: "CycleCounter",
        reputation: 560,
        time: "2018-05-12 16:30",
        content: "I'm trying to reduce cost on a custom Workshop assignment. Can I use a single MC6000 to drive 4 downstream simple I/O lines by rapidly switching state on p0 and relying on XBus blocking to perfectly time the reads?",
        replies: [
          {
            author: "LogicGateKeeper",
            reputation: 1102,
            time: "2018-05-12 17:05",
            content: "Not reliably on bare metal. Simple I/O pins output continuously. If you switch them rapidly, the downstream component might read the wrong state depending on its polling cycle. You need a DX300."
          },
          {
            author: "ZachMaster",
            reputation: 3400,
            time: "2018-05-12 18:22",
            content: "Actually, if you sync the downstream read with a dummy XBus packet, you *can* guarantee the timing. You send a `1` on `x0`, which unblocks the receiver, and *then* the receiver reads the simple pin. It's cycle perfect, but it costs you code space."
          }
        ]
      }
    ]
  },
  {
    id: "dx300",
    name: "DX300 XBus Bridge",
    category: "Logic & Routing",
    cost: "¥1",
    power: "Passive (0 power)",
    icon: <Share2 size={24} className="text-blue-400" />,
    datasheet: "The DX300 provides seamless translation between standard Simple I/O signals and the proprietary XBus protocol. It reads three Simple I/O pins and broadcasts their state as a 3-digit integer over XBus.",
    specs: [
      { label: "Lines of Code", value: "N/A (Hardware)" },
      { label: "Simple I/O Inputs", value: "3 (p0, p1, p2)" },
      { label: "XBus Outputs", value: "1 (x0)" },
      { label: "Conversion Format", value: "p2 * 100 + p1 * 10 + p0" }
    ],
    technicalAnalysis: "The DX300 is a zero-power passive component. Because it draws no active power, it is vastly superior to using an MC4000 to compress three signals into an XBus packet, provided you only need to read the signals and not process them. It updates its XBus output instantaneously when queried.",
    forumThreads: [
      {
        id: 301,
        title: "Is the DX300 actually useful?",
        author: "JuniorDev",
        reputation: 12,
        time: "2019-01-22 09:00",
        content: "I always just use an MC4000 to combine signals. It feels more flexible. Why would I use this?",
        replies: [
          {
            author: "PowerMiser",
            reputation: 844,
            time: "2019-01-22 09:15",
            content: "Three reasons: Cost, Space, and Power. DX300 is ¥1 (MC4000 is ¥3). It takes up 2 grid spaces instead of 4. Most importantly, it uses ZERO power. If you are doing power optimization, you must remove MC4000s and replace them with DX300s + logic gates wherever possible."
          }
        ]
      }
    ]
  },
  {
    id: "ram_200p",
    name: "200P-14 EEPROM",
    category: "Memory",
    cost: "¥4",
    power: "Low",
    icon: <Database size={24} className="text-yellow-400" />,
    datasheet: "The 200P-14 provides 14 addresses of persistent integer storage. It is interfaced entirely via XBus.",
    specs: [
      { label: "Storage Capacity", value: "14 Addresses (0-13)" },
      { label: "Value Range", value: "-999 to 999" },
      { label: "XBus Pins", value: "2 (Data, Address)" },
      { label: "Volatility", value: "Non-Volatile" }
    ],
    technicalAnalysis: "To interact with the RAM, you must first write the target address (0-13) to its Address pin. Subsequent reads/writes to the Data pin will operate on that specific address. A common mistake is forgetting that setting the address takes a full instruction cycle.",
    forumThreads: [
      {
        id: 401,
        title: "Using 200P-14 as a Lookup Table (LUT) for Sine Waves?",
        author: "MathNerd",
        reputation: 430,
        time: "2020-11-05 14:20",
        content: "Since we lack trigonometric functions in assembly, has anyone tried pre-calculating a sine wave, flashing it to the EEPROM, and just querying it by address?",
        replies: [
          {
            author: "ShenzhenVeteran",
            reputation: 1420,
            time: "2020-11-05 15:10",
            content: "Yes, this is the standard meta for the 'Laser targeting' custom Workshop assignments. The 14-address limit is rough, so you only store a quarter-wave (0 to 90 degrees) and use conditional math to mirror it for the other quadrants. It saves tons of processing cycles."
          }
        ]
      }
    ]
  },
  {
    id: "workshop_lua",
    name: "Custom Workshop Lua Part",
    category: "Workshop / Modding",
    cost: "Variable",
    power: "Variable",
    icon: <Code size={24} className="text-red-400" />,
    datasheet: "Steam Workshop puzzles in SHENZHEN I/O often utilize custom components scripted in Lua. These components act as everything from specialized sensors and displays to entirely new proprietary integrated circuits designed by the community.",
    specs: [
      { label: "Engine", value: "Embedded Lua 5.1" },
      { label: "Execution Time", value: "Instant (per game tick)" },
      { label: "I/O Limit", value: "Defined by component model" },
      { label: "Debugging", value: "Requires external console tracing" }
    ],
    technicalAnalysis: "Custom Lua parts evaluate their `tick()` function once per time unit. A common architectural pitfall in Workshop design is failing to simulate the delays inherent in hardware. If a custom Lua part responds instantly to an XBus read without yielding, it allows microcontrollers to bypass intended timing constraints, effectively 'cheating' the cycle metrics.",
    forumThreads: [
      {
        id: 501,
        title: "Lua component breaking cycle parity in my custom assignment",
        author: "WorkshopCreator_99",
        reputation: 142,
        time: "2023-04-11 19:40",
        content: "I'm designing a new Workshop puzzle. My custom RAM chip responds in the same cycle it receives the XBus request. Real hardware takes an extra cycle. How do I delay the response without locking up the main game thread?",
        replies: [
          {
            author: "ModdingGuru",
            reputation: 2890,
            time: "2023-04-11 20:15",
            content: "You need to store the incoming request in a local Lua table and process it on the *next* `tick()`. Don't use `coroutine.yield()` here, it messes with the game's internal cycle counter and will break the histograms. Just queue the response state internally."
          },
          {
            author: "WorkshopCreator_99",
            reputation: 142,
            time: "2023-04-12 01:10",
            content: "Got it, the queue array approach worked perfectly. I also noticed that if I send a nil XBus packet from Lua, the entire game crashes to desktop. Adding validation now, lol."
          }
        ]
      }
    ]
  }
];


// --- COMPONENTS ---

const TopNav = () => (
  <header className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between shadow-md z-10 relative">
    <div className="flex items-center gap-3">
      <div className="bg-emerald-500/20 p-2 rounded-md border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
        <Terminal size={24} className="text-emerald-400" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-wider text-slate-100 font-mono">LONGTENG ELECTRONICS</h1>
        <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase">Internal Component Wiki & Forum // Steam Workshop DB</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative group hidden md:block">
        <input 
          type="text" 
          placeholder="Search parts, datasheets..." 
          className="bg-slate-800 border border-slate-600 text-sm text-slate-200 rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <Search size={16} className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-emerald-500" />
      </div>
      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center border border-slate-500 cursor-pointer hover:bg-slate-600">
        <span className="text-xs font-bold text-slate-200">E.G.</span>
      </div>
    </div>
  </header>
);

const ThreadReply = ({ reply }) => (
  <div className="ml-8 mt-3 pl-4 border-l-2 border-slate-700 relative">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm font-bold text-emerald-400 font-mono">{reply.author}</span>
      <span className="text-xs text-slate-500 bg-slate-800 px-1 rounded flex items-center gap-1">
        <ThumbsUp size={10} /> {reply.reputation}
      </span>
      <span className="text-xs text-slate-500 ml-auto">{reply.time}</span>
    </div>
    <p className="text-sm text-slate-300 leading-relaxed">{reply.content}</p>
  </div>
);

const ForumThread = ({ thread }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 mb-4 hover:border-slate-600 transition-colors">
    <h3 className="text-lg font-bold text-slate-200 mb-3 font-mono flex items-center gap-2">
      <MessageSquare size={16} className="text-blue-400" />
      {thread.title}
    </h3>
    
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
          {thread.author.substring(0,2).toUpperCase()}
        </div>
        <span className="text-sm font-bold text-emerald-400 font-mono">{thread.author}</span>
        <span className="text-xs text-slate-500 bg-slate-800 px-1 rounded flex items-center gap-1">
          <ThumbsUp size={10} /> {thread.reputation}
        </span>
        <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
           <Clock size={12} /> {thread.time}
        </span>
      </div>
      <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800/50">
        {thread.content}
      </p>
    </div>

    {thread.replies.map((reply, idx) => (
      <ThreadReply key={idx} reply={reply} />
    ))}
    
    <div className="mt-4 ml-8">
      <button className="text-xs font-mono text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
        + Reply to Thread
      </button>
    </div>
  </div>
);

export default function App() {
  const [selectedId, setSelectedId] = useState(PARTS_DATA[0].id);
  const [activeTab, setActiveTab] = useState('datasheet');

  const selectedPart = PARTS_DATA.find(p => p.id === selectedId);

  // Group parts by category
  const categories = PARTS_DATA.reduce((acc, part) => {
    if (!acc[part.category]) acc[part.category] = [];
    acc[part.category].push(part);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <TopNav />
      
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-slate-900 border-r border-slate-700 flex flex-col overflow-y-auto z-0">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Component Catalog</h2>
          </div>
          
          <div className="py-2">
            {Object.entries(categories).map(([category, parts]) => (
              <div key={category} className="mb-4">
                <h3 className="px-4 text-xs font-bold text-slate-500 mb-2 uppercase font-mono">{category}</h3>
                <ul className="space-y-1">
                  {parts.map(part => (
                    <li key={part.id}>
                      <button
                        onClick={() => {
                          setSelectedId(part.id);
                          setActiveTab('datasheet');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 border-l-2 ${
                          selectedId === part.id 
                            ? 'bg-slate-800 text-emerald-400 border-emerald-500 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]' 
                            : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        {React.cloneElement(part.icon, { size: 16, className: selectedId === part.id ? "text-emerald-400" : "text-slate-500" })}
                        <span className="font-mono text-left truncate">{part.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#0a0f18] p-6 lg:p-10 relative">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5" 
               style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-700 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-mono uppercase">
                  <span>{selectedPart.category}</span>
                  <ChevronRight size={14} />
                  <span className="text-emerald-400">{selectedPart.id.toUpperCase()}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-4 font-mono">
                  {selectedPart.icon}
                  {selectedPart.name}
                </h1>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0 font-mono text-sm">
                <div className="bg-slate-800 border border-slate-700 rounded p-3 text-center w-24 shadow-inner">
                  <div className="text-slate-500 text-xs mb-1 uppercase font-bold">Cost</div>
                  <div className="text-emerald-400 text-lg font-bold">{selectedPart.cost}</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded p-3 text-center w-24 shadow-inner">
                  <div className="text-slate-500 text-xs mb-1 uppercase font-bold flex items-center justify-center gap-1"><Zap size={10}/> Power</div>
                  <div className="text-amber-400 text-lg font-bold">{selectedPart.power}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 mb-6 font-mono text-sm">
              <button 
                onClick={() => setActiveTab('datasheet')}
                className={`py-3 px-6 transition-colors border-b-2 ${activeTab === 'datasheet' ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                Datasheet & Specs
              </button>
              <button 
                onClick={() => setActiveTab('forum')}
                className={`py-3 px-6 transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'forum' ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                Engineering Forum <span className="bg-blue-600/30 text-blue-400 py-0.5 px-2 rounded-full text-xs">{selectedPart.forumThreads.length}</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'datasheet' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Col: Description & Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                      <section>
                        <h2 className="text-xl font-mono text-slate-200 mb-4 border-l-4 border-blue-500 pl-3">Official Description</h2>
                        <p className="text-slate-300 leading-relaxed text-lg bg-slate-900/50 p-5 rounded-lg border border-slate-800">
                          {selectedPart.datasheet}
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-mono text-slate-200 mb-4 border-l-4 border-purple-500 pl-3">Deep Technical Analysis</h2>
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 shadow-inner">
                          <p className="text-slate-300 leading-relaxed font-mono text-sm">
                            {selectedPart.technicalAnalysis}
                          </p>
                        </div>
                      </section>
                    </div>

                    {/* Right Col: Specs */}
                    <div>
                      <h2 className="text-xl font-mono text-slate-200 mb-4 border-l-4 border-emerald-500 pl-3">Specifications</h2>
                      <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-inner">
                        <table className="w-full text-left border-collapse text-sm font-mono">
                          <tbody>
                            {selectedPart.specs.map((spec, i) => (
                              <tr key={i} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                                <th className="py-3 px-4 font-normal text-slate-500 w-1/2 align-top">{spec.label}</th>
                                <td className="py-3 px-4 font-bold text-slate-300">{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Workshop Callout if applicable */}
                      {selectedPart.id === 'workshop_lua' && (
                        <div className="mt-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                          <h3 className="text-red-400 font-bold font-mono mb-2 text-sm flex items-center gap-2">
                            <Settings size={14} /> Workshop Notice
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Lua parts operate outside the standard silicon limits. Utilizing them in assignments will flag the design as "Custom" in histogram leaderboards.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'forum' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl">
                  <div className="mb-6 flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-inner">
                    <p className="text-sm text-slate-400 font-mono">
                      Showing {selectedPart.forumThreads.length} technical threads tagged with <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">[{selectedPart.id}]</span>
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-mono font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 shadow-lg">
                      <Code size={16} /> New Thread
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {selectedPart.forumThreads.map(thread => (
                      <ForumThread key={thread.id} thread={thread} />
                    ))}
                  </div>
                  
                  <div className="text-center mt-10 pb-10">
                    <p className="text-slate-600 text-sm font-mono italic">End of threads. Keep optimizing.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}