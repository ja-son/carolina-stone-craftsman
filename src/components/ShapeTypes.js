var diagParam = 18;

module.exports = {
  shapeTypes: [
    {
        apiId: '1', name: 'square', params: ['A', 'B', 'c', 'd'], defaultParams: [80, 80, null, null],
        paramsValidFn: [
            function (p) {
                return p.A <= 72;
            }, 
            function (p) {
                return p.B <= 72;
            }, 
            function (p) {
                return p.C <= 72;
            }, 
            function (p) {
                return p.D <= 72;
            }],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [0, p.B]
            ]
        }], errors: ['requires consultation', 'requires consultation', 'requires consultation', 'requires consultation'],
        areaFn: function (p) {
            return p.A * p.B;
        },
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            }
        ],
        canOrderOnline: true,
        maxSideLength: 72
    },
    {
        apiId: '2', name: 'rectangle', params: ['A', 'B', 'c', 'd'], defaultParams: [100, 60, null, null],
        paramsValidFn: [
            function (p) {
                return p.A <= 72;
            }, 
            function (p) {
                return p.B <= 72;
            }, 
            function (p) {
                return p.C <= 72;
            }, 
            function (p) {
                return p.D <= 72;
            }],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [0, p.B]
            ]
        }], errors: ['requires consultation', 'requires consultation', 'requires consultation', 'requires consultation'],
        areaFn: function (p) {
            return p.A * p.B;
        },
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            }
        ],
        canOrderOnline: true,
        maxSideLength: 72
    },
    {
        apiId: '3',
        name: 'L-shape',
        params: ['A', 'B', 'c', 'd', 'E', 'F'],
        defaultParams: [80, 40, null, null, 40, 100],
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.A - p.E;
            },
            function(p) {
                return p.F - p.B;
            },
            function(p) {
                return p.E;
            },
            function(p) {
                return p.F;
            }
        ],
        paramsValidFn: [
            function (p) {
                return p.A <= 54;
            },
            function (p) {
                return !(p.F <= p.B);
            },
            null,
            null,
            function (p) {
                return !(p.A <= p.E);
            },
            function (p) {
                return p.F <= 54;
            }
        ],
        errors: ['requires consultation', 'B must be smaller than F', '', '', 'E must be smaller than A', 'requires consultation'],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [p.E, p.B],
                [p.E, p.F],
                [0, p.F]
            ]
        }],
        areaFn: function (p) {
            return p.A * p.F - p.B * p.E;
        },
        canOrderOnline: true,
        maxSideLength: 54
    },
    {
        apiId: '4',
        name: 'L-shape-mirror',
        params: ['A', 'B', 'C', 'd', 'e', 'F'],
        defaultParams: [80, 100, 40, null, null, 40],
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.C;
            },
            function(p) {
                return p.B - p.F;
            },
            function(p) {
                return p.A - p.C;
            },
            function(p) {
                return p.F;
            }
        ],
        paramsValidFn: [
            function (p) {
                return p.A <= 54;
            },
            function (p) {
                return p.B <= 54;
            },
            function (p) {
                return !(p.A <= p.C);
            },
            null,
            null,
            function (p) {
                return !(p.B <= p.F);
            }
        ],
        errors: ['requires consultation', 'requires consultation', 'C must be smaller than A', '', '', 'F must be smaller than B'],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [p.A - p.C, p.B],
                [p.A - p.C, p.F],
                [0, p.F]
            ]
        }],
        areaFn: function (p) {
            return p.A * p.B - p.F * p.C;
        },
        //po lewej tak jak jest teraz, po rawej tak jak powinno byc
        apiParametersRewrite:{
            'A':'A',
            'B':'F',
            'C':'E',
            'D':'D',
            'E':'C',
            'F':'B'
        },
        canOrderOnline: true,
        maxSideLength: 54
    },
    {
        apiId: '5',
        name: 'L-shape-diag1',
        params: ['A', 'B', 'c', 'd', 'e', 'F', 'G'],
        defaultParams: [80, 30, null, null, null, 30, 100],
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.A - p.F;
            },
            function(p) {
                return diagParam;
            },
            function(p) {
                return p.G -p.B;
            },
            function(p) {
                return p.F;
            },
            function(p) {
                return p.G;
            }
        ],
        paramsValidFn: [
            function (p) {
                return true
            },
            function (p) {
                return !(p.A <= p.F + diagParam)
            },
            null,
            null,
            null,
            function (p) {
                return !(p.G <= p.B + diagParam)
            },
            function (p) {
                return true
            }
        ],
        errors: ['', 'F must be smaller', '', '', '', 'B must be smaller', ''],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [p.F + diagParam, p.B],
                [p.F, p.B + diagParam],
                [p.F, p.G],
                [0, p.G]
            ]
        }],
        areaFn: function (p) {
            return p.A * p.G - p.F * p.B;
        },
        canOrderOnline: false
    },
    {
        apiId: '6',
        name: 'L-shape-diag1-mirror',
        params: ['A', 'B', 'C', 'd', 'e', 'f', 'G'],
        defaultParams: [80, 100, 30, null, null, null, 30],
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.C;
            },
            function(p) {
                return p.B - p.G;
            },
            function(p) {
                return diagParam;
            },
            function(p) {
                return p.A - p.C
            },
            function(p) {
                return p.G
            }
        ],
        paramsValidFn: [
            function (p) {
                return true
            },
            function (p) {
                return true
            },
            function (p) {
                return !(p.A <= p.C + diagParam)
            },
            null,
            null,
            null,
            function (p) {
                return !(p.B <= p.G + diagParam)
            }
        ],
        errors: ['', '', 'C must be smaller', '', '', '', 'G must be smaller'],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [p.A - p.C, p.B],
                [p.A - p.C, p.G + diagParam],
                [p.A - p.C - diagParam, p.G],
                [0, p.G]
            ]
        }],
        areaFn: function (p) {
            return p.A * p.B - p.C * p.G;
        },
        apiParametersRewrite: {
            'A':'A',
            'B':'G',
            'C':'F',
            'D':'E',
            'E':'D',
            'F':'C',
            'G':'B'
        },
        canOrderOnline: false
    },
    {
        apiId: '7',
        name: 'G-shape',
        params: ['A', 'B', 'C', 'D', 'e', 'f', 'G', 'H'],
        defaultParams: [100, 60, 30, 30, null, null, 30, 100],
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.C;
            },
            function(p) {
                return p.D;
            },
            function(p) {
                return p.A - p.C - p.G;
            },
            function(p) {
                return p.H - p.B + p.D;
            },
            function(p) {
                return p.G;
            },
            function(p) {
                return p.H;
            }
        ],
        paramsValidFn: [
            function (p) {
                return true
            },
            function (p) {
                return true
            },
            function (p) {
                return !(p.A <= p.C)
            },
            function (p) {
                return !(p.B <= p.D)
            },
            null,
            null,
            function (p) {
                return !(p.A - p.C <= p.G)
            },
            function (p) {
                return !(p.B - p.D >= p.H)
            }
        ],
        errors: ['', '', 'C must be smaller than A', 'D must be smaller than B', '', '', 'G must be smaller than A-C', 'H must be bigger than B-D'],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [p.A - p.C, p.B],
                [p.A - p.C, p.B - p.D],
                [p.G, p.B - p.D],
                [p.G, p.H],
                [0, p.H]
            ]
        }],
        areaFn: function (p) {
            return p.G * p.H + p.C * p.B + (p.A - p.G - p.C) * (p.B - p.D);
        },
        canOrderOnline: false
    }, 
    {
        apiId: '8',
        name: 'G-shape-mirror',
        params: ['A', 'B', 'C', 'd', 'e', 'F', 'G', 'H'],
        defaultParams: [100, 100, 30, null, null, 30, 30, 60],
        paramsLengthFn: [
            function(p) {
                return p.A;
            },
            function(p) {
                return p.B;
            },
            function(p) {
                return p.C;
            },
            function(p) {
                return p.B - p.H + p.F;
            },
            function(p) {
                return p.A - p.C - p.G;
            },
            function(p) {
                return p.F;
            },
            function(p) {
                return p.G;
            },
            function (p) {
                return p.H;
            }
        ],
        paramsValidFn: [
            function (p) {
                return true
            },
            function (p) {
                return !(p.H - p.F >= p.B)
            },
            function (p) {
                return !(p.A - p.G <= p.C)
            },
            null,
            null,
            function (p) {
                return !(p.H <= p.F)
            },
            function (p) {
                return !(p.A <= p.G)
            },
            function (p) {
                return true
            }
        ],
        errors: ['', 'B must be bigger than H-F', 'C must be smaller than A-G', '', '', 'F must be smaller than H', 'G must be smaller than A', ''],
        drawFn: ['polygon', function (p) {
            return [
                [0, 0],
                [p.A, 0],
                [p.A, p.B],
                [p.A - p.C, p.B],
                [p.A - p.C, p.H - p.F],
                [p.G, p.H - p.F],
                [p.G, p.H],
                [0, p.H]
            ]
        }],
        areaFn: function (p) {
            return p.G * p.H + p.C * p.B + (p.A - p.G - p.C) * (p.H - p.F);
        },
        apiParametersRewrite: {
            'A': 'A',
            'B': 'H',
            'C': 'G',
            'D': 'F',
            'E': 'E',
            'F': 'D',
            'G': 'C',
            'H': 'B'
        },
        canOrderOnline: false
    }
  ]
}