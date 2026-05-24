export const CollegePath = [
  {
    id: "Entrance",
    coordinates: [0.2104977200501464, 0.5551978215211891],
    floor: 0,
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.26966071608216674, 0.5554782765681981],
        distance: 0.05916366075994832,
        message: "Go Straight",
      },
    ],
  },
  {
    id: "path-1",
    coordinates: [0.26966071608216674, 0.5554782765681981],
    floor: 0,
    neighbors: [
      {
        id: "Entrance",
        coordinates: [0.2104977200501464, 0.5551978215211891],
        distance: 0.05916366075994832,
        isParent: true,
      },
      {
        id: "path-2",
        coordinates: [0.28743128822433395, 0.5551978215211891],
        distance: 0.017772785074190316,
        message: "Go Straight(pass junc)",
      },
      {
        id: "path-9",
        coordinates: [0.26857714698898266, 0.5854868263519417],
        distance: 0.030028106535429765,
      },
      {
        id: "Ward-16-main",
        coordinates: [0.26901057751617846, 0.5277133531359045],
        distance: 0.027772534154378387,
      },
    ],
  },
  {
    id: "path-2",
    coordinates: [0.28743128822433395, 0.5551978215211891],
    floor: 0,
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.26966071608216674, 0.5554782765681981],
        distance: 0.017772785074190316,
        isParent: true,
      },
      {
        id: "path-3",
        coordinates: [0.3205885790587025, 0.5537955556358921],
        distance: 0.03318692943144892,
        message: "Go Straight(stairs right)",
      },
      {
        id: "staircase-1",
        coordinates: [0.28660421180257967, 0.5716460087078428],
        distance: 0.01646896830814301,
      },
    ],
  },
  {
    id: "staircase-1",
    coordinates: [0.28660421180257967, 0.5716460087078428],
    floor: 0,
    neighbors: [
      {
        id: "path-2",
        coordinates: [0.28743128822433395, 0.5551978215211891],
        distance: 0.01646896830814301,
        isParent: true,
      },
      {
        id: "staircase-1-base",
        coordinates: [0.4230901870468298, 0.6793340556308836],
        floor: -1,
        distance: 0.134,
      },
    ],
  },
  {
    id: "path-3",
    coordinates: [0.3205885790587025, 0.5537955556358921],
    floor: 0,
    neighbors: [
      {
        id: "path-2",
        coordinates: [0.28743128822433395, 0.5551978215211891],
        distance: 0.03318692943144892,
        isParent: true,
      },
      {
        id: "path-4",
        coordinates: [0.3288237157265898, 0.554636911427171],
        distance: 0.008278004319055413,
        message: "Go Straight(pass by orthoicu)",
      },
      {
        id: "path-21",
        coordinates: [0.32081147073733984, 0.5422338771329762],
        distance: 0.011563826810584517,
      },
      {
        id: "path-26",
        coordinates: [0.32043805588758234, 0.575899269387595],
        distance: 0.02210422626653693,
      },
    ],
  },
  {
    id: "path-4",
    coordinates: [0.3288237157265898, 0.554636911427171],
    floor: 0,
    neighbors: [
      {
        id: "path-3",
        coordinates: [0.3205885790587025, 0.5537955556358921],
        distance: 0.008278004319055413,
        isParent: true,
      },
      {
        id: "path-5",
        coordinates: [0.33835914397606437, 0.5537955556358921],
        distance: 0.009572474678388867,
        message: "Go Straight(pass by op ward)",
      },
    ],
  },
  {
    id: "path-5",
    coordinates: [0.33835914397606437, 0.5537955556358921],
    floor: 0,
    neighbors: [
      {
        id: "path-4",
        coordinates: [0.3288237157265898, 0.554636911427171],
        distance: 0.009572474678388867,
        isParent: true,
      },
      {
        id: "path-6",
        coordinates: [0.36068071497937104, 0.554636911427171],
        distance: 0.022337421776543052,
        message: "Go Straight(pass by waitingroom)",
      },
      {
        id: "path-22",
        coordinates: [0.3389840418223468, 0.5403009383661171],
        distance: 0.013509078154189396,
      },
    ],
  },
  {
    id: "path-6",
    coordinates: [0.36068071497937104, 0.554636911427171],
    floor: 0,
    neighbors: [
      {
        id: "path-5",
        coordinates: [0.33835914397606437, 0.5537955556358921],
        distance: 0.022337421776543052,
        isParent: true,
      },
      {
        id: "path-7",
        coordinates: [0.3702161432288456, 0.552954190494865],
        distance: 0.009682765185467325,
        message: "Go Straight(pass by icu2)",
      },
      {
        id: "ICU-2",
        coordinates: [0.3605172926108777, 0.5660734856876847],
        distance: 0.011437741808887297,
      },
      {
        id: "path-24",
        coordinates: [0.3597704712104848, 0.5438446683887256],
        distance: 0.010830561089789824,
      },
    ],
  },
  {
    id: "path-7",
    coordinates: [0.3702161432288456, 0.552954190494865],
    floor: 0,
    neighbors: [
      {
        id: "path-6",
        coordinates: [0.36068071497937104, 0.554636911427171],
        distance: 0.009682765185467325,
        isParent: true,
      },
      {
        id: "path-8",
        coordinates: [0.3791014256875265, 0.5551978215211891],
        distance: 0.009164176152433284,
        message: "Go Straight(pass by lift)",
      },
      {
        id: "path-25",
        coordinates: [0.3688567567529883, 0.54497221689773],
        distance: 0.008096902747106739,
      },
    ],
  },
  {
    id: "path-8",
    coordinates: [0.3791014256875265, 0.5551978215211891],
    floor: 0,
    neighbors: [
      {
        id: "path-7",
        coordinates: [0.3702161432288456, 0.552954190494865],
        distance: 0.009164176152433284,
        isParent: true,
      },
      {
        id: "path-32",
        coordinates: [0.4405990618330986, 0.5554858489558809],
        distance: 0.06149831063774279,
      },
      {
        id: "path-51",
        coordinates: [0.3793848274911354, 0.5785850270258648],
        distance: 0.02338892254680023,
        message: "Turn Right to ward 14",
      },
      {
        id: "path-66",
        coordinates: [0.38012067918299, 0.5335276313603505],
        distance: 0.021694147120707937,
      },
    ],
  },
  {
    id: "path-9",
    coordinates: [0.26857714698898266, 0.5854868263519417],
    floor: 0,
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.26966071608216674, 0.5554782765681981],
        distance: 0.030028106535429765,
        isParent: true,
      },
      {
        id: "path-10",
        coordinates: [0.23043543399108438, 0.6236285444497027],
        distance: 0.05394053141991755,
      },
    ],
  },
  {
    id: "path-10",
    coordinates: [0.23043543399108438, 0.6236285444497027],
    floor: 0,
    neighbors: [
      {
        id: "path-9",
        coordinates: [0.26857714698898266, 0.5854868263519417],
        distance: 0.05394053141991755,
        isParent: true,
      },
      {
        id: "path-11",
        coordinates: [0.22133343626880558, 0.6233480894026937],
        distance: 0.009106317453820791,
      },
    ],
  },
  {
    id: "path-11",
    coordinates: [0.22133343626880558, 0.6233480894026937],
    floor: 0,
    neighbors: [
      {
        id: "path-10",
        coordinates: [0.23043543399108438, 0.6236285444497027],
        distance: 0.009106317453820791,
        isParent: true,
      },
    ],
  },
  {
    id: "Ward-16-main",
    coordinates: [0.26901057751617846, 0.5277133531359045],
    floor: 0,
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.26966071608216674, 0.5554782765681981],
        distance: 0.027772534154378387,
        isParent: true,
      },
      {
        id: "path-13",
        coordinates: [0.24430514583810045, 0.49994842970361086],
        distance: 0.03716516282220904,
      },
    ],
  },
  {
    id: "path-13",
    coordinates: [0.24430514583810045, 0.49994842970361086],
    floor: 0,
    neighbors: [
      {
        id: "Ward-16-main",
        coordinates: [0.26901057751617846, 0.5277133531359045],
        distance: 0.03716516282220904,
        isParent: true,
      },
      {
        id: "path-14",
        coordinates: [0.2531904282967814, 0.5108861251133481],
        distance: 0.014091892181205826,
      },
      {
        id: "path-16",
        coordinates: [0.23043543399108438, 0.4876084637337026],
        distance: 0.018564580977165963,
      },
      {
        id: "path-18",
        coordinates: [0.2531904282967814, 0.4862061931735316],
        distance: 0.016364513717773244,
      },
    ],
  },
  {
    id: "path-14",
    coordinates: [0.2531904282967814, 0.5108861251133481],
    floor: 0,
    neighbors: [
      {
        id: "path-13",
        coordinates: [0.24430514583810045, 0.49994842970361086],
        distance: 0.014091892181205826,
        isParent: true,
      },
      {
        id: "path-15",
        coordinates: [0.248639429435642, 0.5145320220249691],
        distance: 0.0058313081657771805,
      },
    ],
  },
  {
    id: "path-15",
    coordinates: [0.248639429435642, 0.5145320220249691],
    floor: 0,
    neighbors: [
      {
        id: "path-14",
        coordinates: [0.2531904282967814, 0.5108861251133481],
        distance: 0.0058313081657771805,
        isParent: true,
      },
    ],
  },
  {
    id: "path-16",
    coordinates: [0.23043543399108438, 0.4876084637337026],
    floor: 0,
    neighbors: [
      {
        id: "path-13",
        coordinates: [0.24430514583810045, 0.49994842970361086],
        distance: 0.018564580977165963,
        isParent: true,
      },
      {
        id: "path-17",
        coordinates: [0.22176685957119593, 0.4867670985926755],
        distance: 0.00870930983337255,
      },
    ],
  },
  {
    id: "path-17",
    coordinates: [0.22176685957119593, 0.4867670985926755],
    floor: 0,
    neighbors: [
      {
        id: "path-16",
        coordinates: [0.23043543399108438, 0.4876084637337026],
        distance: 0.00870930983337255,
        isParent: true,
      },
    ],
  },
  {
    id: "path-18",
    coordinates: [0.2531904282967814, 0.4862061931735316],
    floor: 0,
    neighbors: [
      {
        id: "path-13",
        coordinates: [0.24430514583810045, 0.49994842970361086],
        distance: 0.016364513717773244,
        isParent: true,
      },
      {
        id: "path-19",
        coordinates: [0.30346815270732896, 0.40038733680331756],
        distance: 0.09946218216284215,
      },
    ],
  },
  {
    id: "path-19",
    coordinates: [0.30346815270732896, 0.40038733680331756],
    floor: 0,
    neighbors: [
      {
        id: "path-18",
        coordinates: [0.2531904282967814, 0.4862061931735316],
        distance: 0.09946218216284215,
        isParent: true,
      },
      {
        id: "path-20",
        coordinates: [0.30996958171604394, 0.38888873129956225],
        distance: 0.013209334112147838,
      },
    ],
  },
  {
    id: "path-20",
    coordinates: [0.30996958171604394, 0.38888873129956225],
    floor: 0,
    neighbors: [
      {
        id: "path-19",
        coordinates: [0.30346815270732896, 0.40038733680331756],
        distance: 0.013209334112147838,
        isParent: true,
      },
    ],
  },
  {
    id: "path-21",
    coordinates: [0.32081147073733984, 0.5422338771329762],
    floor: 0,
    neighbors: [
      {
        id: "path-3",
        coordinates: [0.3205885790587025, 0.5537955556358921],
        distance: 0.011563826810584517,
        isParent: true,
      },
    ],
  },
  {
    id: "path-22",
    coordinates: [0.3389840418223468, 0.5403009383661171],
    floor: 0,
    neighbors: [
      {
        id: "path-5",
        coordinates: [0.33835914397606437, 0.5537955556358921],
        distance: 0.013509078154189396,
        isParent: true,
      },
    ],
  },
  {
    id: "ICU-2",
    coordinates: [0.3605172926108777, 0.5660734856876847],
    floor: 0,
    neighbors: [
      {
        id: "path-6",
        coordinates: [0.36068071497937104, 0.554636911427171],
        distance: 0.011437741808887297,
        isParent: true,
      },
    ],
  },
  {
    id: "path-24",
    coordinates: [0.3597704712104848, 0.5438446683887256],
    floor: 0,
    neighbors: [
      {
        id: "path-6",
        coordinates: [0.36068071497937104, 0.554636911427171],
        distance: 0.010830561089789824,
        isParent: true,
      },
    ],
  },
  {
    id: "path-25",
    coordinates: [0.3688567567529883, 0.54497221689773],
    floor: 0,
    neighbors: [
      {
        id: "path-7",
        coordinates: [0.3702161432288456, 0.552954190494865],
        distance: 0.008096902747106739,
        isParent: true,
      },
    ],
  },
  {
    id: "path-26",
    coordinates: [0.32043805588758234, 0.575899269387595],
    floor: 0,
    neighbors: [
      {
        id: "path-3",
        coordinates: [0.3205885790587025, 0.5537955556358921],
        distance: 0.02210422626653693,
        isParent: true,
      },
    ],
  },
  {
    id: "path-28",
    coordinates: [0.24465150870125515, 0.6088841760750631],
    floor: 0,
    neighbors: [
      {
        id: "path-29",
        coordinates: [0.2545566503697622, 0.6271670678154877],
        distance: 0.020793651960761536,
      },
    ],
  },
  {
    id: "path-29",
    coordinates: [0.2545566503697622, 0.6271670678154877],
    floor: 0,
    neighbors: [
      {
        id: "path-28",
        coordinates: [0.24465150870125515, 0.6088841760750631],
        distance: 0.020793651960761536,
        isParent: true,
      },
      {
        id: "path-30",
        coordinates: [0.30403574813118167, 0.7111778579686626],
        distance: 0.09749868705497984,
      },
    ],
  },
  {
    id: "path-30",
    coordinates: [0.30403574813118167, 0.7111778579686626],
    floor: 0,
    neighbors: [
      {
        id: "path-29",
        coordinates: [0.2545566503697622, 0.6271670678154877],
        distance: 0.09749868705497984,
        isParent: true,
      },
      {
        id: "path-31",
        coordinates: [0.309710410324012, 0.7201257921592199],
        distance: 0.01059562727172307,
      },
    ],
  },
  {
    id: "path-31",
    coordinates: [0.309710410324012, 0.7201257921592199],
    floor: 0,
    neighbors: [
      {
        id: "path-30",
        coordinates: [0.30403574813118167, 0.7111778579686626],
        distance: 0.01059562727172307,
        isParent: true,
      },
    ],
  },
  {
    id: "path-32",
    coordinates: [0.4405990618330986, 0.5554858489558809],
    floor: 0,
    neighbors: [
      {
        id: "path-8",
        coordinates: [0.3791014256875265, 0.5551978215211891],
        distance: 0.06149831063774279,
        isParent: true,
      },
      {
        id: "path-33",
        coordinates: [0.4987009603493394, 0.5556611223598276],
        distance: 0.05810216288536665,
      },
      {
        id: "path-58",
        coordinates: [0.44049799856389993, 0.6086550132989763],
        distance: 0.053169260392894935,
      },
      {
        id: "path-118",
        coordinates: [0.4406568181098613, 0.501414039828366],
        distance: 0.05407183997340868,
        isParent: true,
      },
    ],
  },
  {
    id: "path-33",
    coordinates: [0.4987009603493394, 0.5556611223598276],
    floor: 0,
    neighbors: [
      {
        id: "path-32",
        coordinates: [0.4405990618330986, 0.5554858489558809],
        distance: 0.05810216288536665,
        isParent: true,
      },
      {
        id: "path-34",
        coordinates: [0.5088586363359655, 0.5549600433518621],
        distance: 0.010181841347452343,
      },
      {
        id: "path-65",
        coordinates: [0.49712719208377787, 0.5774485558140073],
        distance: 0.021844198384788592,
        isParent: true,
      },
      {
        id: "path-73",
        coordinates: [0.4975420374248185, 0.5336604615472342],
        distance: 0.02203116380347983,
        isParent: true,
      },
    ],
  },
  {
    id: "path-34",
    coordinates: [0.5088586363359655, 0.5549600433518621],
    floor: 0,
    neighbors: [
      {
        id: "path-33",
        coordinates: [0.4987009603493394, 0.5556611223598276],
        distance: 0.010181841347452343,
        isParent: true,
      },
      {
        id: "path-35",
        coordinates: [0.5192871848862736, 0.5544342348262791],
        distance: 0.01044179579726151,
      },
      {
        id: "path-50",
        coordinates: [0.5088985314107826, 0.5454011480215294],
        distance: 0.009558978583156847,
      },
    ],
  },
  {
    id: "path-35",
    coordinates: [0.5192871848862736, 0.5544342348262791],
    floor: 0,
    neighbors: [
      {
        id: "path-34",
        coordinates: [0.5088586363359655, 0.5549600433518621],
        distance: 0.01044179579726151,
        isParent: true,
      },
      {
        id: "path-36",
        coordinates: [0.5872758913406033, 0.5563622013677931],
        distance: 0.06801603678779157,
      },
      {
        id: "path-49",
        coordinates: [0.518933100235097, 0.5437904914151834],
        distance: 0.01064963143688272,
      },
    ],
  },
  {
    id: "path-36",
    coordinates: [0.5872758913406033, 0.5563622013677931],
    floor: 0,
    neighbors: [
      {
        id: "path-35",
        coordinates: [0.5192871848862736, 0.5544342348262791],
        distance: 0.06801603678779157,
        isParent: true,
      },
      {
        id: "path-37",
        coordinates: [0.5983816213001162, 0.5565374718501757],
        distance: 0.01110711293161352,
      },
      {
        id: "path-39",
        coordinates: [0.5878176364679671, 0.5684558091424613],
        distance: 0.01210573569802913,
      },
    ],
  },
  {
    id: "path-37",
    coordinates: [0.5983816213001162, 0.5565374718501757],
    floor: 0,
    neighbors: [
      {
        id: "path-36",
        coordinates: [0.5872758913406033, 0.5563622013677931],
        distance: 0.01110711293161352,
        isParent: true,
      },
      {
        id: "path-38",
        coordinates: [0.6074558070320145, 0.5554858547990095],
        distance: 0.009134918999054711,
      },
      {
        id: "path-40",
        coordinates: [0.5970272584817065, 0.5679300006168782],
        distance: 0.011472750774946458,
      },
    ],
  },
  {
    id: "path-38",
    coordinates: [0.6074558070320145, 0.5554858547990095],
    floor: 0,
    neighbors: [
      {
        id: "path-37",
        coordinates: [0.5983816213001162, 0.5565374718501757],
        distance: 0.009134918999054711,
        isParent: true,
      },
      {
        id: "path-41",
        coordinates: [0.607844014232932, 0.5270320682287007],
        distance: 0.028456434685665128,
      },
    ],
  },
  {
    id: "path-39",
    coordinates: [0.5878176364679671, 0.5684558091424613],
    floor: 0,
    neighbors: [
      {
        id: "path-36",
        coordinates: [0.5872758913406033, 0.5563622013677931],
        distance: 0.01210573569802913,
        isParent: true,
      },
    ],
  },
  {
    id: "path-40",
    coordinates: [0.5970272584817065, 0.5679300006168782],
    floor: 0,
    neighbors: [
      {
        id: "path-37",
        coordinates: [0.5983816213001162, 0.5565374718501757],
        distance: 0.011472750774946458,
        isParent: true,
      },
    ],
  },
  {
    id: "path-41",
    coordinates: [0.607844014232932, 0.5270320682287007],
    floor: 0,
    neighbors: [
      {
        id: "path-38",
        coordinates: [0.6074558070320145, 0.5554858547990095],
        distance: 0.028456434685665128,
        isParent: true,
      },
      {
        id: "path-42",
        coordinates: [0.6300912027732283, 0.5030735554043001],
        distance: 0.032694766166841756,
      },
    ],
  },
  {
    id: "path-42",
    coordinates: [0.6300912027732283, 0.5030735554043001],
    floor: 0,
    neighbors: [
      {
        id: "path-41",
        coordinates: [0.607844014232932, 0.5270320682287007],
        distance: 0.032694766166841756,
        isParent: true,
      },
      {
        id: "path-43",
        coordinates: [0.6335138467650786, 0.5129388246011719],
        distance: 0.010442127571606126,
      },
      {
        id: "path-44",
        coordinates: [0.6463390151154096, 0.48813638291079414],
        distance: 0.02207058059969176,
      },
      {
        id: "path-46",
        coordinates: [0.6300765452868096, 0.49669336351758164],
        distance: 0.0063802087233299914,
      },
    ],
  },
  {
    id: "path-43",
    coordinates: [0.6335138467650786, 0.5129388246011719],
    floor: 0,
    neighbors: [
      {
        id: "path-42",
        coordinates: [0.6300912027732283, 0.5030735554043001],
        distance: 0.010442127571606126,
        isParent: true,
      },
    ],
  },
  {
    id: "path-44",
    coordinates: [0.6463390151154096, 0.48813638291079414],
    neighbors: [
      {
        id: "path-42",
        coordinates: [0.6300912027732283, 0.5030735554043001],
        distance: 0.02207058059969176,
        isParent: true,
      },
      {
        id: "path-45",
        coordinates: [0.6601889220480677, 0.4876738413347369],
        distance: 0.013857628467846583,
      },
    ],
  },
  {
    id: "path-45",
    coordinates: [0.6601889220480677, 0.4876738413347369],
    floor: 0,
    neighbors: [
      {
        id: "path-44",
        coordinates: [0.6463390151154096, 0.48813638291079414],
        distance: 0.013857628467846583,
        isParent: true,
      },
    ],
  },
  {
    id: "path-46",
    coordinates: [0.6300765452868096, 0.49669336351758164],
    floor: 0,
    neighbors: [
      {
        id: "path-42",
        coordinates: [0.6300912027732283, 0.5030735554043001],
        distance: 0.0063802087233299914,
        isParent: true,
      },
      {
        id: "Ward-20",
        coordinates: [0.5726006646797155, 0.4001423336176937],
        distance: 0.11236359831497918,
      },
    ],
  },
  {
    id: "Ward-20",
    coordinates: [0.5726006646797155, 0.4001423336176937],
    floor: 0,
    neighbors: [
      {
        id: "path-46",
        coordinates: [0.6300765452868096, 0.49669336351758164],
        distance: 0.11236359831497918,
        isParent: true,
      },
      {
        id: "path-48",
        coordinates: [0.566738266400828, 0.3896618478906488],
        distance: 0.01200867580772729,
      },
    ],
  },
  {
    id: "path-48",
    coordinates: [0.566738266400828, 0.3896618478906488],
    floor: 0,
    neighbors: [
      {
        id: "Ward-20",
        coordinates: [0.5726006646797155, 0.4001423336176937],
        distance: 0.01200867580772729,
        isParent: true,
      },
    ],
  },
  {
    id: "path-49",
    coordinates: [0.518933100235097, 0.5437904914151834],
    floor: 0,
    neighbors: [
      {
        id: "path-35",
        coordinates: [0.5192871848862736, 0.5544342348262791],
        distance: 0.01064963143688272,
        isParent: true,
      },
    ],
  },
  {
    id: "path-50",
    coordinates: [0.5088985314107826, 0.5454011480215294],
    floor: 0,
    neighbors: [
      {
        id: "path-34",
        coordinates: [0.5088586363359655, 0.5549600433518621],
        distance: 0.009558978583156847,
        isParent: true,
      },
    ],
  },
  {
    id: "path-51",
    coordinates: [0.3793848274911354, 0.5785850270258648],
    floor: 0,
    neighbors: [
      {
        id: "path-8",
        coordinates: [0.3791014256875265, 0.5551978215211891],
        distance: 0.02338892254680023,
        isParent: true,
      },
      {
        id: "path-52",
        coordinates: [0.40945024736772073, 0.6005567069631685],
        distance: 0.03723820875958844,
        message: "Go Straight",
      },
    ],
  },
  {
    id: "path-52",
    coordinates: [0.40945024736772073, 0.6005567069631685],
    floor: 0,
    neighbors: [
      {
        id: "path-51",
        coordinates: [0.3793848274911354, 0.5785850270258648],
        distance: 0.03723820875958844,
        isParent: true,
      },
      {
        id: "path-53",
        coordinates: [0.4243060971781805, 0.610627061115556],
        distance: 0.017947376029532704,
        message: "Go Straight(pass by ward 16)",
      },
      {
        id: "path-55",
        coordinates: [0.4022631126111081, 0.6072333934673451],
        distance: 0.009809844478112912,
      },
    ],
  },
  {
    id: "path-53",
    coordinates: [0.4243060971781805, 0.610627061115556],
    floor: 0,
    neighbors: [
      {
        id: "path-52",
        coordinates: [0.40945024736772073, 0.6005567069631685],
        distance: 0.017947376029532704,
        isParent: true,
      },
      {
        id: "path-54",
        coordinates: [0.4347995177090573, 0.6095589934821242],
        distance: 0.010547636839947163,
      },
    ],
  },
  {
    id: "path-54",
    coordinates: [0.4347995177090573, 0.6095589934821242],
    floor: 0,
    neighbors: [
      {
        id: "path-53",
        coordinates: [0.4243060971781805, 0.610627061115556],
        distance: 0.010547636839947163,
        isParent: true,
      },
      {
        id: "path-58",
        coordinates: [0.44049799856389993, 0.6086550132989763],
        distance: 0.0057697369285377486,
      },
    ],
  },
  {
    id: "path-55",
    coordinates: [0.4022631126111081, 0.6072333934673451],
    floor: 0,
    neighbors: [
      {
        id: "path-52",
        coordinates: [0.40945024736772073, 0.6005567069631685],
        distance: 0.009809844478112912,
        isParent: true,
      },
      {
        id: "Ward-10",
        coordinates: [0.3569700225185316, 0.7057830605240664],
        distance: 0.10845967401354695,
      },
    ],
  },
  {
    id: "Ward-10",
    coordinates: [0.3569700225185316, 0.7057830605240664],
    floor: 0,
    neighbors: [
      {
        id: "path-55",
        coordinates: [0.4022631126111081, 0.6072333934673451],
        distance: 0.10845967401354695,
        isParent: true,
      },
      {
        id: "path-179",
        coordinates: [0.3519916293716442, 0.7170576567684879],
        distance: 0.012324809077616544,
      },
    ],
  },
  {
    id: "path-179",
    coordinates: [0.3519916293716442, 0.7170576567684879],
    floor: 0,
    neighbors: [
      {
        id: "Ward-10",
        coordinates: [0.3569700225185316, 0.7057830605240664],
        distance: 0.012324809077616544,
        isParent: true,
      },
    ],
  },
  {
    id: "path-58",
    coordinates: [0.44049799856389993, 0.6086550132989763],
    floor: 0,
    neighbors: [
      {
        id: "path-54",
        coordinates: [0.4347995177090573, 0.6095589934821242],
        distance: 0.0057697369285377486,
        isParent: true,
      },
      {
        id: "path-59",
        coordinates: [0.4529439762445791, 0.6096616711609455],
        distance: 0.012486621659961856,
      },
      {
        id: "path-32",
        coordinates: [0.4405990618330986, 0.5554858489558809],
        distance: 0.053169260392894935,
        isParent: true,
      },
      {
        id: "path-119",
        coordinates: [0.439888256610624, 0.6604078413803439],
        distance: 0.05175641988844646,
      },
    ],
  },
  {
    id: "path-59",
    coordinates: [0.4529439762445791, 0.6096616711609455],
    floor: 0,
    neighbors: [
      {
        id: "path-58",
        coordinates: [0.44049799856389993, 0.6086550132989763],
        distance: 0.012486621659961856,
        isParent: true,
      },
      {
        id: "path-60",
        coordinates: [0.4706794927539217, 0.5995950724052775],
        distance: 0.02039325762012481,
      },
    ],
  },
  {
    id: "path-60",
    coordinates: [0.4706794927539217, 0.5995950724052775],
    floor: 0,
    neighbors: [
      {
        id: "path-59",
        coordinates: [0.4529439762445791, 0.6096616711609455],
        distance: 0.02039325762012481,
        isParent: true,
      },
      {
        id: "path-61",
        coordinates: [0.4767469035668339, 0.6082523525033859],
        distance: 0.010571753528613314,
      },
      {
        id: "path-65",
        coordinates: [0.49712719208377787, 0.5774485558140073],
        distance: 0.034495637361409655,
      },
    ],
  },
  {
    id: "path-61",
    coordinates: [0.4767469035668339, 0.6082523525033859],
    floor: 0,
    neighbors: [
      {
        id: "path-60",
        coordinates: [0.4706794927539217, 0.5995950724052775],
        distance: 0.010571753528613314,
        isParent: true,
      },
      {
        id: "path-62",
        coordinates: [0.48094742472947244, 0.6181176200222597],
        distance: 0.01072230764605825,
      },
    ],
  },
  {
    id: "path-62",
    coordinates: [0.48094742472947244, 0.6181176200222597],
    floor: 0,
    neighbors: [
      {
        id: "path-61",
        coordinates: [0.4767469035668339, 0.6082523525033859],
        distance: 0.01072230764605825,
        isParent: true,
      },
      {
        id: "Ward-11",
        coordinates: [0.5196855366789288, 0.7042877182578023],
        distance: 0.09447712499505734,
      },
    ],
  },
  {
    id: "Ward-11",
    coordinates: [0.5196855366789288, 0.7042877182578023],
    floor: 0,
    neighbors: [
      {
        id: "path-62",
        coordinates: [0.48094742472947244, 0.6181176200222597],
        distance: 0.09447712499505734,
        isParent: true,
      },
      {
        id: "path-64",
        coordinates: [0.5271531160261812, 0.7185822948001234],
        distance: 0.01612760552071463,
      },
    ],
  },
  {
    id: "path-64",
    coordinates: [0.5271531160261812, 0.7185822948001234],
    floor: 0,
    neighbors: [
      {
        id: "Ward-11",
        coordinates: [0.5196855366789288, 0.7042877182578023],
        distance: 0.01612760552071463,
        isParent: true,
      },
    ],
  },
  {
    id: "path-65",
    coordinates: [0.49712719208377787, 0.5774485558140073],
    floor: 0,
    neighbors: [
      {
        id: "path-60",
        coordinates: [0.4706794927539217, 0.5995950724052775],
        distance: 0.034495637361409655,
        isParent: true,
      },
      {
        id: "path-33",
        coordinates: [0.4987009603493394, 0.5556611223598276],
        distance: 0.021844198384788592,
      },
    ],
  },
  {
    id: "path-66",
    coordinates: [0.38012067918299, 0.5335276313603505],
    floor: 0,
    neighbors: [
      {
        id: "path-8",
        coordinates: [0.3791014256875265, 0.5551978215211891],
        distance: 0.021694147120707937,
        isParent: true,
      },
      {
        id: "path-67",
        coordinates: [0.40732055905091064, 0.5129390453869116],
        distance: 0.03411338941258992,
      },
    ],
  },
  {
    id: "path-67",
    coordinates: [0.40732055905091064, 0.5129390453869116],
    floor: 0,
    neighbors: [
      {
        id: "path-66",
        coordinates: [0.38012067918299, 0.5335276313603505],
        distance: 0.03411338941258992,
        isParent: true,
      },
      {
        id: "path-68",
        coordinates: [0.4225114338049917, 0.5021798489602309],
        distance: 0.01861512781428252,
      },
      {
        id: "Ward-40",
        coordinates: [0.3560354550703801, 0.403731590642169],
        distance: 0.12065003133907107,
      },
    ],
  },
  {
    id: "path-68",
    coordinates: [0.4225114338049917, 0.5021798489602309],
    floor: 0,
    neighbors: [
      {
        id: "path-67",
        coordinates: [0.40732055905091064, 0.5129390453869116],
        distance: 0.01861512781428252,
        isParent: true,
      },
      {
        id: "path-118",
        coordinates: [0.4406568181098613, 0.501414039828366],
        distance: 0.01816153724765215,
      },
    ],
  },
  {
    id: "path-71",
    coordinates: [0.4541248745660318, 0.5012500420803085],
    floor: 0,
    neighbors: [
      {
        id: "path-72",
        coordinates: [0.47085536167529035, 0.5144001730143686],
        distance: 0.021279923460764363,
      },
      {
        id: "path-118",
        coordinates: [0.4406568181098613, 0.501414039828366],
        distance: 0.013469054902552135,
        isParent: true,
      },
    ],
  },
  {
    id: "path-72",
    coordinates: [0.47085536167529035, 0.5144001730143686],
    floor: 0,
    neighbors: [
      {
        id: "path-71",
        coordinates: [0.4541248745660318, 0.5012500420803085],
        distance: 0.021279923460764363,
        isParent: true,
      },
      {
        id: "path-73",
        coordinates: [0.4975420374248185, 0.5336604615472342],
        distance: 0.03291105250413135,
      },
      {
        id: "path-116",
        coordinates: [0.478841399588965, 0.49843063726653],
        distance: 0.017855051765820893,
      },
    ],
  },
  {
    id: "path-73",
    coordinates: [0.4975420374248185, 0.5336604615472342],
    floor: 0,
    neighbors: [
      {
        id: "path-72",
        coordinates: [0.47085536167529035, 0.5144001730143686],
        distance: 0.03291105250413135,
        isParent: true,
      },
      {
        id: "path-33",
        coordinates: [0.4987009603493394, 0.5556611223598276],
        distance: 0.02203116380347983,
      },
    ],
  },
  {
    id: "path-74",
    coordinates: [0.4410642498802048, 0.4456044517584083],
    floor: 0,
    neighbors: [
      {
        id: "path-75",
        coordinates: [0.44036416561303476, 0.38178260575041545],
        distance: 0.0638256856277243,
      },
      {
        id: "path-76",
        coordinates: [0.4300296229001135, 0.4452751450295618],
        distance: 0.011039539642187221,
      },
      {
        id: "path-118",
        coordinates: [0.4406568181098613, 0.501414039828366],
        distance: 0.05581107525559642,
        isParent: true,
      },
    ],
  },
  {
    id: "path-75",
    coordinates: [0.44036416561303476, 0.38178260575041545],
    floor: 0,
    neighbors: [
      {
        id: "path-74",
        coordinates: [0.4410642498802048, 0.4456044517584083],
        distance: 0.0638256856277243,
        isParent: true,
      },
      {
        id: "path-79",
        coordinates: [0.3920524377258308, 0.37899318068238497],
        distance: 0.048392188870285624,
      },
      {
        id: "path-80",
        coordinates: [0.48783674012820977, 0.3802908558595411],
        distance: 0.047496006661989665,
      },
      {
        id: "OP-Complex",
        coordinates: [0.44065608276981877, 0.363661758611521],
        distance: 0.018123198301006473,
      },
    ],
  },
  {
    id: "path-76",
    coordinates: [0.4300296229001135, 0.4452751450295618],
    floor: 0,
    neighbors: [
      {
        id: "path-74",
        coordinates: [0.4410642498802048, 0.4456044517584083],
        distance: 0.011039539642187221,
        isParent: true,
      },
      {
        id: "path-77",
        coordinates: [0.4303375474242529, 0.3889553987554282],
        distance: 0.056320588046427096,
      },
    ],
  },
  {
    id: "path-77",
    coordinates: [0.4303375474242529, 0.3889553987554282],
    floor: 0,
    neighbors: [
      {
        id: "path-76",
        coordinates: [0.4300296229001135, 0.4452751450295618],
        distance: 0.056320588046427096,
        isParent: true,
      },
      {
        id: "path-78",
        coordinates: [0.39379733480802126, 0.38775993316233726],
        distance: 0.03655976307395438,
      },
    ],
  },
  {
    id: "path-78",
    coordinates: [0.39379733480802126, 0.38775993316233726],
    floor: 0,
    neighbors: [
      {
        id: "path-77",
        coordinates: [0.4303375474242529, 0.3889553987554282],
        distance: 0.03655976307395438,
        isParent: true,
      },
      {
        id: "path-79",
        coordinates: [0.3920524377258308, 0.37899318068238497],
        distance: 0.008938714385871512,
      },
    ],
  },
  {
    id: "path-79",
    coordinates: [0.3920524377258308, 0.37899318068238497],
    floor: 0,
    neighbors: [
      {
        id: "path-78",
        coordinates: [0.39379733480802126, 0.38775993316233726],
        distance: 0.008938714385871512,
        isParent: true,
      },
      {
        id: "path-75",
        coordinates: [0.44036416561303476, 0.38178260575041545],
        distance: 0.048392188870285624,
        isParent: true,
      },
      {
        id: "path-85",
        coordinates: [0.3921404312267034, 0.3466529804701543],
        distance: 0.03234031992147512,
      },
    ],
  },
  {
    id: "path-80",
    coordinates: [0.48783674012820977, 0.3802908558595411],
    floor: 0,
    neighbors: [
      {
        id: "path-75",
        coordinates: [0.44036416561303476, 0.38178260575041545],
        distance: 0.047496006661989665,
        isParent: true,
      },
      {
        id: "path-81",
        coordinates: [0.48871178976235274, 0.31637151312900313],
        distance: 0.06392533212245509,
      },
    ],
  },
  {
    id: "path-81",
    coordinates: [0.48871178976235274, 0.31637151312900313],
    floor: 0,
    neighbors: [
      {
        id: "path-80",
        coordinates: [0.48783674012820977, 0.3802908558595411],
        distance: 0.06392533212245509,
        isParent: true,
      },
      {
        id: "path-82",
        coordinates: [0.4885763534805117, 0.2502133449962596],
        distance: 0.06615830676239232,
      },
    ],
  },
  {
    id: "path-82",
    coordinates: [0.4885763534805117, 0.2502133449962596],
    floor: 0,
    neighbors: [
      {
        id: "path-81",
        coordinates: [0.48871178976235274, 0.31637151312900313],
        distance: 0.06615830676239232,
        isParent: true,
      },
      {
        id: "path-83",
        coordinates: [0.48767034071185306, 0.15738756137337087],
        distance: 0.09283020502153556,
      },
    ],
  },
  {
    id: "path-83",
    coordinates: [0.48767034071185306, 0.15738756137337087],
    floor: 0,
    neighbors: [
      {
        id: "path-82",
        coordinates: [0.4885763534805117, 0.2502133449962596],
        distance: 0.09283020502153556,
        isParent: true,
      },
      {
        id: "path-84",
        coordinates: [0.5727697193921755, 0.15758889261016512],
        distance: 0.0850996168384078,
      },
    ],
  },
  {
    id: "path-84",
    coordinates: [0.5727697193921755, 0.15758889261016512],
    floor: 0,
    neighbors: [
      {
        id: "path-83",
        coordinates: [0.48767034071185306, 0.15738756137337087],
        distance: 0.0850996168384078,
        isParent: true,
      },
    ],
  },
  {
    id: "path-85",
    coordinates: [0.3921404312267034, 0.3466529804701543],
    floor: 0,
    neighbors: [
      {
        id: "path-79",
        coordinates: [0.3920524377258308, 0.37899318068238497],
        distance: 0.03234031992147512,
        isParent: true,
      },
      {
        id: "path-86",
        coordinates: [0.39199813931344535, 0.3030911726530022],
        distance: 0.043562040210337605,
      },
      {
        id: "path-90",
        coordinates: [0.36514950492866693, 0.3467758004464997],
        distance: 0.0269912057376588,
      },
    ],
  },
  {
    id: "path-86",
    coordinates: [0.39199813931344535, 0.3030911726530022],
    floor: 0,
    neighbors: [
      {
        id: "path-85",
        coordinates: [0.3921404312267034, 0.3466529804701543],
        distance: 0.043562040210337605,
        isParent: true,
      },
      {
        id: "path-87",
        coordinates: [0.39207592443725453, 0.24067825600506634],
        distance: 0.062412965119658256,
      },
    ],
  },
  {
    id: "path-87",
    coordinates: [0.39207592443725453, 0.24067825600506634],
    floor: 0,
    neighbors: [
      {
        id: "path-86",
        coordinates: [0.39199813931344535, 0.3030911726530022],
        distance: 0.062412965119658256,
        isParent: true,
      },
      {
        id: "path-88",
        coordinates: [0.3929315867318519, 0.21047845512356803],
        distance: 0.030211920350162156,
      },
    ],
  },
  {
    id: "path-88",
    coordinates: [0.3929315867318519, 0.21047845512356803],
    floor: 0,
    neighbors: [
      {
        id: "path-87",
        coordinates: [0.39207592443725453, 0.24067825600506634],
        distance: 0.030211920350162156,
        isParent: true,
      },
      {
        id: "path-89",
        coordinates: [0.39168698844513006, 0.16074945002161709],
        distance: 0.04974457732582692,
      },
    ],
  },
  {
    id: "path-89",
    coordinates: [0.39168698844513006, 0.16074945002161709],
    floor: 0,
    neighbors: [
      {
        id: "path-88",
        coordinates: [0.3929315867318519, 0.21047845512356803],
        distance: 0.04974457732582692,
        isParent: true,
      },
    ],
  },
  {
    id: "path-90",
    coordinates: [0.36514950492866693, 0.3467758004464997],
    floor: 0,
    neighbors: [
      {
        id: "path-85",
        coordinates: [0.3921404312267034, 0.3466529804701543],
        distance: 0.0269912057376588,
        isParent: true,
      },
      {
        id: "path-91",
        coordinates: [0.36406048207610275, 0.3260386041907871],
        distance: 0.02076577182098818,
      },
    ],
  },
  {
    id: "path-91",
    coordinates: [0.36406048207610275, 0.3260386041907871],
    floor: 0,
    neighbors: [
      {
        id: "path-90",
        coordinates: [0.36514950492866693, 0.3467758004464997],
        distance: 0.02076577182098818,
        isParent: true,
      },
      {
        id: "path-92",
        coordinates: [0.34585823667101767, 0.32553527609880156],
        distance: 0.01820920308402108,
      },
    ],
  },
  {
    id: "path-92",
    coordinates: [0.34585823667101767, 0.32553527609880156],
    floor: 0,
    neighbors: [
      {
        id: "path-91",
        coordinates: [0.36406048207610275, 0.3260386041907871],
        distance: 0.01820920308402108,
        isParent: true,
      },
      {
        id: "path-93",
        coordinates: [0.3446136383842959, 0.32070330627976384],
        distance: 0.004989685082988929,
      },
    ],
  },
  {
    id: "path-93",
    coordinates: [0.3446136383842959, 0.32070330627976384],
    floor: 0,
    neighbors: [
      {
        id: "path-92",
        coordinates: [0.34585823667101767, 0.32553527609880156],
        distance: 0.004989685082988929,
        isParent: true,
      },
      {
        id: "path-94",
        coordinates: [0.3076646400377481, 0.32191129705652527],
        distance: 0.036968739774705994,
      },
    ],
  },
  {
    id: "path-94",
    coordinates: [0.3076646400377481, 0.32191129705652527],
    floor: 0,
    neighbors: [
      {
        id: "path-93",
        coordinates: [0.3446136383842959, 0.32070330627976384],
        distance: 0.036968739774705994,
        isParent: true,
      },
      {
        id: "path-95",
        coordinates: [0.3069645544739432, 0.2991607817208783],
        distance: 0.022761284406512663,
      },
    ],
  },
  {
    id: "path-95",
    coordinates: [0.3069645544739432, 0.2991607817208783],
    floor: 0,
    neighbors: [
      {
        id: "path-94",
        coordinates: [0.3076646400377481, 0.32191129705652527],
        distance: 0.022761284406512663,
        isParent: true,
      },
      {
        id: "path-96",
        coordinates: [0.27810544110118307, 0.2973487989117322],
        distance: 0.02891594207980201,
      },
    ],
  },
  {
    id: "path-96",
    coordinates: [0.27810544110118307, 0.2973487989117322],
    floor: 0,
    neighbors: [
      {
        id: "path-95",
        coordinates: [0.3069645544739432, 0.2991607817208783],
        distance: 0.02891594207980201,
        isParent: true,
      },
      {
        id: "path-97",
        coordinates: [0.27784450993346993, 0.26636344424362046],
        distance: 0.030986453314036426,
      },
    ],
  },
  {
    id: "path-97",
    coordinates: [0.27784450993346993, 0.26636344424362046],
    floor: 0,
    neighbors: [
      {
        id: "path-96",
        coordinates: [0.27810544110118307, 0.2973487989117322],
        distance: 0.030986453314036426,
        isParent: true,
      },
      {
        id: "path-98",
        coordinates: [0.2659381463276768, 0.2664962744305041],
        distance: 0.011907104525110306,
      },
      {
        id: "path-99",
        coordinates: [0.27804978610588316, 0.24418090599116998],
        distance: 0.022183488040170538,
      },
    ],
  },
  {
    id: "path-98",
    coordinates: [0.2659381463276768, 0.2664962744305041],
    floor: 0,
    neighbors: [
      {
        id: "path-97",
        coordinates: [0.27784450993346993, 0.26636344424362046],
        distance: 0.011907104525110306,
        isParent: true,
      },
    ],
  },
  {
    id: "path-99",
    coordinates: [0.27804978610588316, 0.24418090599116998],
    floor: 0,
    neighbors: [
      {
        id: "path-97",
        coordinates: [0.27784450993346993, 0.26636344424362046],
        distance: 0.022183488040170538,
        isParent: true,
      },
      {
        id: "path-100",
        coordinates: [0.27754509978265646, 0.23771745000974132],
        distance: 0.006483129761829397,
      },
    ],
  },
  {
    id: "path-100",
    coordinates: [0.27754509978265646, 0.23771745000974132],
    floor: 0,
    neighbors: [
      {
        id: "path-99",
        coordinates: [0.27804978610588316, 0.24418090599116998],
        distance: 0.006483129761829397,
        isParent: true,
      },
      {
        id: "path-101",
        coordinates: [0.26874178209929545, 0.23833089377651565],
        distance: 0.008824665177170801,
      },
      {
        id: "path-102",
        coordinates: [0.2769356410295168, 0.2196646706673664],
        distance: 0.018063064024585015,
      },
    ],
  },
  {
    id: "path-101",
    coordinates: [0.26874178209929545, 0.23833089377651565],
    floor: 0,
    neighbors: [
      {
        id: "path-100",
        coordinates: [0.27754509978265646, 0.23771745000974132],
        distance: 0.008824665177170801,
        isParent: true,
      },
    ],
  },
  {
    id: "path-102",
    coordinates: [0.2769356410295168, 0.2196646706673664],
    floor: 0,
    neighbors: [
      {
        id: "path-100",
        coordinates: [0.27754509978265646, 0.23771745000974132],
        distance: 0.018063064024585015,
        isParent: true,
      },
      {
        id: "path-103",
        coordinates: [0.2835042690927911, 0.2182625126514353],
        distance: 0.006716615348170124,
      },
    ],
  },
  {
    id: "path-103",
    coordinates: [0.2835042690927911, 0.2182625126514353],
    floor: 0,
    neighbors: [
      {
        id: "path-102",
        coordinates: [0.2769356410295168, 0.2196646706673664],
        distance: 0.006716615348170124,
        isParent: true,
      },
      {
        id: "path-104",
        coordinates: [0.28343655546701535, 0.1943381999041088],
        distance: 0.023924408572982614,
      },
    ],
  },
  {
    id: "path-104",
    coordinates: [0.28343655546701535, 0.1943381999041088],
    floor: 0,
    neighbors: [
      {
        id: "path-103",
        coordinates: [0.2835042690927911, 0.2182625126514353],
        distance: 0.023924408572982614,
        isParent: true,
      },
      {
        id: "path-105",
        coordinates: [0.2745655173851615, 0.19468873940809156],
        distance: 0.008877961173239822,
      },
      {
        id: "path-106",
        coordinates: [0.2842971561952798, 0.17257598513579994],
        distance: 0.021779224624294814,
      },
    ],
  },
  {
    id: "path-105",
    coordinates: [0.2745655173851615, 0.19468873940809156],
    floor: 0,
    neighbors: [
      {
        id: "path-104",
        coordinates: [0.28343655546701535, 0.1943381999041088],
        distance: 0.008877961173239822,
        isParent: true,
      },
    ],
  },
  {
    id: "path-106",
    coordinates: [0.2842971561952798, 0.17257598513579994],
    floor: 0,
    neighbors: [
      {
        id: "path-104",
        coordinates: [0.28343655546701535, 0.1943381999041088],
        distance: 0.021779224624294814,
        isParent: true,
      },
      {
        id: "path-107",
        coordinates: [0.2995906724574072, 0.1727088153226836],
        distance: 0.015294093092383868,
      },
    ],
  },
  {
    id: "path-107",
    coordinates: [0.2995906724574072, 0.1727088153226836],
    floor: 0,
    neighbors: [
      {
        id: "path-106",
        coordinates: [0.2842971561952798, 0.17257598513579994],
        distance: 0.015294093092383868,
        isParent: true,
      },
      {
        id: "path-108",
        coordinates: [0.3038365426924003, 0.17289047302385],
        distance: 0.004249754530886829,
      },
    ],
  },
  {
    id: "path-108",
    coordinates: [0.3038365426924003, 0.17289047302385],
    floor: 0,
    neighbors: [
      {
        id: "path-107",
        coordinates: [0.2995906724574072, 0.1727088153226836],
        distance: 0.004249754530886829,
        isParent: true,
      },
      {
        id: "path-109",
        coordinates: [0.3053263372775063, 0.15439952039708316],
        distance: 0.018550871056399118,
      },
    ],
  },
  {
    id: "path-109",
    coordinates: [0.3053263372775063, 0.15439952039708316],
    floor: 0,
    neighbors: [
      {
        id: "path-108",
        coordinates: [0.3038365426924003, 0.17289047302385],
        distance: 0.018550871056399118,
        isParent: true,
      },
      {
        id: "path-110",
        coordinates: [0.33315836451420233, 0.15194574532998595],
        distance: 0.027939984827914592,
      },
    ],
  },
  {
    id: "path-110",
    coordinates: [0.33315836451420233, 0.15194574532998595],
    floor: 0,
    neighbors: [
      {
        id: "path-109",
        coordinates: [0.3053263372775063, 0.15439952039708316],
        distance: 0.027939984827914592,
        isParent: true,
      },
      {
        id: "path-111",
        coordinates: [0.3332938007960433, 0.10462292836091605],
        distance: 0.04732301077567369,
      },
    ],
  },
  {
    id: "path-111",
    coordinates: [0.3332938007960433, 0.10462292836091605],
    floor: 0,
    neighbors: [
      {
        id: "path-110",
        coordinates: [0.33315836451420233, 0.15194574532998595],
        distance: 0.04732301077567369,
        isParent: true,
      },
      {
        id: "path-112",
        coordinates: [0.3647148782136635, 0.10409712129611509],
        distance: 0.031425476593895524,
      },
    ],
  },
  {
    id: "path-112",
    coordinates: [0.3647148782136635, 0.10409712129611509],
    floor: 0,
    neighbors: [
      {
        id: "path-111",
        coordinates: [0.3332938007960433, 0.10462292836091605],
        distance: 0.031425476593895524,
        isParent: true,
      },
    ],
  },
  {
    id: "OP-Complex",
    coordinates: [0.44065608276981877, 0.363661758611521],
    floor: 0,
    neighbors: [
      {
        id: "path-75",
        coordinates: [0.44036416561303476, 0.38178260575041545],
        distance: 0.018123198301006473,
        isParent: true,
      },
    ],
  },
  {
    id: "Ward-40",
    coordinates: [0.3560354550703801, 0.403731590642169],
    floor: 0,
    neighbors: [
      {
        id: "path-67",
        coordinates: [0.40732055905091064, 0.5129390453869116],
        distance: 0.12065003133907107,
        isParent: true,
      },
      {
        id: "path-115",
        coordinates: [0.3517692302529682, 0.3952310073053914],
        distance: 0.009511077292199997,
      },
    ],
  },
  {
    id: "path-115",
    coordinates: [0.3517692302529682, 0.3952310073053914],
    floor: 0,
    neighbors: [
      {
        id: "Ward-40",
        coordinates: [0.3560354550703801, 0.403731590642169],
        distance: 0.009511077292199997,
        isParent: true,
      },
    ],
  },
  {
    id: "path-116",
    coordinates: [0.478841399588965, 0.49843063726653],
    floor: 0,
    neighbors: [
      {
        id: "path-72",
        coordinates: [0.47085536167529035, 0.5144001730143686],
        distance: 0.017855051765820893,
        isParent: true,
      },
      {
        id: "Ward-30",
        coordinates: [0.5205792655882535, 0.40535614845047707],
        distance: 0.10200446032671376,
      },
    ],
  },
  {
    id: "Ward-30",
    coordinates: [0.5205792655882535, 0.40535614845047707],
    floor: 0,
    neighbors: [
      {
        id: "path-116",
        coordinates: [0.478841399588965, 0.49843063726653],
        distance: 0.10200446032671376,
        isParent: true,
      },
    ],
  },
  {
    id: "path-118",
    coordinates: [0.4406568181098613, 0.501414039828366],
    floor: 0,
    neighbors: [
      {
        id: "path-68",
        coordinates: [0.4225114338049917, 0.5021798489602309],
        distance: 0.01816153724765215,
        isParent: true,
      },
      {
        id: "path-71",
        coordinates: [0.4541248745660318, 0.5012500420803085],
        distance: 0.013469054902552135,
      },
      {
        id: "path-74",
        coordinates: [0.4410642498802048, 0.4456044517584083],
        distance: 0.05581107525559642,
      },
      {
        id: "path-32",
        coordinates: [0.4405990618330986, 0.5554858489558809],
        distance: 0.05407183997340868,
      },
    ],
  },
  {
    id: "path-119",
    coordinates: [0.439888256610624, 0.6604078413803439],
    floor: 0,
    neighbors: [
      {
        id: "path-58",
        coordinates: [0.44049799856389993, 0.6086550132989763],
        distance: 0.05175641988844646,
        isParent: true,
      },
      {
        id: "path-120",
        coordinates: [0.4399957677165946, 0.7002338532537894],
        distance: 0.03982615698735854,
      },
    ],
  },
  {
    id: "path-120",
    coordinates: [0.4399957677165946, 0.7002338532537894],
    floor: 0,
    neighbors: [
      {
        id: "path-119",
        coordinates: [0.439888256610624, 0.6604078413803439],
        distance: 0.03982615698735854,
        isParent: true,
      },
      {
        id: "path-121",
        coordinates: [0.43946889915266624, 0.7134437913551404],
        distance: 0.013220440806765096,
      },
    ],
  },
  {
    id: "path-121",
    coordinates: [0.43946889915266624, 0.7134437913551404],
    floor: 0,
    neighbors: [
      {
        id: "path-120",
        coordinates: [0.4399957677165946, 0.7002338532537894],
        distance: 0.013220440806765096,
        isParent: true,
      },
    ],
  },
  {
    id: "staircase-1-base",
    coordinates: [0.4230901870468298, 0.6793340556308836],
    floor: -1,
    neighbors: [
      {
        id: "path-123",
        coordinates: [0.42287529799335816, 0.6581991218227421],
        distance: 0.021136026220172587,
      },
      {
        id: "staircase-1",
        coordinates: [0.28660421180257967, 0.5716460087078428],
        floor: 0,
        distance: 0.134,
      },
    ],
  },
  {
    id: "path-123",
    coordinates: [0.42287529799335816, 0.6581991218227421],
    floor: -1,
    neighbors: [
      {
        id: "path-122",
        coordinates: [0.4230901870468298, 0.6793340556308836],
        distance: 0.021136026220172587,
        isParent: true,
      },
      {
        id: "path-124",
        coordinates: [0.42384229873398077, 0.6310852323939214],
        distance: 0.027131127702155634,
      },
      {
        id: "path-180",
        coordinates: [0.4099768628446063, 0.6562100929373916],
        distance: 0.013050895187431211,
      },
      {
        id: "path-183",
        coordinates: [0.43522627945584336, 0.6581567308814797],
        distance: 0.012351054209198265,
      },
    ],
  },
  {
    id: "path-124",
    coordinates: [0.42384229873398077, 0.6310852323939214],
    floor: -1,
    neighbors: [
      {
        id: "path-123",
        coordinates: [0.42287529799335816, 0.6581991218227421],
        distance: 0.027131127702155634,
        isParent: true,
      },
      {
        id: "path-125",
        coordinates: [0.46073243785924795, 0.6291434850725991],
        distance: 0.036941206630826645,
      },
      {
        id: "path-151",
        coordinates: [0.3827004445618111, 0.6280642136720467],
        distance: 0.041252620751195804,
      },
      {
        id: "path-177",
        coordinates: [0.4234074035283541, 0.6212426055409896],
        distance: 0.009852230062576251,
      },
    ],
  },
  {
    id: "path-125",
    coordinates: [0.46073243785924795, 0.6291434850725991],
    floor: -1,
    neighbors: [
      {
        id: "path-124",
        coordinates: [0.42384229873398077, 0.6310852323939214],
        distance: 0.036941206630826645,
        isParent: true,
      },
      {
        id: "path-126",
        coordinates: [0.4712232310295989, 0.6293032068211007],
        distance: 0.010492008977313479,
      },
      {
        id: "path-186",
        coordinates: [0.4604756960670804, 0.6416103083567299],
        distance: 0.012469466674464968,
      },
    ],
  },
  {
    id: "path-126",
    coordinates: [0.4712232310295989, 0.6293032068211007],
    floor: -1,
    neighbors: [
      {
        id: "path-125",
        coordinates: [0.46073243785924795, 0.6291434850725991],
        distance: 0.010492008977313479,
        isParent: true,
      },
      {
        id: "path-127",
        coordinates: [0.4883787699353494, 0.6301018108887348],
        distance: 0.017174116676078592,
      },
      {
        id: "path-187",
        coordinates: [0.47057545642201676, 0.6409150790660862],
        distance: 0.01162992643898029,
      },
    ],
  },
  {
    id: "path-127",
    coordinates: [0.4883787699353494, 0.6301018108887348],
    floor: -1,
    neighbors: [
      {
        id: "path-126",
        coordinates: [0.4712232310295989, 0.6293032068211007],
        distance: 0.017174116676078592,
        isParent: true,
      },
      {
        id: "path-128",
        coordinates: [0.5383643196020141, 0.6324976324413855],
        distance: 0.050042932931541426,
      },
      {
        id: "path-188",
        coordinates: [0.48808888283216856, 0.6215877403961899],
        distance: 0.008519004101690228,
      },
    ],
  },
  {
    id: "path-128",
    coordinates: [0.5383643196020141, 0.6324976324413855],
    floor: -1,
    neighbors: [
      {
        id: "path-127",
        coordinates: [0.4883787699353494, 0.6301018108887348],
        distance: 0.050042932931541426,
        isParent: true,
      },
      {
        id: "path-129",
        coordinates: [0.5577414428278331, 0.6312198631282464],
        distance: 0.019419206959249723,
      },
      {
        id: "path-190",
        coordinates: [0.5386951574365992, 0.6443912163624478],
        distance: 0.011898184406040494,
      },
    ],
  },
  {
    id: "path-129",
    coordinates: [0.5577414428278331, 0.6312198631282464],
    floor: -1,
    neighbors: [
      {
        id: "path-128",
        coordinates: [0.5383643196020141, 0.6324976324413855],
        distance: 0.019419206959249723,
        isParent: true,
      },
      {
        id: "path-130",
        coordinates: [0.5789698718707648, 0.6316990283737514],
        distance: 0.021233836181040952,
      },
      {
        id: "path-191",
        coordinates: [0.5555639166863359, 0.6201972838497596],
        distance: 0.01123560741782263,
      },
    ],
  },
  {
    id: "path-130",
    coordinates: [0.5789698718707648, 0.6316990283737514],
    floor: -1,
    neighbors: [
      {
        id: "path-129",
        coordinates: [0.5577414428278331, 0.6312198631282464],
        distance: 0.021233836181040952,
        isParent: true,
      },
      {
        id: "path-131",
        coordinates: [0.5934101410519874, 0.6302615326372365],
        distance: 0.014511642498996011,
      },
      {
        id: "path-192",
        coordinates: [0.5782346740902501, 0.6434178994252608],
        distance: 0.011741910172471117,
      },
    ],
  },
  {
    id: "path-131",
    coordinates: [0.5934101410519874, 0.6302615326372365],
    floor: -1,
    neighbors: [
      {
        id: "path-130",
        coordinates: [0.5789698718707648, 0.6316990283737514],
        distance: 0.014511642498996011,
        isParent: true,
      },
      {
        id: "path-132",
        coordinates: [0.6117998862440817, 0.6302615326372365],
        distance: 0.018389745192094242,
      },
      {
        id: "path-193",
        coordinates: [0.5922024311181188, 0.6181116000475425],
        distance: 0.012209808566004348,
      },
    ],
  },
  {
    id: "path-132",
    coordinates: [0.6117998862440817, 0.6302615326372365],
    floor: -1,
    neighbors: [
      {
        id: "path-131",
        coordinates: [0.5934101410519874, 0.6302615326372365],
        distance: 0.018389745192094242,
        isParent: true,
      },
      {
        id: "path-133",
        coordinates: [0.6343859501492773, 0.6313795848767481],
        distance: 0.022613719807671184,
      },
      {
        id: "path-194",
        coordinates: [0.6104679692154215, 0.6203363256381739],
        distance: 0.010014176798193492,
      },
    ],
  },
  {
    id: "path-133",
    coordinates: [0.6343859501492773, 0.6313795848767481],
    floor: -1,
    neighbors: [
      {
        id: "path-132",
        coordinates: [0.6117998862440817, 0.6302615326372365],
        distance: 0.022613719807671184,
        isParent: true,
      },
      {
        id: "path-134",
        coordinates: [0.6501838541927639, 0.6297823673917315],
        distance: 0.015878440599178874,
      },
      {
        id: "path-195",
        coordinates: [0.6334610539099848, 0.6231172366961774],
        distance: 0.008313953963694864,
      },
    ],
  },
  {
    id: "path-134",
    coordinates: [0.6501838541927639, 0.6297823673917315],
    floor: -1,
    neighbors: [
      {
        id: "path-133",
        coordinates: [0.6343859501492773, 0.6313795848767481],
        distance: 0.015878440599178874,
        isParent: true,
      },
      {
        id: "path-135",
        coordinates: [0.6744978206259711, 0.6307406978827415],
        distance: 0.02433284531338503,
      },
      {
        id: "path-197",
        coordinates: [0.6492553678923629, 0.6466159378833647],
        distance: 0.016859157224096772,
      },
    ],
  },
  {
    id: "path-135",
    coordinates: [0.6744978206259711, 0.6307406978827415],
    floor: -1,
    neighbors: [
      {
        id: "path-134",
        coordinates: [0.6501838541927639, 0.6297823673917315],
        distance: 0.02433284531338503,
        isParent: true,
      },
      {
        id: "path-136",
        coordinates: [0.6910362455513417, 0.6304212543857382],
        distance: 0.01654150970014217,
      },
      {
        id: "path-198",
        coordinates: [0.6741824477786132, 0.6448083457974052],
        distance: 0.01407118253324126,
      },
      {
        id: "path-199",
        coordinates: [0.6736838105339558, 0.6187226602874728],
        distance: 0.012045573463774708,
      },
    ],
  },
  {
    id: "path-136",
    coordinates: [0.6910362455513417, 0.6304212543857382],
    floor: -1,
    neighbors: [
      {
        id: "path-135",
        coordinates: [0.6744978206259711, 0.6307406978827415],
        distance: 0.01654150970014217,
        isParent: true,
      },
      {
        id: "path-137",
        coordinates: [0.7033783589884163, 0.6301018108887348],
        distance: 0.012346246726896184,
      },
      {
        id: "path-201",
        coordinates: [0.6911749897237315, 0.6177542904579751],
        distance: 0.012667723753406584,
      },
    ],
  },
  {
    id: "path-137",
    coordinates: [0.7033783589884163, 0.6301018108887348],
    floor: -1,
    neighbors: [
      {
        id: "path-136",
        coordinates: [0.6910362455513417, 0.6304212543857382],
        distance: 0.012346246726896184,
        isParent: true,
      },
      {
        id: "path-138",
        coordinates: [0.7257175838037849, 0.6297823720666057],
        distance: 0.022341508599749167,
      },
      {
        id: "path-202",
        coordinates: [0.7028669544813395, 0.6173911528790672],
        distance: 0.012720941852260255,
      },
    ],
  },
  {
    id: "path-138",
    coordinates: [0.7257175838037849, 0.6297823720666057],
    floor: -1,
    neighbors: [
      {
        id: "path-137",
        coordinates: [0.7033783589884163, 0.6301018108887348],
        distance: 0.022341508599749167,
        isParent: true,
      },
      {
        id: "path-139",
        coordinates: [0.7301607452191161, 0.6299420938151074],
        distance: 0.00444603130889024,
      },
      {
        id: "path-203",
        coordinates: [0.7260670960041575, 0.6182589833489054],
        distance: 0.011528687970338694,
      },
    ],
  },
  {
    id: "path-139",
    coordinates: [0.7301607452191161, 0.6299420938151074],
    floor: -1,
    neighbors: [
      {
        id: "path-138",
        coordinates: [0.7257175838037849, 0.6297823720666057],
        distance: 0.00444603130889024,
        isParent: true,
      },
      {
        id: "path-140",
        coordinates: [0.7344804852833325, 0.6299420938151074],
        distance: 0.004319740064216426,
      },
      {
        id: "path-205",
        coordinates: [0.7301384750831266, 0.6462892260934019],
        distance: 0.016347147447888767,
      },
    ],
  },
  {
    id: "path-140",
    coordinates: [0.7344804852833325, 0.6299420938151074],
    floor: -1,
    neighbors: [
      {
        id: "path-139",
        coordinates: [0.7301607452191161, 0.6299420938151074],
        distance: 0.004319740064216426,
        isParent: true,
      },
      {
        id: "path-141",
        coordinates: [0.7495378539953242, 0.6302615326372365],
        distance: 0.015060756743601893,
      },
      {
        id: "path-204",
        coordinates: [0.7338841408804899, 0.6181536062935702],
        distance: 0.01180356152575311,
      },
    ],
  },
  {
    id: "path-141",
    coordinates: [0.7495378539953242, 0.6302615326372365],
    floor: -1,
    neighbors: [
      {
        id: "path-140",
        coordinates: [0.7344804852833325, 0.6299420938151074],
        distance: 0.015060756743601893,
        isParent: true,
      },
      {
        id: "path-142",
        coordinates: [0.7569431206126079, 0.6296226456432299],
        distance: 0.007432775407892197,
      },
      {
        id: "path-206",
        coordinates: [0.7499253740226347, 0.6163622009792719],
        distance: 0.013904732730608842,
      },
    ],
  },
  {
    id: "path-142",
    coordinates: [0.7569431206126079, 0.6296226456432299],
    floor: -1,
    neighbors: [
      {
        id: "path-141",
        coordinates: [0.7495378539953242, 0.6302615326372365],
        distance: 0.007432775407892197,
        isParent: true,
      },
      {
        id: "path-143",
        coordinates: [0.7673104996566494, 0.6296226456432299],
        distance: 0.010367379044041503,
      },
      {
        id: "path-207",
        coordinates: [0.7568467163119148, 0.6149923023441809],
        distance: 0.014630660915940197,
      },
      {
        id: "path-208",
        coordinates: [0.7582309876297273, 0.6499774168616006],
        distance: 0.020395472850757747,
      },
    ],
  },
  {
    id: "path-143",
    coordinates: [0.7673104996566494, 0.6296226456432299],
    floor: -1,
    neighbors: [
      {
        id: "path-142",
        coordinates: [0.7569431206126079, 0.6296226456432299],
        distance: 0.010367379044041503,
        isParent: true,
      },
      {
        id: "path-144",
        coordinates: [0.7866876120452602, 0.6297823720666057],
        distance: 0.019377770693533757,
      },
      {
        id: "path-209",
        coordinates: [0.7666180241948031, 0.6123578805872009],
        distance: 0.017278646784547116,
      },
    ],
  },
  {
    id: "path-144",
    coordinates: [0.7866876120452602, 0.6297823720666057],
    floor: -1,
    neighbors: [
      {
        id: "path-143",
        coordinates: [0.7673104996566494, 0.6296226456432299],
        distance: 0.019377770693533757,
        isParent: true,
      },
      {
        id: "path-145",
        coordinates: [0.7971784088280138, 0.6297823720666057],
        distance: 0.010490796782753664,
      },
      {
        id: "path-210",
        coordinates: [0.7869691202862483, 0.6897041633028698],
        distance: 0.05992245248529267,
      },
    ],
  },
  {
    id: "path-145",
    coordinates: [0.7971784088280138, 0.6297823720666057],
    floor: -1,
    neighbors: [
      {
        id: "path-144",
        coordinates: [0.7866876120452602, 0.6297823720666057],
        distance: 0.010490796782753664,
        isParent: true,
      },
      {
        id: "path-146",
        coordinates: [0.8049539394986422, 0.630101815563609],
        distance: 0.00778208978087897,
      },
      {
        id: "path-213",
        coordinates: [0.7976733711274132, 0.6434823935469203],
        distance: 0.013708959706662917,
      },
    ],
  },
  {
    id: "path-146",
    coordinates: [0.8049539394986422, 0.630101815563609],
    floor: -1,
    neighbors: [
      {
        id: "path-145",
        coordinates: [0.7971784088280138, 0.6297823720666057],
        distance: 0.00778208978087897,
        isParent: true,
      },
      {
        id: "path-147",
        coordinates: [0.8185302664468659, 0.6291434897474733],
        distance: 0.013610108073594994,
      },
      {
        id: "path-212",
        coordinates: [0.8046761435245676, 0.6401103339447272],
        distance: 0.010012372885005437,
      },
    ],
  },
  {
    id: "path-147",
    coordinates: [0.8185302664468659, 0.6291434897474733],
    floor: -1,
    neighbors: [
      {
        id: "path-146",
        coordinates: [0.8049539394986422, 0.630101815563609],
        distance: 0.013610108073594994,
        isParent: true,
      },
      {
        id: "path-148",
        coordinates: [0.8287742205273898, 0.6302615373121107],
        distance: 0.010304786536395322,
      },
      {
        id: "path-214",
        coordinates: [0.817785978581933, 0.6471705843151189],
        distance: 0.01804245279824017,
      },
    ],
  },
  {
    id: "path-148",
    coordinates: [0.8287742205273898, 0.6302615373121107],
    floor: -1,
    neighbors: [
      {
        id: "path-147",
        coordinates: [0.8185302664468659, 0.6291434897474733],
        distance: 0.010304786536395322,
        isParent: true,
      },
      {
        id: "path-149",
        coordinates: [0.8470405443683691, 0.6304212590606123],
        distance: 0.018267022135544472,
      },
      {
        id: "path-215",
        coordinates: [0.8293486964055197, 0.6480135976735338],
        distance: 0.017761353259539807,
      },
    ],
  },
  {
    id: "path-149",
    coordinates: [0.8470405443683691, 0.6304212590606123],
    floor: -1,
    neighbors: [
      {
        id: "path-148",
        coordinates: [0.8287742205273898, 0.6302615373121107],
        distance: 0.018267022135544472,
        isParent: true,
      },
      {
        id: "path-150",
        coordinates: [0.8550629177412272, 0.6310601460546189],
        distance: 0.008047773053749367,
      },
      {
        id: "path-216",
        coordinates: [0.8472627624463461, 0.6441146558789316],
        distance: 0.013695199790369475,
      },
      {
        id: "path-220",
        coordinates: [0.8477513240272153, 0.6192457190114911],
        distance: 0.011198120516985986,
      },
    ],
  },
  {
    id: "path-150",
    coordinates: [0.8550629177412272, 0.6310601460546189],
    floor: -1,
    neighbors: [
      {
        id: "path-149",
        coordinates: [0.8470405443683691, 0.6304212590606123],
        distance: 0.008047773053749367,
        isParent: true,
      },
      {
        id: "path-217",
        coordinates: [0.8544283879093578, 0.646327570956704],
        distance: 0.015280605068135899,
      },
      {
        id: "path-218",
        coordinates: [0.8616754410969468, 0.6308371731229631],
        distance: 0.006616281588489748,
      },
    ],
  },
  {
    id: "path-151",
    coordinates: [0.3827004445618111, 0.6280642136720467],
    floor: -1,
    neighbors: [
      {
        id: "path-124",
        coordinates: [0.42384229873398077, 0.6310852323939214],
        distance: 0.041252620751195804,
        isParent: true,
      },
      {
        id: "path-152",
        coordinates: [0.373814128955954, 0.6295017070711244],
        distance: 0.009001832720023842,
      },
      {
        id: "path-175",
        coordinates: [0.3826859970806089, 0.6451584463374205],
        distance: 0.017094238770639824,
      },
      {
        id: "path-176",
        coordinates: [0.3818264471562805, 0.6084504089765732],
        distance: 0.01963326784050611,
      },
    ],
  },
  {
    id: "path-152",
    coordinates: [0.373814128955954, 0.6295017070711244],
    floor: -1,
    neighbors: [
      {
        id: "path-151",
        coordinates: [0.3827004445618111, 0.6280642136720467],
        distance: 0.009001832720023842,
        isParent: true,
      },
      {
        id: "path-153",
        coordinates: [0.35468385204476766, 0.6314183633782701],
        distance: 0.01922605175532384,
      },
      {
        id: "path-174",
        coordinates: [0.37452023191735945, 0.6454365380536778],
        distance: 0.015950467699558234,
      },
    ],
  },
  {
    id: "path-153",
    coordinates: [0.35468385204476766, 0.6314183633782701],
    floor: -1,
    neighbors: [
      {
        id: "path-152",
        coordinates: [0.373814128955954, 0.6295017070711244],
        distance: 0.01922605175532384,
        isParent: true,
      },
      {
        id: "path-154",
        coordinates: [0.31926198929803773, 0.631897528623775],
        distance: 0.03542510352533459,
      },
      {
        id: "path-172",
        coordinates: [0.3541964793883905, 0.6218853876888264],
        distance: 0.009545426004202646,
      },
    ],
  },
  {
    id: "path-154",
    coordinates: [0.31926198929803773, 0.631897528623775],
    floor: -1,
    neighbors: [
      {
        id: "path-153",
        coordinates: [0.35468385204476766, 0.6314183633782701],
        distance: 0.03542510352533459,
        isParent: true,
      },
      {
        id: "path-155",
        coordinates: [0.3000082982605419, 0.6330155761884124],
        distance: 0.019286125814277473,
      },
      {
        id: "path-171",
        coordinates: [0.3180426411750229, 0.6450682951407037],
        distance: 0.01322708964544168,
      },
    ],
  },
  {
    id: "path-155",
    coordinates: [0.3000082982605419, 0.6330155761884124],
    floor: -1,
    neighbors: [
      {
        id: "path-154",
        coordinates: [0.31926198929803773, 0.631897528623775],
        distance: 0.019286125814277473,
        isParent: true,
      },
      {
        id: "path-156",
        coordinates: [0.28853013428127167, 0.6322169674459042],
        distance: 0.011505912578262825,
      },
      {
        id: "path-170",
        coordinates: [0.3006171367150658, 0.6440145276716185],
        distance: 0.011015789485716762,
      },
    ],
  },
  {
    id: "path-156",
    coordinates: [0.28853013428127167, 0.6322169674459042],
    floor: -1,
    neighbors: [
      {
        id: "path-155",
        coordinates: [0.3000082982605419, 0.6330155761884124],
        distance: 0.011505912578262825,
        isParent: true,
      },
      {
        id: "path-157",
        coordinates: [0.28075460361064325, 0.6314183633782701],
        distance: 0.007816434332016417,
      },
      {
        id: "path-168",
        coordinates: [0.28824015117889507, 0.647597341384482],
        distance: 0.015383107380830053,
      },
    ],
  },
  {
    id: "path-157",
    coordinates: [0.28075460361064325, 0.6314183633782701],
    floor: -1,
    neighbors: [
      {
        id: "path-156",
        coordinates: [0.28853013428127167, 0.6322169674459042],
        distance: 0.007816434332016417,
        isParent: true,
      },
      {
        id: "path-158",
        coordinates: [0.2719917057434983, 0.6334947414339174],
        distance: 0.00900553856579313,
      },
      {
        id: "path-169",
        coordinates: [0.2804230991526717, 0.6227284025893749],
        distance: 0.008696281602972073,
      },
    ],
  },
  {
    id: "path-158",
    coordinates: [0.2719917057434983, 0.6334947414339174],
    floor: -1,
    neighbors: [
      {
        id: "path-157",
        coordinates: [0.28075460361064325, 0.6314183633782701],
        distance: 0.00900553856579313,
        isParent: true,
      },
      {
        id: "path-159",
        coordinates: [0.23175642655909923, 0.6322169721207783],
        distance: 0.040255563410094466,
      },
      {
        id: "path-167",
        coordinates: [0.2714660685155555, 0.646122065694056],
        distance: 0.012638259867010315,
      },
    ],
  },
  {
    id: "path-159",
    coordinates: [0.23175642655909923, 0.6322169721207783],
    floor: -1,
    neighbors: [
      {
        id: "path-158",
        coordinates: [0.2719917057434983, 0.6334947414339174],
        distance: 0.040255563410094466,
        isParent: true,
      },
      {
        id: "path-160",
        coordinates: [0.21855036366422032, 0.6326961373662833],
        distance: 0.013214752987324335,
      },
      {
        id: "path-166",
        coordinates: [0.23221798153484827, 0.6566597496377092],
        distance: 0.02444713491879615,
      },
    ],
  },
  {
    id: "path-160",
    coordinates: [0.21855036366422032, 0.6326961373662833],
    floor: -1,
    neighbors: [
      {
        id: "path-159",
        coordinates: [0.23175642655909923, 0.6322169721207783],
        distance: 0.013214752987324335,
        isParent: true,
      },
      {
        id: "path-161",
        coordinates: [0.19473008624787552, 0.6314183633782701],
        distance: 0.023854524152790574,
      },
      {
        id: "path-163",
        coordinates: [0.21902671875290555, 0.6581350284124021],
        distance: 0.025443350640723835,
      },
    ],
  },
  {
    id: "path-161",
    coordinates: [0.19473008624787552, 0.6314183633782701],
    floor: -1,
    neighbors: [
      {
        id: "path-160",
        coordinates: [0.21855036366422032, 0.6326961373662833],
        distance: 0.023854524152790574,
        isParent: true,
      },
      {
        id: "path-162",
        coordinates: [0.1830050795663755, 0.6331753026117882],
        distance: 0.011855910642017162,
      },
    ],
  },
  {
    id: "path-162",
    coordinates: [0.1830050795663755, 0.6331753026117882],
    floor: -1,
    neighbors: [
      {
        id: "path-161",
        coordinates: [0.19473008624787552, 0.6314183633782701],
        distance: 0.011855910642017162,
        isParent: true,
      },
    ],
  },
  {
    id: "path-163",
    coordinates: [0.21902671875290555, 0.6581350284124021],
    floor: -1,
    neighbors: [
      {
        id: "path-160",
        coordinates: [0.21855036366422032, 0.6326961373662833],
        distance: 0.025443350640723835,
        isParent: true,
      },
      {
        id: "path-164",
        coordinates: [0.21886386330375115, 0.6783673860255605],
        distance: 0.02023301303523638,
      },
    ],
  },
  {
    id: "path-164",
    coordinates: [0.21886386330375115, 0.6783673860255605],
    floor: -1,
    neighbors: [
      {
        id: "path-163",
        coordinates: [0.21902671875290555, 0.6581350284124021],
        distance: 0.02023301303523638,
        isParent: true,
      },
    ],
  },
  {
    id: "path-166",
    coordinates: [0.23221798153484827, 0.6566597496377092],
    floor: -1,
    neighbors: [
      {
        id: "path-159",
        coordinates: [0.23175642655909923, 0.6322169721207783],
        distance: 0.02444713491879615,
        isParent: true,
      },
    ],
  },
  {
    id: "path-167",
    coordinates: [0.2714660685155555, 0.646122065694056],
    floor: -1,
    neighbors: [
      {
        id: "path-158",
        coordinates: [0.2719917057434983, 0.6334947414339174],
        distance: 0.012638259867010315,
        isParent: true,
      },
    ],
  },
  {
    id: "path-168",
    coordinates: [0.28824015117889507, 0.647597341384482],
    floor: -1,
    neighbors: [
      {
        id: "path-156",
        coordinates: [0.28853013428127167, 0.6322169674459042],
        distance: 0.015383107380830053,
        isParent: true,
      },
    ],
  },
  {
    id: "path-169",
    coordinates: [0.2804230991526717, 0.6227284025893749],
    neighbors: [
      {
        id: "path-157",
        coordinates: [0.28075460361064325, 0.6314183633782701],
        distance: 0.008696281602972073,
        isParent: true,
      },
    ],
  },
  {
    id: "path-170",
    coordinates: [0.3006171367150658, 0.6440145276716185],
    floor: -1,
    neighbors: [
      {
        id: "path-155",
        coordinates: [0.3000082982605419, 0.6330155761884124],
        distance: 0.011015789485716762,
        isParent: true,
      },
    ],
  },
  {
    id: "path-171",
    coordinates: [0.3180426411750229, 0.6450682951407037],
    neighbors: [
      {
        id: "path-154",
        coordinates: [0.31926198929803773, 0.631897528623775],
        distance: 0.01322708964544168,
        isParent: true,
      },
    ],
  },
  {
    id: "path-172",
    coordinates: [0.3541964793883905, 0.6218853876888264],
    floor: -1,
    neighbors: [
      {
        id: "path-153",
        coordinates: [0.35468385204476766, 0.6314183633782701],
        distance: 0.009545426004202646,
        isParent: true,
      },
      {
        id: "path-173",
        coordinates: [0.3462165766796067, 0.6216746351202894],
        distance: 0.007982685255401207,
      },
    ],
  },
  {
    id: "path-173",
    coordinates: [0.3462165766796067, 0.6216746351202894],
    floor: -1,
    neighbors: [
      {
        id: "path-172",
        coordinates: [0.3541964793883905, 0.6218853876888264],
        distance: 0.007982685255401207,
        isParent: true,
      },
    ],
  },
  {
    id: "path-174",
    coordinates: [0.37452023191735945, 0.6454365380536778],
    floor: -1,
    neighbors: [
      {
        id: "path-152",
        coordinates: [0.373814128955954, 0.6295017070711244],
        distance: 0.015950467699558234,
        isParent: true,
      },
    ],
  },
  {
    id: "path-175",
    coordinates: [0.3826859970806089, 0.6451584463374205],
    floor: -1,
    neighbors: [
      {
        id: "path-151",
        coordinates: [0.3827004445618111, 0.6280642136720467],
        distance: 0.017094238770639824,
        isParent: true,
      },
    ],
  },
  {
    id: "path-176",
    coordinates: [0.3818264471562805, 0.6084504089765732],
    floor: -1,
    neighbors: [
      {
        id: "path-151",
        coordinates: [0.3827004445618111, 0.6280642136720467],
        distance: 0.01963326784050611,
        isParent: true,
      },
    ],
  },
  {
    id: "path-177",
    coordinates: [0.4234074035283541, 0.6212426055409896],
    floor: -1,
    neighbors: [
      {
        id: "path-124",
        coordinates: [0.42384229873398077, 0.6310852323939214],
        distance: 0.009852230062576251,
        isParent: true,
      },
      {
        id: "path-178",
        coordinates: [0.4183575170613275, 0.6209645138247321],
        distance: 0.005057537773710579,
      },
    ],
  },
  {
    id: "path-178",
    coordinates: [0.4183575170613275, 0.6209645138247321],
    floor: -1,
    neighbors: [
      {
        id: "path-177",
        coordinates: [0.4234074035283541, 0.6212426055409896],
        distance: 0.005057537773710579,
        isParent: true,
      },
      {
        id: "path-179",
        coordinates: [0.4183575170613275, 0.6063647261917847],
        distance: 0.014599787632947336,
      },
    ],
  },
  {
    id: "path-179",
    coordinates: [0.4183575170613275, 0.6063647261917847],
    floor: -1,
    neighbors: [
      {
        id: "path-178",
        coordinates: [0.4183575170613275, 0.6209645138247321],
        distance: 0.014599787632947336,
        isParent: true,
      },
    ],
  },
  {
    id: "path-180",
    coordinates: [0.4099768628446063, 0.6562100929373916],
    floor: -1,
    neighbors: [
      {
        id: "path-123",
        coordinates: [0.42287529799335816, 0.6581991218227421],
        distance: 0.013050895187431211,
        isParent: true,
      },
      {
        id: "path-181",
        coordinates: [0.40911730663071955, 0.6610766898324693],
        distance: 0.004941922927769164,
      },
    ],
  },
  {
    id: "path-181",
    coordinates: [0.40911730663071955, 0.6610766898324693],
    floor: -1,
    neighbors: [
      {
        id: "path-180",
        coordinates: [0.4099768628446063, 0.6562100929373916],
        distance: 0.004941922927769164,
        isParent: true,
      },
      {
        id: "path-182",
        coordinates: [0.40009198525358325, 0.6616328712301272],
        distance: 0.009042442353020234,
      },
    ],
  },
  {
    id: "path-182",
    coordinates: [0.40009198525358325, 0.6616328712301272],
    floor: -1,
    neighbors: [
      {
        id: "path-181",
        coordinates: [0.40911730663071955, 0.6610766898324693],
        distance: 0.009042442353020234,
        isParent: true,
      },
    ],
  },
  {
    id: "path-183",
    coordinates: [0.43522627945584336, 0.6581567308814797],
    floor: -1,
    neighbors: [
      {
        id: "path-123",
        coordinates: [0.42287529799335816, 0.6581991218227421],
        distance: 0.012351054209198265,
        isParent: true,
      },
      {
        id: "path-184",
        coordinates: [0.4350113904023717, 0.6653871012601749],
        distance: 0.007233562961529658,
      },
    ],
  },
  {
    id: "path-184",
    coordinates: [0.4350113904023717, 0.6653871012601749],
    floor: -1,
    neighbors: [
      {
        id: "path-183",
        coordinates: [0.43522627945584336, 0.6581567308814797],
        distance: 0.007233562961529658,
        isParent: true,
      },
      {
        id: "path-185",
        coordinates: [0.4451111601916457, 0.6642747384648592],
        distance: 0.010160841539200117,
      },
    ],
  },
  {
    id: "path-185",
    coordinates: [0.4451111601916457, 0.6642747384648592],
    floor: -1,
    neighbors: [
      {
        id: "path-184",
        coordinates: [0.4350113904023717, 0.6653871012601749],
        distance: 0.010160841539200117,
        isParent: true,
      },
    ],
  },
  {
    id: "path-186",
    coordinates: [0.4604756960670804, 0.6416103083567299],
    floor: -1,
    neighbors: [
      {
        id: "path-125",
        coordinates: [0.46073243785924795, 0.6291434850725991],
        distance: 0.012469466674464968,
        isParent: true,
      },
    ],
  },
  {
    id: "path-187",
    coordinates: [0.47057545642201676, 0.6409150790660862],
    floor: -1,
    neighbors: [
      {
        id: "path-126",
        coordinates: [0.4712232310295989, 0.6293032068211007],
        distance: 0.01162992643898029,
        isParent: true,
      },
    ],
  },
  {
    id: "path-188",
    coordinates: [0.48808888283216856, 0.6215877403961899],
    floor: -1,
    neighbors: [
      {
        id: "path-127",
        coordinates: [0.4883787699353494, 0.6301018108887348],
        distance: 0.008519004101690228,
        isParent: true,
      },
      {
        id: "path-189",
        coordinates: [0.4953950917815312, 0.6215877403961899],
        distance: 0.007306208949362625,
      },
    ],
  },
  {
    id: "path-189",
    coordinates: [0.4953950917815312, 0.6215877403961899],
    floor: -1,
    neighbors: [
      {
        id: "path-188",
        coordinates: [0.48808888283216856, 0.6215877403961899],
        distance: 0.007306208949362625,
        isParent: true,
      },
    ],
  },
  {
    id: "path-190",
    coordinates: [0.5386951574365992, 0.6443912163624478],
    neighbors: [
      {
        id: "path-128",
        coordinates: [0.5383643196020141, 0.6324976324413855],
        distance: 0.011898184406040494,
        isParent: true,
      },
    ],
  },
  {
    id: "path-191",
    coordinates: [0.5555639166863359, 0.6201972838497596],
    floor: -1,
    neighbors: [
      {
        id: "path-129",
        coordinates: [0.5577414428278331, 0.6312198631282464],
        distance: 0.01123560741782263,
        isParent: true,
      },
    ],
  },
  {
    id: "path-192",
    coordinates: [0.5782346740902501, 0.6434178994252608],
    floor: -1,
    neighbors: [
      {
        id: "path-130",
        coordinates: [0.5789698718707648, 0.6316990283737514],
        distance: 0.011741910172471117,
        isParent: true,
      },
    ],
  },
  {
    id: "path-193",
    coordinates: [0.5922024311181188, 0.6181116000475425],
    floor: -1,
    neighbors: [
      {
        id: "path-131",
        coordinates: [0.5934101410519874, 0.6302615326372365],
        distance: 0.012209808566004348,
        isParent: true,
      },
    ],
  },
  {
    id: "path-194",
    coordinates: [0.6104679692154215, 0.6203363256381739],
    floor: -1,
    neighbors: [
      {
        id: "path-132",
        coordinates: [0.6117998862440817, 0.6302615326372365],
        distance: 0.010014176798193492,
        isParent: true,
      },
    ],
  },
  {
    id: "path-195",
    coordinates: [0.6334610539099848, 0.6231172366961774],
    floor: -1,
    neighbors: [
      {
        id: "path-133",
        coordinates: [0.6343859501492773, 0.6313795848767481],
        distance: 0.008313953963694864,
        isParent: true,
      },
      {
        id: "path-196",
        coordinates: [0.6243282880061127, 0.6211705987520891],
        distance: 0.00933792334195839,
      },
    ],
  },
  {
    id: "path-196",
    coordinates: [0.6243282880061127, 0.6211705987520891],
    floor: -1,
    neighbors: [
      {
        id: "path-195",
        coordinates: [0.6334610539099848, 0.6231172366961774],
        distance: 0.00933792334195839,
        isParent: true,
      },
    ],
  },
  {
    id: "path-197",
    coordinates: [0.6492553678923629, 0.6466159378833647],
    floor: -1,
    neighbors: [
      {
        id: "path-134",
        coordinates: [0.6501838541927639, 0.6297823673917315],
        distance: 0.016859157224096772,
        isParent: true,
      },
    ],
  },
  {
    id: "path-198",
    coordinates: [0.6741824477786132, 0.6448083457974052],
    floor: -1,
    neighbors: [
      {
        id: "path-135",
        coordinates: [0.6744978206259711, 0.6307406978827415],
        distance: 0.01407118253324126,
        isParent: true,
      },
    ],
  },
  {
    id: "path-199",
    coordinates: [0.6736838105339558, 0.6187226602874728],
    floor: -1,
    neighbors: [
      {
        id: "path-135",
        coordinates: [0.6744978206259711, 0.6307406978827415],
        distance: 0.012045573463774708,
        isParent: true,
      },
      {
        id: "path-200",
        coordinates: [0.6778929202558613, 0.6187226602874728],
        distance: 0.0042091097219055795,
      },
    ],
  },
  {
    id: "path-200",
    coordinates: [0.6778929202558613, 0.6187226602874728],
    floor: -1,
    neighbors: [
      {
        id: "path-199",
        coordinates: [0.6736838105339558, 0.6187226602874728],
        distance: 0.0042091097219055795,
        isParent: true,
      },
    ],
  },
  {
    id: "path-201",
    coordinates: [0.6911749897237315, 0.6177542904579751],
    floor: -1,
    neighbors: [
      {
        id: "path-136",
        coordinates: [0.6910362455513417, 0.6304212543857382],
        distance: 0.012667723753406584,
        isParent: true,
      },
    ],
  },
  {
    id: "path-202",
    coordinates: [0.7028669544813395, 0.6173911528790672],
    floor: -1,
    neighbors: [
      {
        id: "path-137",
        coordinates: [0.7033783589884163, 0.6301018108887348],
        distance: 0.012720941852260255,
        isParent: true,
      },
    ],
  },
  {
    id: "path-203",
    coordinates: [0.7260670960041575, 0.6182589833489054],
    floor: -1,
    neighbors: [
      {
        id: "path-138",
        coordinates: [0.7257175838037849, 0.6297823720666057],
        distance: 0.011528687970338694,
        isParent: true,
      },
    ],
  },
  {
    id: "path-204",
    coordinates: [0.7338841408804899, 0.6181536062935702],
    floor: -1,
    neighbors: [
      {
        id: "path-140",
        coordinates: [0.7344804852833325, 0.6299420938151074],
        distance: 0.01180356152575311,
        isParent: true,
      },
    ],
  },
  {
    id: "path-205",
    coordinates: [0.7301384750831266, 0.6462892260934019],
    floor: -1,
    neighbors: [
      {
        id: "path-139",
        coordinates: [0.7301607452191161, 0.6299420938151074],
        distance: 0.016347147447888767,
        isParent: true,
      },
    ],
  },
  {
    id: "path-206",
    coordinates: [0.7499253740226347, 0.6163622009792719],
    floor: -1,
    neighbors: [
      {
        id: "path-141",
        coordinates: [0.7495378539953242, 0.6302615326372365],
        distance: 0.013904732730608842,
        isParent: true,
      },
    ],
  },
  {
    id: "path-207",
    coordinates: [0.7568467163119148, 0.6149923023441809],
    floor: -1,
    neighbors: [
      {
        id: "path-142",
        coordinates: [0.7569431206126079, 0.6296226456432299],
        distance: 0.014630660915940197,
        isParent: true,
      },
    ],
  },
  {
    id: "path-208",
    coordinates: [0.7582309876297273, 0.6499774168616006],
    floor: -1,
    neighbors: [
      {
        id: "path-142",
        coordinates: [0.7569431206126079, 0.6296226456432299],
        distance: 0.020395472850757747,
        isParent: true,
      },
    ],
  },
  {
    id: "path-209",
    coordinates: [0.7666180241948031, 0.6123578805872009],
    floor: -1,
    neighbors: [
      {
        id: "path-143",
        coordinates: [0.7673104996566494, 0.6296226456432299],
        distance: 0.017278646784547116,
        isParent: true,
      },
    ],
  },
  {
    id: "path-210",
    coordinates: [0.7869691202862483, 0.6897041633028698],
    floor: -1,
    neighbors: [
      {
        id: "path-144",
        coordinates: [0.7866876120452602, 0.6297823720666057],
        distance: 0.05992245248529267,
        isParent: true,
      },
      {
        id: "path-211",
        coordinates: [0.7959008595768281, 0.6878694475752791],
        distance: 0.009118231657287227,
      },
    ],
  },
  {
    id: "path-211",
    coordinates: [0.7959008595768281, 0.6878694475752791],
    floor: -1,
    neighbors: [
      {
        id: "path-210",
        coordinates: [0.7869691202862483, 0.6897041633028698],
        distance: 0.009118231657287227,
        isParent: true,
      },
    ],
  },
  {
    id: "path-212",
    coordinates: [0.8046761435245676, 0.6401103339447272],
    floor: -1,
    neighbors: [
      {
        id: "path-146",
        coordinates: [0.8049539394986422, 0.630101815563609],
        distance: 0.010012372885005437,
        isParent: true,
      },
    ],
  },
  {
    id: "path-213",
    coordinates: [0.7976733711274132, 0.6434823935469203],
    floor: -1,
    neighbors: [
      {
        id: "path-145",
        coordinates: [0.7971784088280138, 0.6297823720666057],
        distance: 0.013708959706662917,
        isParent: true,
      },
    ],
  },
  {
    id: "path-214",
    coordinates: [0.817785978581933, 0.6471705843151189],
    floor: -1,
    neighbors: [
      {
        id: "path-147",
        coordinates: [0.8185302664468659, 0.6291434897474733],
        distance: 0.01804245279824017,
        isParent: true,
      },
    ],
  },
  {
    id: "path-215",
    coordinates: [0.8293486964055197, 0.6480135976735338],
    floor: -1,
    neighbors: [
      {
        id: "path-148",
        coordinates: [0.8287742205273898, 0.6302615373121107],
        distance: 0.017761353259539807,
        isParent: true,
      },
    ],
  },
  {
    id: "path-216",
    coordinates: [0.8472627624463461, 0.6441146558789316],
    floor: -1,
    neighbors: [
      {
        id: "path-149",
        coordinates: [0.8470405443683691, 0.6304212590606123],
        distance: 0.013695199790369475,
        isParent: true,
      },
    ],
  },
  {
    id: "path-217",
    coordinates: [0.8544283879093578, 0.646327570956704],
    floor: -1,
    neighbors: [
      {
        id: "path-150",
        coordinates: [0.8550629177412272, 0.6310601460546189],
        distance: 0.015280605068135899,
        isParent: true,
      },
    ],
  },
  {
    id: "path-218",
    coordinates: [0.8616754410969468, 0.6308371731229631],
    floor: -1,
    neighbors: [
      {
        id: "path-150",
        coordinates: [0.8550629177412272, 0.6310601460546189],
        distance: 0.006616281588489748,
        isParent: true,
      },
    ],
  },
  {
    id: "path-220",
    coordinates: [0.8477513240272153, 0.6192457190114911],
    floor: -1,
    neighbors: [
      {
        id: "path-149",
        coordinates: [0.8470405443683691, 0.6304212590606123],
        distance: 0.011198120516985986,
        isParent: true,
      },
    ],
  },
];

