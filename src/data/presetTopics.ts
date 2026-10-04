import { ActiveLearningMatrix } from '../types';

export const PRESET_TOPICS: ActiveLearningMatrix[] = [
  {
    topicTitle: "Distributed Consensus & Raft Protocol",
    tagline: "How autonomous nodes agree on a single source of truth across an unreliable network.",
    domainCategory: "Computer Science & Systems Architecture",
    traditionalPitfall: "Traditional courses make students memorize state diagrams (Follower, Candidate, Leader) and election timeouts without understanding split-brain partitions, Byzantine failures, or how distributed databases prevent data corruption.",
    mentalModel: "Think of a parliamentary council where representatives communicate via unreliable messengers with random delays; to avoid two people claiming to be Prime Minister simultaneously, any decree requires stamped confirmation from a strict majority (Quorum = N/2 + 1).",
    keyPrinciples: [
      {
        name: "Leader Election & Heartbeat Timing",
        rule: "Randomized election timeouts (150ms-300ms) prevent split votes among candidates.",
        whyItMatters: "Without randomized jitter, candidate nodes repeatedly split votes forever (livelock), freezing the distributed cluster."
      },
      {
        name: "Log Replication Invariant",
        rule: "If an entry is committed in a given term, that entry will be present in the logs of the leaders for all higher terms.",
        whyItMatters: "Guarantees zero data loss and state machine safety across unexpected power outages or network partitions."
      },
      {
        name: "Quorum Intersection Law",
        rule: "Any two quorums of size > N/2 must overlap in at least one common server.",
        whyItMatters: "Ensures at least one server in any new leader election knows the latest committed transaction."
      }
    ],
    conceptGraph: {
      nodes: [
        { id: "raft_core", label: "Consensus Engine", category: "core", description: "State machine replication across nodes" },
        { id: "heartbeat", label: "Heartbeat & Lease", category: "mechanism", description: "Leader periodically sends appendEntries" },
        { id: "term_clock", label: "Logical Term Clock", category: "mechanism", description: "Monotonically increasing epoch number" },
        { id: "quorum", label: "Majority Quorum", category: "mechanism", description: "Strict >50% consensus barrier" },
        { id: "partition", label: "Network Partition", category: "application", description: "Split-brain defense & recovery" },
        { id: "etcd_k8s", label: "Production (etcd/K8s)", category: "application", description: "Cloud orchestration control plane" }
      ],
      edges: [
        { from: "raft_core", to: "term_clock", relationship: "tracked by" },
        { from: "raft_core", to: "quorum", relationship: "enforced by" },
        { from: "heartbeat", to: "raft_core", relationship: "maintains stability of" },
        { from: "quorum", to: "partition", relationship: "prevents split-brain in" },
        { from: "raft_core", to: "etcd_k8s", relationship: "powers" }
      ]
    },
    feynmanProtocol: {
      beginnerQuestion: "Why can't five computers in a cloud just vote by taking turns, instead of running elections with timers and terms?",
      coreInsightRequired: "Messages can be delayed or lost. If you take turns in fixed order, one frozen computer halts the entire world. Random timers break ties dynamically.",
      bannedJargon: ["state machine", "RPC", "appendEntries", "monotonic", "byzantine", "idempotent"]
    },
    socraticDebate: {
      provocativePremise: "If a 5-node Raft cluster experiences a 3-2 network split, the 2-node partition can still safely serve read queries because read operations don't modify state.",
      openingQuestion: "Can serving a read from the minority partition ever return stale or disastrously incorrect data to a banking customer?"
    },
    realWorldSimulation: {
      scenarioTitle: "Subsea Cable Severance: The FinTech Gateway Crisis",
      role: "Principal Infrastructure Architect",
      context: "A transatlantic fiber cable is cut during peak trading hours. Your 5-node payment validation cluster is split: 3 nodes in Virginia (AWS us-east) and 2 nodes in Frankfurt (eu-central). Frankfurt customers are rapidly firing credit transfer requests.",
      dilemma: "Frankfurt nodes cannot reach Virginia to reach a majority quorum. Continuing writes causes split-brain data corruption; rejecting writes drops $4.2M/minute in European revenue.",
      choices: [
        {
          id: "A",
          action: "Allow Frankfurt nodes to form an autonomous emergency leader to process local European transactions.",
          tradeOff: "Maintains 100% European availability, but creates irreconcilable divergent balances when the network heals.",
          outcome: "CATASTROPHIC FAILURE: Both partitions accepted conflicting balance debits. Dual-spend attacks resulted in $18M in unrecoverable discrepancies."
        },
        {
          id: "B",
          action: "Strictly reject all write transactions on Frankfurt nodes while returning cached read balances immediately.",
          tradeOff: "Guarantees safety against double-spending, but may serve stale account balances if an account was already debited in Virginia.",
          outcome: "SUB-OPTIMAL: No double-spending occurred, but customers saw stale balances and complained of UI phantom funds."
        },
        {
          id: "C",
          action: "Route all European mutation traffic to Virginia via high-latency satellite backup; if satellite drops, enforce fail-closed 503 and wait for quorum.",
          tradeOff: "Increases transaction latency by 120ms, but preserves strict serializability and total correctness.",
          outcome: "EXEMPLARY MASTERY: Linearizability preserved! Zero double spends, audit trail intact, and customers experienced graceful latency rather than corrupt account data."
        }
      ]
    },
    retrievalCards: [
      {
        id: "rc1",
        question: "Why do election timeouts in Raft have to be chosen randomly from an interval rather than a fixed number like exactly 200ms?",
        answer: "If all nodes had identical timeouts, they would trigger elections at the exact same millisecond, vote for themselves, split the vote (2 vs 2 vs 1), and repeat endlessly without electing a leader.",
        coreInsight: "Symmetry breaking via random temporal jitter.",
        bloomLevel: "Analyze"
      },
      {
        id: "rc2",
        question: "In a 7-node cluster, what is the maximum number of simultaneous node failures the system can sustain without losing write availability?",
        answer: "3 nodes. A majority quorum requires at least (7/2) + 1 = 4 operational nodes. If 3 fail, 4 remain, which constitutes a quorum.",
        coreInsight: "Fault tolerance F = (N - 1) / 2.",
        bloomLevel: "Apply"
      },
      {
        id: "rc3",
        question: "Why can't a Raft leader directly commit a log entry from an older term by simply counting replicas?",
        answer: "An older entry on a majority might still be overwritten if a candidate with a newer term log is elected; Raft leaders only commit entries from their CURRENT term, which transitively commits prior entries.",
        coreInsight: "Leader Completeness Invariant protects committed history.",
        bloomLevel: "Evaluate"
      },
      {
        id: "rc4",
        question: "What happens when a partitioned leader with term 1 receives an AppendEntries RPC from a new leader with term 2?",
        answer: "The old leader immediately steps down, updates its term to 2, transitions to Follower state, and acknowledges the new leader's authority.",
        coreInsight: "Epoch clock (Term) always trumps past leadership status.",
        bloomLevel: "Understand"
      },
      {
        id: "rc5",
        question: "How does the Raft protocol satisfy the CAP theorem trade-off?",
        answer: "Raft is a CP system (Consistency + Partition tolerance). During network partitions, minority partitions sacrifice Availability to preserve linearizable Consistency.",
        coreInsight: "Safety over liveness in mission-critical storage.",
        bloomLevel: "Analyze"
      }
    ],
    modernSkillsUpgraded: [
      {
        skillName: "Distributed Systems Fault Tolerance",
        category: "Cloud & Backend Architecture",
        marketRelevance: "Critical requirement for Staff / Principal Engineers at AWS, Google Cloud, Stripe, and Datadog.",
        portfolioApplication: "Build and publish a mini Raft cluster visualization or Go consensus server demonstrating leader failover."
      },
      {
        skillName: "Linearizability & CAP Trade-Off Analysis",
        category: "Systems Engineering",
        marketRelevance: "Essential for designing high-scale FinTech pipelines and Kubernetes microservices.",
        portfolioApplication: "Document architectural trade-offs in an RFC comparing Raft vs Multi-Paxos vs CockroachDB Raft groups."
      },
      {
        skillName: "First-Principles Failure Mode Modeling",
        category: "Cognitive & Analytical",
        marketRelevance: "High-level incident postmortem and chaos engineering capability.",
        portfolioApplication: "Author chaos engineering test plans (Chaos Mesh / Jepsen analysis) demonstrating resilience."
      }
    ],
    miniProjectChallenge: {
      title: "Interactive Raft Node State Machine in 100 Lines",
      objective: "Build a minimal in-memory Raft node in JavaScript/Python demonstrating candidate election, random timers, and quorum vote collection.",
      deliverable: "GitHub repository with simulation tests demonstrating automatic failover when the leader is paused.",
      steps: [
        "Implement Node class with states: FOLLOWER, CANDIDATE, LEADER.",
        "Add a randomized timer (150ms-300ms) that resets on heartbeat and triggers election upon expiration.",
        "Simulate RequestVote RPC with term comparison logic.",
        "Add an interactive CLI or UI toggle to kill the current leader and observe the next candidate win."
      ],
      evaluationChecklist: [
        "Nodes never vote twice in the same term.",
        "Leader steps down immediately if it sees a higher term.",
        "Zero split-brain states under simulated 3-2 network partition."
      ]
    }
  },
  {
    topicTitle: "Mitochondrial Bioenergetics & ATP Synthase",
    tagline: "The rotary molecular turbine generating the universal energy currency of all eukaryotic life.",
    domainCategory: "Biomedical Sciences & Molecular Physiology",
    traditionalPitfall: "Students memorize the Krebs cycle steps and names like Complex I, II, III, IV without appreciating that the cell is essentially a microscopic hydroelectric dam operating on proton gradients and mechanical rotation.",
    mentalModel: "Think of Hoover Dam: the electron transport chain pumps protons into the intermembrane space (pumping water up into a reservoir); protons rushing back down turn a physical rotary turbine (ATP Synthase) that mechanically snaps phosphate onto ADP like a stamping press.",
    keyPrinciples: [
      {
        name: "Proton-Motive Force (Chemiosmotic Coupling)",
        rule: "Δp = Δψ (membrane electrical potential) - 60ΔpH (chemical concentration gradient).",
        whyItMatters: "Energy is stored physically as an electrochemical voltage difference (-180mV across a 5nm lipid bilayer!)."
      },
      {
        name: "Rotary Catalytic Mechanism of F1F0 ATP Synthase",
        rule: "Flow of 3-4 H+ through the c-ring rotates the gamma subunit 120°, forcing conformational changes in beta subunits (Open -> Loose -> Tight).",
        whyItMatters: "Proves that biological chemistry directly couples physical mechanical torque to chemical bond synthesis."
      },
      {
        name: "Coupling vs Uncoupling (Thermogenesis)",
        rule: "If protons leak through uncoupling proteins (UCP1 / Thermogenin), the potential energy dissipates purely as heat rather than ATP.",
        whyItMatters: "Explains how hibernating animals and human brown adipose tissue survive extreme freezing temperatures without shivering."
      }
    ],
    conceptGraph: {
      nodes: [
        { id: "etc", label: "Electron Transport Chain", category: "core", description: "Complexes I-IV transferring electrons" },
        { id: "proton_grad", label: "Proton Gradient (Δp)", category: "mechanism", description: "Reservoir of electrochemical potential" },
        { id: "atp_synthase", label: "ATP Synthase (Rotary Motor)", category: "mechanism", description: "Nanoscale rotary motor synthesizing ATP" },
        { id: "cellular_work", label: "Cellular Energy & Ion Homeostasis", category: "application", description: "Powering muscle contraction, neurons, active transport" },
        { id: "mitochondrial_toxins", label: "Metabolic Poisons (Cyanide, DNP)", category: "application", description: "Targeted inhibition and uncoupling pathologies" }
      ],
      edges: [
        { from: "etc", to: "proton_grad", relationship: "builds up" },
        { from: "proton_grad", to: "atp_synthase", relationship: "drives rotation of" },
        { from: "atp_synthase", to: "cellular_work", relationship: "fuels" },
        { from: "mitochondrial_toxins", to: "etc", relationship: "blocks or uncouples" }
      ]
    },
    feynmanProtocol: {
      beginnerQuestion: "If food gives us energy, how does a slice of bread actually turn into the power that moves my finger muscles right now?",
      coreInsightRequired: "Food is stripped of electrons, which push protons into a tiny battery room; as they rush back out, they physically spin a molecular wheel that loads microscopic spring-coils into ATP molecules.",
      bannedJargon: ["oxidative phosphorylation", "chemiosmosis", "nicotinamide", "electrochemical gradient", "cytochrome"]
    },
    socraticDebate: {
      provocativePremise: "Since 2,4-Dinitrophenol (DNP) uncouples the proton gradient, allowing cells to burn fat at massive rates without exercise, it would be an ideal metabolic weight loss drug if refined.",
      openingQuestion: "Where does the energy from the uncoupled proton gradient go if it cannot be captured as chemical ATP bonds?"
    },
    realWorldSimulation: {
      scenarioTitle: "Emergency Department: Mystery Ingestion & Rapid Cyanosis",
      role: "Chief Toxicology & Critical Care Fellow",
      context: "A 28-year-old lab technician is brought to the resuscitation bay collapsed, tachypneic, and severely hypotensive. Blood gas reveals severe lactic acidosis (pH 7.10, lactate 14 mmol/L) despite 100% oxygen saturation on pulse oximetry. Central venous oxygen saturation is abnormally high at 92%.",
      dilemma: "Her blood is completely saturated with oxygen, yet her tissues are suffocating and dying. Standard oxygen therapy is having zero effect.",
      choices: [
        {
          id: "A",
          action: "Administer aggressive bicarbonate infusion and increase ventilator pressure to force oxygen into tissues.",
          tradeOff: "Addresses blood pH temporarily, but fails to address why cells cannot consume the abundant oxygen in their capillaries.",
          outcome: "FATAL COMPLICATION: The patient arrests. Oxygen is present in massive excess, but cytochrome c oxidase (Complex IV) is chemically blocked by cyanide; cells cannot transfer electrons to oxygen."
        },
        {
          id: "B",
          action: "Immediately administer Hydroxocobalamin (Cyanokit) IV to bind cyanide into harmless cyanocobalamin excreted in urine.",
          tradeOff: "Causes temporary deep red discoloration of urine and skin, but directly unblocks the mitochondrial respiratory chain.",
          outcome: "LIFESAVING PRECISION: Complex IV unblocked! Electron transport resumes, proton gradient rebuilds, lactic acid drops to 2.1 mmol/L within 90 minutes. Full neurological recovery."
        },
        {
          id: "C",
          action: "Initiate high-dose intravenous glucose and insulin to maximize substrate availability for glycolysis.",
          tradeOff: "Provides rapid glucose, but accelerates anaerobic glycolysis and worsens the lethal lactic acidosis.",
          outcome: "CONDITION DETERIORATION: Anaerobic glycolysis surged, worsening acidosis to pH 6.95 before requiring emergency intervention."
        }
      ]
    },
    retrievalCards: [
      {
        id: "bio1",
        question: "Why does cyanide poisoning cause high venous oxygen saturation (bright red blood) instead of low oxygen?",
        answer: "Cyanide binds to ferric iron in Complex IV (Cytochrome c oxidase), halting electron transfer to oxygen. Because tissues cannot extract or use oxygen, the blood returns to the veins unused.",
        coreInsight: "Histotoxic hypoxia: plenty of oxygen delivered, zero oxygen consumed.",
        bloomLevel: "Analyze"
      },
      {
        id: "bio2",
        question: "How does the rotor (c-ring) of ATP synthase turn in only one direction?",
        answer: "Protons enter a half-channel in subunit a, neutralize a negatively charged aspartate/glutamate residue on the c-ring allowing it into the hydrophobic membrane, and exit into the matrix through a second half-channel.",
        coreInsight: "Charge neutralization coupled to Brownian ratchet directional rotation.",
        bloomLevel: "Understand"
      },
      {
        id: "bio3",
        question: "How does brown adipose tissue generate heat without shivering?",
        answer: "It expresses UCP1 (thermogenin), which forms a pore in the inner mitochondrial membrane allowing protons to bypass ATP synthase; potential energy dissipates directly as thermal heat.",
        coreInsight: "Uncoupled proton leakage generates pure heat.",
        bloomLevel: "Apply"
      },
      {
        id: "bio4",
        question: "Why do cells generate 30-32 ATP from aerobic glucose oxidation but only 2 ATP from anaerobic glycolysis?",
        answer: "Glycolysis only captures energy from substrate-level phosphorylation; the electron transport chain and ATP synthase exploit the massive electrochemical potential of complete oxidation to CO2 and H2O.",
        coreInsight: "Proton gradient amplification provides ~15x energy multiplier.",
        bloomLevel: "Evaluate"
      }
    ],
    modernSkillsUpgraded: [
      {
        skillName: "Mechanistic Toxicology & Cellular Diagnostics",
        category: "Clinical & Pharmacology",
        marketRelevance: "Crucial for critical care medicine, emergency response, and pharmaceutical drug safety screening.",
        portfolioApplication: "Author an interactive clinical pathway for evaluating refractory lactic acidosis and mitochondrial toxins."
      },
      {
        skillName: "Nanomachine Bio-Engineering Intuition",
        category: "Synthetic Biology",
        marketRelevance: "Pivotal for emerging synthetic biology and molecular motor nanotech design.",
        portfolioApplication: "Document molecular dynamics modeling of synthetic rotary proteins in PyMOL / AlphaFold."
      }
    ],
    miniProjectChallenge: {
      title: "Interactive Chemiosmotic Battery Calculator",
      objective: "Build an interactive mathematical model calculating ATP yield as a function of membrane potential (Δψ) and pH gradient.",
      deliverable: "Web calculator or Python notebook simulating the effect of uncouplers and inhibitor concentrations on cellular respiration.",
      steps: [
        "Implement Nernst equation for proton-motive force: Δp = Δψ - (2.303 RT/F) * ΔpH.",
        "Model proton flux through ATP Synthase vs proton leak channels.",
        "Simulate oxygen consumption rate (OCR) and extracellular acidification rate (ECAR) like a Seahorse analyzer."
      ],
      evaluationChecklist: [
        "Accurately reproduces baseline mitochondrial membrane potential (~ -180 mV).",
        "Demonstrates complete uncoupling (OCR surge without ATP) when leak conductance increases."
      ]
    }
  },
  {
    topicTitle: "Modern Elasticity & Supply Chain Shocks",
    tagline: "Dynamic price discovery, bullwhip amplification, and systemic fragility in global markets.",
    domainCategory: "Economics, Quantitative Strategy & Operations",
    traditionalPitfall: "Students memorize static 2D supply/demand curves intersecting at equilibrium without understanding time delays, inventory feedback loops, price inelasticity in crises, or systemic contagion.",
    mentalModel: "Think of steering an ultra-heavy oil tanker: you turn the steering wheel today, but the ship only starts turning 20 minutes later; if you keep turning until you see the ship turn, you will violently over-correct and crash into the harbor (The Bullwhip Effect).",
    keyPrinciples: [
      {
        name: "Price Inelasticity of Essential Goods Under Shock",
        rule: "When PED < 0.2, a 10% supply shortage causes prices to skyrocket by 50%+ to clear the market.",
        whyItMatters: "Explains why localized fertilizer, neon gas, or semiconductor disruptions lead to massive worldwide inflation spikes."
      },
      {
        name: "The Forrester Bullwhip Invariant",
        rule: "Variance in customer demand is amplified at each tier upstream in the supply chain: Var(Tier N) >> Var(Consumer).",
        whyItMatters: "A 5% shift in retail sales causes factories 4 tiers back to experience 40% boom-and-bust order whiplash."
      },
      {
        name: "Just-In-Time (JIT) vs Just-In-Case Fragility Trade-off",
        rule: "Minimizing buffer inventory reduces working capital during peace, but destroys resilience during tail-risk shocks.",
        whyItMatters: "Systemic resilience is non-linear; zero buffer efficiency translates to infinite fragility under non-normal disruptions."
      }
    ],
    conceptGraph: {
      nodes: [
        { id: "demand_shock", label: "Demand/Supply Shock", category: "core", description: "Exogenous disruption or surge" },
        { id: "lead_time", label: "Information & Shipping Delays", category: "mechanism", description: "Time lag between order and delivery" },
        { id: "bullwhip", label: "Bullwhip Amplification", category: "mechanism", description: "Oscillatory hoarding and over-ordering" },
        { id: "pricing_power", label: "Dynamic Elasticity", category: "application", description: "Consumer price tolerance and substitutes" },
        { id: "resilience_buffer", label: "Strategic Dual-Sourcing", category: "application", description: "Risk-mitigated supply chain architecture" }
      ],
      edges: [
        { from: "demand_shock", to: "lead_time", relationship: "interacts with" },
        { from: "lead_time", to: "bullwhip", relationship: "triggers" },
        { from: "bullwhip", to: "pricing_power", relationship: "distorts" },
        { from: "resilience_buffer", to: "bullwhip", relationship: "dampens" }
      ]
    },
    feynmanProtocol: {
      beginnerQuestion: "Why did a slight delay in ships unloading toilet paper in 2020 lead to empty shelves for three whole months?",
      coreInsightRequired: "People feared running out, so they bought twice as much; stores noticed shelves emptying and ordered 4x as much from warehouses; factories couldn't instantly quadruple production, so the panic fed on itself.",
      bannedJargon: ["price elasticity", "inventory lead time", "phantom demand", "safety stock", "Nash equilibrium"]
    },
    socraticDebate: {
      provocativePremise: "During an acute emergency, anti-price-gouging laws protect the vulnerable by capping prices of bottled water and generators at pre-disaster levels.",
      openingQuestion: "If prices are legally capped at $2/bottle when supply is down 80%, what physical rationing mechanism determines who gets water, and what incentive exists for suppliers 500 miles away to rush more water in?"
    },
    realWorldSimulation: {
      scenarioTitle: "Semiconductor Fab Fire: Global Automotive Supply Crisis",
      role: "Global Head of Strategic Procurement",
      context: "A primary microcontroller manufacturing facility in Taiwan has caught fire, halting 60% of the worldwide supply of specialized automotive brake controllers for 6 months. Your auto assembly plants have exactly 8 days of buffer parts remaining.",
      dilemma: "Shutting down assembly lines costs $14M per day. Alternative suppliers are quoting a 400% price premium and demanding non-refundable 2-year purchase commitments.",
      choices: [
        {
          id: "A",
          action: "Pause production lines immediately and wait for the Taiwanese fab to rebuild under insurance guarantees.",
          tradeOff: "Conserves capital and avoids paying 400% premiums, but loses market share and lays off 12,000 plant workers.",
          outcome: "MARKET DEFEAT: Assembly lines stayed dark for 7 months. Competitors absorbed your dealership footprint, destroying 18% market share permanently."
        },
        {
          id: "B",
          action: "Sign the 2-year purchase commitment at 400% premium for every spare chip available on the spot market.",
          tradeOff: "Guarantees immediate continuity, but locks your firm into massive uncompetitive cost structures when the market normalizes.",
          outcome: "MARGIN COLLAPSE: Maintained production, but profit margin went deeply negative; ended up with $120M in surplus over-priced inventory once the fab reopened."
        },
        {
          id: "C",
          action: "Rapidly redesign ECU board firmware to use standard industrial microcontrollers from dual-source US/EU vendors, while securing 30-day bridge chips.",
          tradeOff: "Requires $8M in accelerated engineering overtime and rapid regulatory recertification, but permanently eliminates single-source vulnerability.",
          outcome: "RESILIENCE TRIUMPH: Engineering team shipped universal firmware in 22 days. Production restored with flexible multi-vendor sourcing. Company honored for operational agility."
        }
      ]
    },
    retrievalCards: [
      {
        id: "econ1",
        question: "Why does the Bullwhip Effect worsen the further upstream you travel from the end consumer?",
        answer: "Because each intermediary adds their own safety buffer and forecast error, turning a small consumer fluctuation into wild order swings at raw material tiers.",
        coreInsight: "Amplification of variance through uncoordinated feedback delays.",
        bloomLevel: "Analyze"
      },
      {
        id: "econ2",
        question: "If demand for insulin has an absolute price elasticity of 0.05, what happens to total supplier revenue if the market price doubles?",
        answer: "Total revenue nearly doubles. Because quantity demanded falls by only ~5% while price rises by 100%, total expenditure surges.",
        coreInsight: "Inelastic demand means price and total revenue move in the same direction.",
        bloomLevel: "Apply"
      },
      {
        id: "econ3",
        question: "What is the economic purpose of surge pricing during ride-hail rush hours or disasters?",
        answer: "It dampens non-essential demand while incentivizing more drivers to enter the area, resolving the shortage and allocating scarce seats to high-urgency riders.",
        coreInsight: "Price acts as an information signal coordinating supply and demand dynamically.",
        bloomLevel: "Evaluate"
      }
    ],
    modernSkillsUpgraded: [
      {
        skillName: "Quantitative Supply Chain Modeling",
        category: "Operations & Analytics",
        marketRelevance: "High-demand skill across tech giants (Apple, Amazon, Tesla) and logistics consultancies.",
        portfolioApplication: "Develop a Monte Carlo simulation modeling inventory stockout risk under varying supplier lead times."
      },
      {
        skillName: "System Dynamics & Feedback Analysis",
        category: "Systems Thinking",
        marketRelevance: "Key competency for Product Strategy, Venture Capital, and Operations Research.",
        portfolioApplication: "Create a causal loop diagram analyzing market volatility in commodity cycles."
      }
    ],
    miniProjectChallenge: {
      title: "Beer Distribution Game Simulation in Python/TypeScript",
      objective: "Simulate a 4-tier supply chain (Retailer, Wholesaler, Distributor, Factory) experiencing a sudden 20% step-increase in consumer demand.",
      deliverable: "Simulation script plotting order oscillations, inventory stockouts, and backlog costs across all four tiers.",
      steps: [
        "Model inventory balance equation: Inventory(t) = Inventory(t-1) + ShipmentsReceived - ShipmentsSent.",
        "Implement ordering heuristic based on expected demand and safety stock target.",
        "Introduce a 2-week shipping delay and 2-week order processing lag.",
        "Plot the resulting oscillations showing the bullwhip amplification ratio."
      ],
      evaluationChecklist: [
        "Factory order variance exceeds retailer demand variance by at least 3x.",
        "Demonstrates how shared point-of-sale information dampens oscillations."
      ]
    }
  }
];