export const basementPath = [
  {
    id: "path-0",
    coordinates: [0.42272056159696775, 0.6811502469823246],
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.42288687661790464, 0.6613493315447385],
        distance: 0.019801613895150696,
      },
    ],
    name: "ENTRY/EXIT",
    messages: {
      "path-1": "Go Straight",
    },
  },
  {
    id: "path-1",
    coordinates: [0.42288687661790464, 0.6613493315447385],
    neighbors: [
      {
        id: "path-0",
        coordinates: [0.42272056159696775, 0.6811502469823246],
        distance: 0.019801613895150696,
        isParent: true,
      },
      {
        id: "path-2",
        coordinates: [0.4044262416349575, 0.6609188878371041],
        distance: 0.018465652594995226,
      },
      {
        id: "path-3",
        coordinates: [0.43918545967750455, 0.6604884254299732],
        distance: 0.01632130414792634,
      },
      {
        id: "path-4",
        coordinates: [0.42272056159696775, 0.6318631895919247],
        distance: 0.02948661099461378,
      },
    ],
    messages: {
      "path-0": "Go Straight",
      "path-2": "Turn Left",
      "path-3": "Turn Right",
      "path-4": "Go striaght",
    },
  },
  {
    id: "path-2",
    coordinates: [0.4044262416349575, 0.6609188878371041],
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.42288687661790464, 0.6613493315447385],
        distance: 0.018465652594995226,
        isParent: true,
      },
    ],
    name: "PREVENTIVE UNIC OP 60",
    messages: {
      "path-1": "Go Straight",
    },
  },
  {
    id: "path-3",
    coordinates: [0.43918545967750455, 0.6604884254299732],
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.42288687661790464, 0.6613493315447385],
        distance: 0.01632130414792634,
        isParent: true,
      },
    ],
    name: "INFORMATION CENTER",
    messages: {
      "path-1": "Go Straight",
    },
  },
  {
    id: "path-4",
    coordinates: [0.42272056159696775, 0.6318631895919247],
    neighbors: [
      {
        id: "path-1",
        coordinates: [0.42288687661790464, 0.6613493315447385],
        distance: 0.02948661099461378,
        isParent: true,
      },
      {
        id: "path-5",
        coordinates: [0.4598081465837989, 0.6312175053309766],
        distance: 0.0370932051502733,
      },
      {
        id: "path-57",
        coordinates: [0.4182562599871342, 0.6318237535845777],
        distance: 0.004464475788067132,
      },
    ],
    messages: {
      "path-5": "Turn Right",
      "path-57": "Turn left",
      "path-1": "Go Straight",
    },
  },
  {
    id: "path-5",
    coordinates: [0.4598081465837989, 0.6312175053309766],
    neighbors: [
      {
        id: "path-4",
        coordinates: [0.42272056159696775, 0.6318631895919247],
        distance: 0.0370932051502733,
        isParent: true,
      },
      {
        id: "path-6",
        coordinates: [0.4701194900369461, 0.6316479583883592],
        distance: 0.01032032429933143,
      },
      {
        id: "path-53",
        coordinates: [0.45975737739495826, 0.6433591635834955],
        distance: 0.012141764395321452,
      },
      {
        id: "path-54",
        coordinates: [0.459612591759797, 0.613286874717443],
        distance: 0.017931696960638704,
      },
    ],
    messages: {
      "path-53": "Turn Right",
      "path-6": "Go Straight",
      "path-54": "Turn Left",
      "path-4": "Go Straight",
    },
  },
  {
    id: "path-6",
    coordinates: [0.4701194900369461, 0.6316479583883592],
    neighbors: [
      {
        id: "path-5",
        coordinates: [0.4598081465837989, 0.6312175053309766],
        distance: 0.01032032429933143,
        isParent: true,
      },
      {
        id: "path-7",
        coordinates: [0.48891274783696165, 0.6312175053309766],
        distance: 0.01879818684268394,
      },
      {
        id: "path-52",
        coordinates: [0.47010936162223327, 0.6434528463713898],
        distance: 0.011804892328042835,
      },
    ],
    messages: {
      "path-5": "Go Straight",
      "path-7": "Go Straight",
      "path-52": "Turn Right",
    },
  },
  {
    id: "path-7",
    coordinates: [0.48891274783696165, 0.6312175053309766],
    neighbors: [
      {
        id: "path-6",
        coordinates: [0.4701194900369461, 0.6316479583883592],
        distance: 0.01879818684268394,
        isParent: true,
      },
      {
        id: "path-8",
        coordinates: [0.5396379116724294, 0.6318631802421765],
        distance: 0.05072927303072649,
      },
    ],
    messages: {
      "path-8": "Go Straight",
      "path-6": "Go Straight",
    },
  },
  {
    id: "path-8",
    coordinates: [0.5396379116724294, 0.6318631802421765],
    neighbors: [
      {
        id: "path-7",
        coordinates: [0.48891274783696165, 0.6312175053309766],
        distance: 0.05072927303072649,
        isParent: true,
      },
      {
        id: "path-9",
        coordinates: [0.5577659310631135, 0.6314327271847938],
        distance: 0.01813312926286107,
      },
    ],
  },
  {
    id: "path-9",
    coordinates: [0.5577659310631135, 0.6314327271847938],
    neighbors: [
      {
        id: "path-8",
        coordinates: [0.5396379116724294, 0.6318631802421765],
        distance: 0.01813312926286107,
        isParent: true,
      },
      {
        id: "path-10",
        coordinates: [0.5762265660460606, 0.6314327271847938],
        distance: 0.018460634982947144,
      },
      {
        id: "path-51",
        coordinates: [0.5577754755988542, 0.6242478046504981],
        distance: 0.007184928873829766,
      },
    ],
    messages: {
      "path-7": "Go Straight",
      "path-9": "Go Straight",
      "path-51": "Turn Left",
      "path-10": "Go Straight",
      "path-8": "Go Straight",
    },
  },
  {
    id: "path-10",
    coordinates: [0.5762265660460606, 0.6314327271847938],
    neighbors: [
      {
        id: "path-9",
        coordinates: [0.5577659310631135, 0.6314327271847938],
        distance: 0.018460634982947144,
        isParent: true,
      },
      {
        id: "path-11",
        coordinates: [0.5930240797188604, 0.6316479583883592],
        distance: 0.016798892524773307,
      },
    ],
    messages: {
      "path-11": "Go Straight",
      "path-9": "Go Straight",
    },
  },
  {
    id: "path-11",
    coordinates: [0.5930240797188604, 0.6316479583883592],
    neighbors: [
      {
        id: "path-10",
        coordinates: [0.5762265660460606, 0.6314327271847938],
        distance: 0.016798892524773307,
        isParent: true,
      },
      {
        id: "path-12",
        coordinates: [0.6121499603359443, 0.6318631802421765],
        distance: 0.019127091515055417,
      },
      {
        id: "path-50",
        coordinates: [0.5929577512700213, 0.6232172888965186],
        distance: 0.008430930407954791,
      },
    ],
    messages: {
      "path-50": "Turn Left",
      "path-12": "Go Straight",
      "path-10": "Go Straight",
    },
  },
  {
    id: "path-12",
    coordinates: [0.6121499603359443, 0.6318631802421765],
    neighbors: [
      {
        id: "path-11",
        coordinates: [0.5930240797188604, 0.6316479583883592],
        distance: 0.019127091515055417,
        isParent: true,
      },
      {
        id: "path-13",
        coordinates: [0.6314421415243543, 0.6316479583883592],
        distance: 0.01929338164896974,
      },
      {
        id: "path-49",
        coordinates: [0.6119967195127886, 0.6224678245585075],
        distance: 0.009396605300454676,
      },
    ],
    messages: {
      "path-11": "Go Straight",
      "path-13": "Go Straight",
      "path-49": "Turn Left",
    },
  },
  {
    id: "path-13",
    coordinates: [0.6314421415243543, 0.6316479583883592],
    neighbors: [
      {
        id: "path-12",
        coordinates: [0.6121499603359443, 0.6318631802421765],
        distance: 0.01929338164896974,
        isParent: true,
      },
      {
        id: "path-14",
        coordinates: [0.650568036591049, 0.6316479583883592],
        distance: 0.01912589506669471,
      },
    ],
    messages: {
      "path-14": "Go Straight",
      "path-12": "Go Straight",
    },
  },
  {
    id: "path-14",
    coordinates: [0.650568036591049, 0.6316479583883592],
    neighbors: [
      {
        id: "path-13",
        coordinates: [0.6314421415243543, 0.6316479583883592],
        distance: 0.01912589506669471,
        isParent: true,
      },
      {
        id: "path-15",
        coordinates: [0.6633740620094173, 0.631432736534542],
        distance: 0.012807833831770893,
      },
      {
        id: "path-48",
        coordinates: [0.6506537843874617, 0.643827583627538],
        distance: 0.01217992707906871,
      },
    ],
    messages: {
      "path-48": "Turn Right",
      "path-15": "Go Straight",
      "path-13": "Go Straight",
    },
  },
  {
    id: "path-15",
    coordinates: [0.6633740620094173, 0.631432736534542],
    neighbors: [
      {
        id: "path-14",
        coordinates: [0.650568036591049, 0.6316479583883592],
        distance: 0.012807833831770893,
        isParent: true,
      },
      {
        id: "path-16",
        coordinates: [0.6743506510967011, 0.6316479583883592],
        distance: 0.010978698849929299,
      },
      {
        id: "path-45",
        coordinates: [0.6632499082223852, 0.619095234020029],
        distance: 0.012338127186021794,
      },
    ],
    messages: {
      "path-45": "Turn Left",
      "path-16": "Go Straight",
      "path-14": "Go Straight",
    },
  },
  {
    id: "path-16",
    coordinates: [0.6743506510967011, 0.6316479583883592],
    neighbors: [
      {
        id: "path-15",
        coordinates: [0.6633740620094173, 0.631432736534542],
        distance: 0.010978698849929299,
        isParent: true,
      },
      {
        id: "path-17",
        coordinates: [0.6926449710587114, 0.6320784114457418],
        distance: 0.018299383396907582,
      },
      {
        id: "path-44",
        coordinates: [0.6743982024363198, 0.643546531194141],
        distance: 0.011898667822255944,
      },
    ],
    messages: {
      "path-17": "Go Straight",
      "path-15": "Go Straight",
      "path-44": "Turn Right",
    },
  },
  {
    id: "path-17",
    coordinates: [0.6926449710587114, 0.6320784114457418],
    neighbors: [
      {
        id: "path-16",
        coordinates: [0.6743506510967011, 0.6316479583883592],
        distance: 0.018299383396907582,
        isParent: true,
      },
      {
        id: "path-21",
        coordinates: [0.7036934329178918, 0.6320805356953053],
        distance: 0.01104846206339146,
      },
      {
        id: "path-43",
        coordinates: [0.6925684741644053, 0.6204067961028341],
        distance: 0.011671866024232695,
      },
    ],
    messages: {
      "path-43": "Turn Left",
      "path-21": "Go Straight",
      "path-16": "Go Straight",
    },
  },
  {
    id: "path-21",
    coordinates: [0.7036934329178918, 0.6320805356953053],
    neighbors: [
      {
        id: "path-17",
        coordinates: [0.6926449710587114, 0.6320784114457418],
        distance: 0.01104846206339146,
        isParent: true,
      },
      {
        id: "path-22",
        coordinates: [0.7261348038361428, 0.6318931741892311],
        distance: 0.02244215303896848,
      },
      {
        id: "path-42",
        coordinates: [0.7035719843155682, 0.6197510135352888],
        distance: 0.012330120293709378,
      },
    ],
    messages: {
      "path-42": "Turn Left",
      "path-22": "Go Straight",
      "path-17": "Go Straight",
    },
  },
  {
    id: "path-22",
    coordinates: [0.7261348038361428, 0.6318931741892311],
    neighbors: [
      {
        id: "path-21",
        coordinates: [0.7036934329178918, 0.6320805356953053],
        distance: 0.02244215303896848,
        isParent: true,
      },
      {
        id: "path-23",
        coordinates: [0.730695469579462, 0.6321742205180566],
        distance: 0.004569317132923814,
      },
      {
        id: "path-41",
        coordinates: [0.7260857449066208, 0.619751015570146],
        distance: 0.012142257727028686,
      },
    ],
    messages: {
      "path-41": "Turn Left",
      "path-23": "Go Straight",
      "path-21": "Go Straight",
    },
  },
  {
    id: "path-23",
    coordinates: [0.730695469579462, 0.6321742205180566],
    neighbors: [
      {
        id: "path-22",
        coordinates: [0.7261348038361428, 0.6318931741892311],
        distance: 0.004569317132923814,
        isParent: true,
      },
      {
        id: "path-24",
        coordinates: [0.7503135709285366, 0.6317994893664798],
        distance: 0.019621679947917935,
      },
      {
        id: "path-40",
        coordinates: [0.73064641064994, 0.6441086319912208],
        distance: 0.01193451230630558,
      },
    ],
    messages: {
      "path-40": "Turn Right",
      "path-24": "Go Straight",
      "path-22": "Go Straight",
    },
  },
  {
    id: "path-24",
    coordinates: [0.7503135709285366, 0.6317994893664798],
    neighbors: [
      {
        id: "path-23",
        coordinates: [0.730695469579462, 0.6321742205180566],
        distance: 0.019621679947917935,
        isParent: true,
      },
      {
        id: "path-25",
        coordinates: [0.7572631556251069, 0.6318931741892311],
        distance: 0.0069502161333888715,
      },
      {
        id: "path-39",
        coordinates: [0.7502645104266248, 0.6199383811459345],
        distance: 0.011861209683347456,
      },
    ],
    messages: {
      "path-39": "Turn Left",
      "path-25": "Go Straight",
      "path-23": "Go Straight",
    },
  },
  {
    id: "path-25",
    coordinates: [0.7572631556251069, 0.6318931741892311],
    neighbors: [
      {
        id: "path-24",
        coordinates: [0.7503135709285366, 0.6317994893664798],
        distance: 0.0069502161333888715,
        isParent: true,
      },
      {
        id: "path-26",
        coordinates: [0.7677599254875432, 0.6318931741892311],
        distance: 0.010496769862436306,
      },
      {
        id: "path-38",
        coordinates: [0.7571417054503939, 0.6199383811459345],
        distance: 0.011955409940817202,
      },
    ],
    messages: {
      "path-38": "Turn Left",
      "path-26": "Go Straight",
      "path-24": "Go Straight",
    },
  },
  {
    id: "path-26",
    coordinates: [0.7677599254875432, 0.6318931741892311],
    neighbors: [
      {
        id: "path-25",
        coordinates: [0.7572631556251069, 0.6318931741892311],
        distance: 0.010496769862436306,
        isParent: true,
      },
      {
        id: "path-27",
        coordinates: [0.7861473693788121, 0.631518443037654],
        distance: 0.01839126195481224,
      },
      {
        id: "path-37",
        coordinates: [0.7675660824952496, 0.6198446983580402],
        distance: 0.012050035060548627,
      },
    ],
    messages: {
      "path-27": "Go Straight",
      "path-25": "Go Straight",
      "path-37": "Turn Left",
    },
  },
  {
    id: "path-27",
    coordinates: [0.7861473693788121, 0.631518443037654],
    neighbors: [
      {
        id: "path-26",
        coordinates: [0.7677599254875432, 0.6318931741892311],
        distance: 0.01839126195481224,
        isParent: true,
      },
      {
        id: "path-34",
        coordinates: [0.8042775403279676, 0.6320484332417734],
        distance: 0.01813791576400287,
      },
      {
        id: "path-35",
        coordinates: [0.786066374264023, 0.6872972921237049],
        distance: 0.05577890789154142,
      },
    ],
    messages: {
      "path-35": "Turn Right",
      "path-34": "Go Straight",
      "path-26": "Go Straight",
    },
  },
  {
    id: "path-30",
    coordinates: [0.8177100686389223, 0.6319868590119825],
    neighbors: [
      {
        id: "path-31",
        coordinates: [0.8175652892933195, 0.6412614855363697],
        distance: 0.00927575647727887,
      },
      {
        id: "path-34",
        coordinates: [0.8042775403279676, 0.6320484332417734],
        distance: 0.013432669437247852,
        isParent: true,
      },
    ],
    messages: {
      "path-31": "Turn Right",
      "path-34": "Go Straight",
    },
  },
  {
    id: "path-31",
    coordinates: [0.8175652892933195, 0.6412614855363697],
    neighbors: [
      {
        id: "path-30",
        coordinates: [0.8177100686389223, 0.6319868590119825],
        distance: 0.00927575647727887,
        isParent: true,
      },
    ],
    name: "WARD-27",
    messages: {
      "path-30": "Go Straight",
    },
  },
  {
    id: "path-32",
    coordinates: [0.8047519870056542, 0.6435098887246888],
    neighbors: [
      {
        id: "path-34",
        coordinates: [0.8042775403279676, 0.6320484332417734],
        distance: 0.011471271134308536,
        isParent: true,
      },
    ],
    name: "STAIR-4",
    messages: {
      "path-34": "Go Straight",
    },
  },
  {
    id: "path-34",
    coordinates: [0.8042775403279676, 0.6320484332417734],
    neighbors: [
      {
        id: "path-27",
        coordinates: [0.7861473693788121, 0.631518443037654],
        distance: 0.01813791576400287,
        isParent: true,
      },
      {
        id: "path-30",
        coordinates: [0.8177100686389223, 0.6319868590119825],
        distance: 0.013432669437247852,
      },
      {
        id: "path-32",
        coordinates: [0.8047519870056542, 0.6435098887246888],
        distance: 0.011471271134308536,
      },
    ],
    messages: {
      "path-32": "Turn Right",
      "path-30": "Go Straight",
      "path-27": "Go Straight",
    },
  },
  {
    id: "path-35",
    coordinates: [0.786066374264023, 0.6872972921237049],
    neighbors: [
      {
        id: "path-27",
        coordinates: [0.7861473693788121, 0.631518443037654],
        distance: 0.05577890789154142,
        isParent: true,
      },
      {
        id: "path-36",
        coordinates: [0.7987892457843255, 0.6869744453183568],
        distance: 0.012726967029966242,
      },
    ],
    messages: {
      "path-36": "Turn Left",
      "path-27": "Go Straight",
    },
  },
  {
    id: "path-36",
    coordinates: [0.7987892457843255, 0.6869744453183568],
    neighbors: [
      {
        id: "path-35",
        coordinates: [0.786066374264023, 0.6872972921237049],
        distance: 0.012726967029966242,
        isParent: true,
      },
    ],
    name: "WARD 46&47 DEADICTION",
    messages: {
      "path-35": "Go Straight",
    },
  },
  {
    id: "path-37",
    coordinates: [0.7675660824952496, 0.6198446983580402],
    neighbors: [
      {
        id: "path-26",
        coordinates: [0.7677599254875432, 0.6318931741892311],
        distance: 0.012050035060548627,
        isParent: true,
      },
    ],
    name: "HOUSE KEEPING DEPT",
    messages: {
      "path-26": "Go Straight",
    },
  },
  {
    id: "path-38",
    coordinates: [0.7571417054503939, 0.6199383811459345],
    neighbors: [
      {
        id: "path-25",
        coordinates: [0.7572631556251069, 0.6318931741892311],
        distance: 0.011955409940817202,
        isParent: true,
      },
    ],
    name: "GASTROENTOROLAGY CLINIC",
    messages: {
      "path-25": "Go Straight",
    },
  },
  {
    id: "path-39",
    coordinates: [0.7502645104266248, 0.6199383811459345],
    neighbors: [
      {
        id: "path-24",
        coordinates: [0.7503135709285366, 0.6317994893664798],
        distance: 0.011861209683347456,
        isParent: true,
      },
    ],
    name: "69[7]-USG ROOM",
    messages: {
      "path-24": "Go Straight",
    },
  },
  {
    id: "path-40",
    coordinates: [0.73064641064994, 0.6441086319912208],
    neighbors: [
      {
        id: "path-23",
        coordinates: [0.730695469579462, 0.6321742205180566],
        distance: 0.01193451230630558,
        isParent: true,
      },
    ],
    name: "OP PHARMACY",
    messages: {
      "path-23": "Go Straight",
    },
  },
  {
    id: "path-41",
    coordinates: [0.7260857449066208, 0.619751015570146],
    neighbors: [
      {
        id: "path-22",
        coordinates: [0.7261348038361428, 0.6318931741892311],
        distance: 0.012142257727028686,
        isParent: true,
      },
    ],
    name: "DEPT OF MEDICINE CLINICAL RESEARCH ROOM",
    messages: {
      "path-22": "Go Straight",
    },
  },
  {
    id: "path-42",
    coordinates: [0.7035719843155682, 0.6197510135352888],
    neighbors: [
      {
        id: "path-21",
        coordinates: [0.7036934329178918, 0.6320805356953053],
        distance: 0.012330120293709378,
        isParent: true,
      },
    ],
    name: "DATA ENTRY ROOM",
    messages: {
      "path-21": "Go Straight",
    },
  },
  {
    id: "path-43",
    coordinates: [0.6925684741644053, 0.6204067961028341],
    neighbors: [
      {
        id: "path-17",
        coordinates: [0.6926449710587114, 0.6320784114457418],
        distance: 0.011671866024232695,
        isParent: true,
      },
    ],
    name: "MICROBIOLOGY BLOOD CULTURAL LAB",
    messages: {
      "path-17": "Go Straight",
    },
  },
  {
    id: "path-44",
    coordinates: [0.6743982024363198, 0.643546531194141],
    neighbors: [
      {
        id: "path-16",
        coordinates: [0.6743506510967011, 0.6316479583883592],
        distance: 0.011898667822255944,
        isParent: true,
      },
    ],
    name: "DISPENSARY",
    messages: {
      "path-16": "Go Straight",
    },
  },
  {
    id: "path-45",
    coordinates: [0.6632499082223852, 0.619095234020029],
    neighbors: [
      {
        id: "path-15",
        coordinates: [0.6633740620094173, 0.631432736534542],
        distance: 0.012338127186021794,
        isParent: true,
      },
      {
        id: "path-46",
        coordinates: [0.6631775185495837, 0.6129121476355803],
        distance: 0.006183510127935629,
      },
    ],
    messages: {
      "path-15": "Go Straight",
      "path-46": "Go Straight",
    },
  },
  {
    id: "path-46",
    coordinates: [0.6631775185495837, 0.6129121476355803],
    neighbors: [
      {
        id: "path-45",
        coordinates: [0.6632499082223852, 0.619095234020029],
        distance: 0.006183510127935629,
        isParent: true,
      },
      {
        id: "path-47",
        coordinates: [0.6492059547664727, 0.6130058304234745],
        distance: 0.013971877862702911,
      },
    ],
    messages: {
      "path-47": "Turn Left",
      "path-45": "Go Straight",
    },
  },
  {
    id: "path-47",
    coordinates: [0.6492059547664727, 0.6130058304234745],
    neighbors: [
      {
        id: "path-46",
        coordinates: [0.6631775185495837, 0.6129121476355803],
        distance: 0.013971877862702911,
        isParent: true,
      },
    ],
    name: "STAIR-3",
    messages: {
      "path-46": "Go Straight",
    },
  },
  {
    id: "path-48",
    coordinates: [0.6506537843874617, 0.643827583627538],
    neighbors: [
      {
        id: "path-14",
        coordinates: [0.650568036591049, 0.6316479583883592],
        distance: 0.01217992707906871,
        isParent: true,
      },
    ],
    name: "PSYCHIATRY OPD OP 68",
    messages: {
      "path-14": "Go Straight",
    },
  },
  {
    id: "path-49",
    coordinates: [0.6119967195127886, 0.6224678245585075],
    neighbors: [
      {
        id: "path-12",
        coordinates: [0.6121499603359443, 0.6318631802421765],
        distance: 0.009396605300454676,
        isParent: true,
      },
    ],
    name: "SURGEANT",
    messages: {
      "path-12": "Go Straight",
    },
  },
  {
    id: "path-50",
    coordinates: [0.5929577512700213, 0.6232172888965186],
    neighbors: [
      {
        id: "path-11",
        coordinates: [0.5930240797188604, 0.6316479583883592],
        distance: 0.008430930407954791,
        isParent: true,
      },
    ],
    name: "CLINICAL PATHOLOGY STORE ROOM",
    messages: {
      "path-11": "Go Straight",
    },
  },
  {
    id: "path-51",
    coordinates: [0.5577754755988542, 0.6242478046504981],
    neighbors: [
      {
        id: "path-9",
        coordinates: [0.5577659310631135, 0.6314327271847938],
        distance: 0.007184928873829766,
        isParent: true,
      },
    ],
    name: "KASP COUNTER 2",
    messages: {
      "path-9": "Go Straight",
    },
  },
  {
    id: "path-52",
    coordinates: [0.47010936162223327, 0.6434528463713898],
    neighbors: [
      {
        id: "path-6",
        coordinates: [0.4701194900369461, 0.6316479583883592],
        distance: 0.011804892328042835,
        isParent: true,
      },
    ],
    name: "MEDICAL OP 65",
    messages: {
      "path-6": "Go Straight",
    },
  },
  {
    id: "path-53",
    coordinates: [0.45975737739495826, 0.6433591635834955],
    neighbors: [
      {
        id: "path-5",
        coordinates: [0.4598081465837989, 0.6312175053309766],
        distance: 0.012141764395321452,
        isParent: true,
      },
    ],
    name: "LIFT",
    messages: {
      "path-5": "Go Straight",
    },
  },
  {
    id: "path-54",
    coordinates: [0.459612591759797, 0.613286874717443],
    neighbors: [
      {
        id: "path-5",
        coordinates: [0.4598081465837989, 0.6312175053309766],
        distance: 0.017931696960638704,
        isParent: true,
      },
      {
        id: "path-55",
        coordinates: [0.4737289396056797, 0.6129121425484375],
        distance: 0.014121320784701547,
      },
    ],
  },
  {
    id: "path-55",
    coordinates: [0.4737289396056797, 0.6129121425484375],
    neighbors: [
      {
        id: "path-54",
        coordinates: [0.459612591759797, 0.613286874717443],
        distance: 0.014121320784701547,
        isParent: true,
      },
    ],
    name: "STAIR-2",
    messages: {
      "path-54": "Go Straight",
    },
  },
  {
    id: "path-57",
    coordinates: [0.4182562599871342, 0.6318237535845777],
    neighbors: [
      {
        id: "path-4",
        coordinates: [0.42272056159696775, 0.6318631895919247],
        distance: 0.004464475788067132,
        isParent: true,
      },
      {
        id: "path-58",
        coordinates: [0.41825626309930497, 0.6082131669933739],
        distance: 0.023610586591203946,
      },
      {
        id: "path-59",
        coordinates: [0.38157612582794886, 0.6318237535845777],
        distance: 0.03668013415918536,
      },
    ],
    messages: {
      "path-59": "Go Straight",
      "path-58": "Turn Left",
    },
  },
  {
    id: "path-58",
    coordinates: [0.41825626309930497, 0.6082131669933739],
    neighbors: [
      {
        id: "path-57",
        coordinates: [0.4182562599871342, 0.6318237535845777],
        distance: 0.023610586591203946,
        isParent: true,
      },
    ],
    name: "MEDICAL RECORD LIBRARY",
    messages: {
      "path-57": "Go Straight",
    },
  },
  {
    id: "path-59",
    coordinates: [0.38157612582794886, 0.6318237535845777],
    neighbors: [
      {
        id: "path-57",
        coordinates: [0.4182562599871342, 0.6318237535845777],
        distance: 0.03668013415918536,
        isParent: true,
      },
      {
        id: "path-60",
        coordinates: [0.3814806050072486, 0.6136522550390571],
        distance: 0.018171749602529853,
      },
      {
        id: "path-62",
        coordinates: [0.31853215179037525, 0.6319473741343274],
        distance: 0.06304409523889272,
      },
      {
        id: "path-83",
        coordinates: [0.3816716466486491, 0.6410702101090143],
        distance: 0.009246949901750566,
      },
    ],
    messages: {
      "path-57": "Go Straight",
      "path-60": "Turn Right",
      "path-83": "Turn Left",
      "path-62": "Go Straight",
    },
  },
  {
    id: "path-60",
    coordinates: [0.3814806050072486, 0.6136522550390571],
    neighbors: [
      {
        id: "path-59",
        coordinates: [0.38157612582794886, 0.6318237535845777],
        distance: 0.018171749602529853,
        isParent: true,
      },
      {
        id: "path-61",
        coordinates: [0.36915837349174685, 0.6134050246795977],
        distance: 0.01232471145188655,
      },
    ],
    messages: {
      "path-61": "Turn Left",
    },
  },
  {
    id: "path-61",
    coordinates: [0.36915837349174685, 0.6134050246795977],
    neighbors: [
      {
        id: "path-60",
        coordinates: [0.3814806050072486, 0.6136522550390571],
        distance: 0.01232471145188655,
        isParent: true,
      },
    ],
    name: "STAIR-1",
    messages: {
      "path-60": "Go Straight",
    },
  },
  {
    id: "path-62",
    coordinates: [0.31853215179037525, 0.6319473741343274],
    neighbors: [
      {
        id: "path-59",
        coordinates: [0.38157612582794886, 0.6318237535845777],
        distance: 0.06304409523889272,
        isParent: true,
      },
      {
        id: "path-63",
        coordinates: [0.31834110911158453, 0.6433200163146329],
        distance: 0.011374246676874106,
      },
      {
        id: "path-64",
        coordinates: [0.30000104203199185, 0.6320709946840773],
        distance: 0.018531522088527243,
      },
    ],
    messages: {
      "path-63": "Turn Left",
      "path-64": "Go Straight",
      "path-59": "Go Straight",
    },
  },
  {
    id: "path-63",
    coordinates: [0.31834110911158453, 0.6433200163146329],
    neighbors: [
      {
        id: "path-62",
        coordinates: [0.31853215179037525, 0.6319473741343274],
        distance: 0.011374246676874106,
        isParent: true,
      },
    ],
    name: "OP 63",
    messages: {
      "path-62": "Go Straight",
    },
  },
  {
    id: "path-64",
    coordinates: [0.30000104203199185, 0.6320709946840773],
    neighbors: [
      {
        id: "path-62",
        coordinates: [0.31853215179037525, 0.6319473741343274],
        distance: 0.018531522088527243,
        isParent: true,
      },
      {
        id: "path-65",
        coordinates: [0.2877743313371903, 0.6325654554029962],
        distance: 0.01223670485943531,
      },
    ],
    messages: {
      "path-65": "Go Straight",
      "path-62": "Go Straight",
    },
  },
  {
    id: "path-65",
    coordinates: [0.2877743313371903, 0.6325654554029962],
    neighbors: [
      {
        id: "path-64",
        coordinates: [0.30000104203199185, 0.6320709946840773],
        distance: 0.01223670485943531,
        isParent: true,
      },
      {
        id: "path-66",
        coordinates: [0.28099232817010733, 0.6321946098638072],
        distance: 0.006792134669767688,
      },
      {
        id: "path-69",
        coordinates: [0.2877743354867513, 0.6425783252362546],
        distance: 0.010012869833259191,
      },
    ],
    messages: {
      "path-69": "Turn Left",
      "path-66": "Go Straight",
      "path-64": "Go Straight",
    },
  },
  {
    id: "path-66",
    coordinates: [0.28099232817010733, 0.6321946098638072],
    neighbors: [
      {
        id: "path-65",
        coordinates: [0.2877743313371903, 0.6325654554029962],
        distance: 0.006792134669767688,
        isParent: true,
      },
      {
        id: "path-68",
        coordinates: [0.28099232920749756, 0.6234178998828761],
        distance: 0.008776709980931113,
      },
      {
        id: "path-70",
        coordinates: [0.2720133399025774, 0.6323182250435369],
        distance: 0.00897983914227306,
      },
    ],
    messages: {
      "path-68": "Turn Right",
      "path-70": "Go Straight",
      "path-65": "Go Straight",
    },
  },
  {
    id: "path-68",
    coordinates: [0.28099232920749756, 0.6234178998828761],
    neighbors: [
      {
        id: "path-66",
        coordinates: [0.28099232817010733, 0.6321946098638072],
        distance: 0.008776709980931113,
        isParent: true,
      },
    ],
    name: "TOILET",
    messages: {
      "path-66": "Go Straight",
    },
  },
  {
    id: "path-69",
    coordinates: [0.2877743354867513, 0.6425783252362546],
    neighbors: [
      {
        id: "path-65",
        coordinates: [0.2877743313371903, 0.6325654554029962],
        distance: 0.010012869833259191,
        isParent: true,
      },
    ],
    name: "SURGERY OP 63",
    messages: {
      "path-65": "Go Straight",
    },
  },
  {
    id: "path-70",
    coordinates: [0.2720133399025774, 0.6323182250435369],
    neighbors: [
      {
        id: "path-66",
        coordinates: [0.28099232817010733, 0.6321946098638072],
        distance: 0.00897983914227306,
        isParent: true,
      },
      {
        id: "path-71",
        coordinates: [0.2721088627980582, 0.6430727859551734],
        distance: 0.010754985124381205,
      },
      {
        id: "path-72",
        coordinates: [0.23141683964599932, 0.6326890678977157],
        distance: 0.04059819401777425,
      },
    ],
    messages: {
      "path-71": "Turn Left",
      "path-72": "Go Straight",
      "path-66": "Go Straight",
    },
  },
  {
    id: "path-71",
    coordinates: [0.2721088627980582, 0.6430727859551734],
    neighbors: [
      {
        id: "path-70",
        coordinates: [0.2720133399025774, 0.6323182250435369],
        distance: 0.010754985124381205,
        isParent: true,
      },
    ],
    name: "VASCULAR SURGERY OP 64",
    messages: {
      "path-70": "Go Straight",
    },
  },
  {
    id: "path-72",
    coordinates: [0.23141683964599932, 0.6326890678977157],
    neighbors: [
      {
        id: "path-70",
        coordinates: [0.2720133399025774, 0.6323182250435369],
        distance: 0.04059819401777425,
        isParent: true,
      },
      {
        id: "path-73",
        coordinates: [0.2180438770280144, 0.6328126830774455],
        distance: 0.013373533934404996,
      },
      {
        id: "path-81",
        coordinates: [0.23122580215415986, 0.6429244458599905],
        distance: 0.010237160609949864,
      },
    ],
    messages: {
      "path-81": "Turn Left",
      "path-73": "Go Straight",
      "path-70": "Go Straight",
    },
  },
  {
    id: "path-73",
    coordinates: [0.2180438770280144, 0.6328126830774455],
    neighbors: [
      {
        id: "path-72",
        coordinates: [0.23141683964599932, 0.6326890678977157],
        distance: 0.013373533934404996,
        isParent: true,
      },
      {
        id: "path-74",
        coordinates: [0.21002009904226734, 0.6329362982571752],
        distance: 0.00802473014357608,
      },
      {
        id: "path-80",
        coordinates: [0.21804387702801437, 0.6802563690876368],
        distance: 0.04744368601019122,
      },
    ],
    messages: {
      "path-80": "Turn Left",
      "path-74": "Go Straight",
      "path-72": "Go Straight",
    },
  },
  {
    id: "path-74",
    coordinates: [0.21002009904226734, 0.6329362982571752],
    neighbors: [
      {
        id: "path-73",
        coordinates: [0.2180438770280144, 0.6328126830774455],
        distance: 0.00802473014357608,
        isParent: true,
      },
      {
        id: "path-75",
        coordinates: [0.19368597645911145, 0.6329362982571752],
        distance: 0.01633412258315589,
      },
      {
        id: "path-79",
        coordinates: [0.20982905325130582, 0.6423310888355221],
        distance: 0.009396732863354157,
      },
      {
        id: "path-84",
        coordinates: [0.2099555458117454, 0.6228606400317153],
        distance: 0.010075865014769203,
      },
    ],
    messages: {
      "path-84": "Turn Right",
      "path-79": "Turn Left",
      "path-75": "Go Straight",
      "path-73": "Go Straight",
    },
  },
  {
    id: "path-75",
    coordinates: [0.19368597645911145, 0.6329362982571752],
    neighbors: [
      {
        id: "path-74",
        coordinates: [0.21002009904226734, 0.6329362982571752],
        distance: 0.01633412258315589,
        isParent: true,
      },
      {
        id: "path-76",
        coordinates: [0.18212791358399205, 0.6325654527179861],
        distance: 0.011564010715973494,
      },
      {
        id: "path-78",
        coordinates: [0.19349493274293048, 0.6425783212087391],
        distance: 0.009643915402987393,
      },
    ],
    messages: {
      "path-76": "Go Straight",
      "path-74": "Go Straight",
      "path-78": "Turn Left",
    },
  },
  {
    id: "path-76",
    coordinates: [0.18212791358399205, 0.6325654527179861],
    neighbors: [
      {
        id: "path-75",
        coordinates: [0.19368597645911145, 0.6329362982571752],
        distance: 0.011564010715973494,
        isParent: true,
      },
      {
        id: "path-77",
        coordinates: [0.17037880906747216, 0.6347905340081511],
        distance: 0.01195794479364871,
      },
    ],
    messages: {
      "path-75": "Go Straight",
      "path-77": "Go Straight",
    },
  },
  {
    id: "path-77",
    coordinates: [0.17037880906747216, 0.6347905340081511],
    neighbors: [
      {
        id: "path-76",
        coordinates: [0.18212791358399205, 0.6325654527179861],
        distance: 0.01195794479364871,
        isParent: true,
      },
    ],
    name: "KHRWS CT.SCAN/LAB",
    messages: {
      "path-76": "Go Straight",
    },
  },
  {
    id: "path-78",
    coordinates: [0.19349493274293048, 0.6425783212087391],
    neighbors: [
      {
        id: "path-75",
        coordinates: [0.19368597645911145, 0.6329362982571752],
        distance: 0.009643915402987393,
        isParent: true,
      },
    ],
    name: "BIOPSY OT 61",
    messages: {
      "path-75": "Go Straight",
    },
  },
  {
    id: "path-79",
    coordinates: [0.20982905325130582, 0.6423310888355221],
    neighbors: [
      {
        id: "path-74",
        coordinates: [0.21002009904226734, 0.6329362982571752],
        distance: 0.009396732863354157,
        isParent: true,
      },
    ],
    name: "61A",
    messages: {
      "path-74": "Go Straight",
    },
  },
  {
    id: "path-80",
    coordinates: [0.21804387702801437, 0.6802563690876368],
    neighbors: [
      {
        id: "path-73",
        coordinates: [0.2180438770280144, 0.6328126830774455],
        distance: 0.04744368601019122,
        isParent: true,
      },
    ],
    name: "ADMISSION O.P TICKET COUNTER",
    messages: {
      "path-73": "Go Straight",
    },
  },
  {
    id: "path-81",
    coordinates: [0.23122580215415986, 0.6429244458599905],
    neighbors: [
      {
        id: "path-72",
        coordinates: [0.23141683964599932, 0.6326890678977157],
        distance: 0.010237160609949864,
        isParent: true,
      },
    ],
    name: "62 INFECTIOUS DISEASES",
    messages: {
      "path-72": "Go Straight",
    },
  },
  {
    id: "path-83",
    coordinates: [0.3816716466486491, 0.6410702101090143],
    neighbors: [
      {
        id: "path-59",
        coordinates: [0.38157612582794886, 0.6318237535845777],
        distance: 0.009246949901750566,
        isParent: true,
      },
    ],
    name: "LIFT",
    messages: {
      "path-59": "Go Straight",
    },
  },
  {
    id: "path-84",
    coordinates: [0.2099555458117454, 0.6228606400317153],
    neighbors: [
      {
        id: "path-74",
        coordinates: [0.21002009904226734, 0.6329362982571752],
        distance: 0.010075865014769203,
        isParent: true,
      },
      {
        id: "path-85",
        coordinates: [0.2160211402301009, 0.6226752172621207],
        distance: 0.006068427906094773,
      },
    ],
    messages: {
      "path-85": "Turn Right",
      "path-74": "Go Straight",
    },
  },
  {
    id: "path-85",
    coordinates: [0.2160211402301009, 0.6226752172621207],
    neighbors: [
      {
        id: "path-84",
        coordinates: [0.2099555458117454, 0.6228606400317153],
        distance: 0.006068427906094773,
        isParent: true,
      },
    ],
    name: "VPSTAIR RAIL",
    messages: {
      "path-84": "Go Straight",
    },
  },
];
