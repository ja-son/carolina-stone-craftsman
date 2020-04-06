function squareRoundedRidge(f1,f2,n,options){

  options = options || {};

  var arr =[];
  var ang,newP;

  if(options.bevelTop){

      newP = [f1*0.5*0-(options.bevelTopAsym||0),f1*(0.5-0.5*1)];
      newP.flat = true;
      arr.push(
          newP
      );

      ang = 0;
      newP = [f1*0.5*1,f1*(0.5-0.5*0)];
      newP.flat = true;
      arr.push(
          newP
      );


  }else{
      for(var i=0;i<=n;i++){
          ang = Math.PI*(i/n)/2;
          newP = [f1*0.5*Math.sin(ang),f1*(0.5-0.5*Math.cos(ang))];
          newP.angleLeft = Math.PI*(i/n)/2;
          newP.angleRight = Math.PI*(i/n)/2;
          //newP.flat = true;
          arr.push(
              newP
          );
      }
  }

  if(options.bevelBottom){
      newP = [0.5*(f1-f2)+f2*0.5*1,(1-f2)+f2*(0.5-0.5*0)];
      newP.flat = true;
      arr.push(
          newP
      );

      newP = [0.5*(f1-f2)+f2*0.5*0,(1-f2)+f2*(0.5-0.5*-1)];
      newP.flat = true;
      arr.push(
          newP
      );
  }
  else{
      for(var i=0;i<=n;i++){
          ang = Math.PI*(1+i/n)/2;
          newP = [0.5*(f1-f2)+f2*0.5*Math.sin(ang),(1-f2)+f2*(0.5-0.5*Math.cos(ang))];
          newP.angleLeft = Math.PI*(1+i/n)/2;
          newP.angleRight = Math.PI*(1+i/n)/2;
          //newP.flat = true;
          arr.push(
              newP
          );
      }
  }

  var startPoint = [0,0];

  var backBottomPoint = [-3.5+startPoint[0],1+startPoint[1]];
  var backTopPoint = [-3.5+startPoint[0],0+startPoint[1]];

  backBottomPoint.flat = true;
  backTopPoint.flat = true;

  arr.push(backBottomPoint);
  arr.push(backTopPoint);

  return arr;
}


var DefParts = {
  turn:function(state,arr,def){


      arr[arr.length-1].angleRight = state.angle+def.angle*Math.PI/2;
      state.angle+=def.angle*Math.PI/2;

  },
  line:function(state,arr,def){


      var newP =
          [
                  state.p[0]+def.l*Math.cos(state.angle),
                  state.p[1]+def.l*Math.sin(state.angle)
          ];



      newP.angleLeft = state.angle;
      newP.angleRight = state.angle;

      arr.push(
          newP
      );
      state.p = newP;
  },
  circle:function(state,arr,def){
      var newP;

      var n = def.n;
      var r = def.r;

      var dir = 1;

      if(r<0){
          r=-r;
          dir = -1;
      }


      var scaleY = 1;

      if(def.scaleY!=undefined){
          scaleY = def.scaleY;
      }



      var center = [
          state.p[0]-dir*r*Math.sin(state.angle),
          state.p[1]+scaleY*dir*r*Math.cos(state.angle)
      ];

      for(var i=1;i<=n;i++){
          var ang = state.angle+dir*def.part*Math.PI*(i/n)/2;
          newP =
              [
                      center[0]+r*Math.sin(ang-Math.PI*0.5*(dir-1)),
                      center[1]-scaleY*r*(Math.cos(ang-Math.PI*0.5*(dir-1)))
              ];
          newP.angleLeft = ang;
          newP.angleRight = ang;
          //newP.flat = true;
          arr.push(
              newP
          );
      }

      state.angle = ang;
      state.p = newP;
  },
  bottomCrv:function(state,arr,def){



      var distY = (state.bottomY-state.p[1]);
      var part;

      if(Math.sin(state.angle)<=0)
          throw Error('borromCrv Cant by applied!');

      var L;

      if(def.r){

          L = (distY - (1+Math.cos(state.angle))*def.r)/Math.sin(state.angle);



          DefParts.line(state,arr,{l:L});
          DefParts.circle(state,arr,{
              n:def.n,
              r:def.r,
              part:(Math.PI-state.angle)/(Math.PI/2)
          });


      }else{

          L = (distY)/Math.sin(state.angle);

          DefParts.line(state,arr,{l:L});
      }

  }
}

function DefRidge(def,startPoint,opts) {

  var arr = [];

  if(!opts){
      opts = {};
  }

  if (startPoint == undefined){
      startPoint = [0, 0];
  }

  if(opts.forceDepth==undefined){
      opts.forceDepth=2.5;
  }

  if(opts.forceStartPosX===undefined){
      opts.forceStartPosX = 1;
  }

  var startPointX = startPoint[0];
  var startPointY = startPoint[1];

  startPoint.isPathStart = true;

  arr.push(startPoint);

  arr[0].angleRight = 0;
  arr.def = def;

  def.reduce(function(state,part){
      if(DefParts[Object.keys(part)[0]]!=undefined){
          DefParts[Object.keys(part)[0]](
              state,
              arr,
              part[Object.keys(part)[0]]
          );

      }else{
          throw Error('unrecognized definition part!');
      }

      return state

  },{p:arr[0],angle:0,bottomY:startPoint[1]+1});

  if(opts.mirrorY){
      arr[0].isPathStart = false;
      arr = arr.reverse();

      arr.forEach(function(point){
          point[1]=-1*point[1]+2*startPointY+1;
      });

      arr[0].isPathStart = true;

      startPoint = arr[0];

      var startPointDelta = arr[0][0];

      arr.forEach(function(point){
          point[0]-=startPointDelta-startPointX;
      });

  }
  var backBottomPoint,backTopPoint;


  if (opts.forceDepthRest) {
      backBottomPoint = [-opts.forceDepthRest + startPoint[0], 1 + startPoint[1]];
      backTopPoint = [-opts.forceDepthRest + startPoint[0], 0 + startPoint[1]];
  } else {

      var maxX = arr.reduce(function (a0, b) {
          return (a0 > b[0]) ? a0 : b[0];
      }, -Infinity);


      backBottomPoint = [-opts.forceDepth + maxX, 1 + startPoint[1]];
      backTopPoint = [-opts.forceDepth + maxX, 0 + startPoint[1]];
  }

  backBottomPoint.flat = true;
  backTopPoint.flat = true;

  arr.push(backBottomPoint);
  arr.push(backTopPoint);

  if (opts.forceStartPosX) {

      var maxX = arr.reduce(function (a0, b) {
          return (a0 > b[0]) ? a0 : b[0];
      }, -Infinity);

      arr.forEach(function(point){
          point[0] = point[0]-maxX+1;
      });
  }

  return arr;
};

function CompoundDefRidge(def1,def2,opts) {
  if(opts.deltaX==undefined){
      opts.deltaX = 0;
  }

  //console.log(def1,def1.bottomCrv)
  if(def1.slice(-1)[0].bottomCrv && def1.slice(-1)[0].bottomCrv.r !=undefined && opts.deltaX>=0){
      def1 = def1.slice(0,-1);
      def1.push({"bottomCrv":{}})
  }

  var path0 = DefRidge(def1,undefined,{
      forceDepth:2.5,
      forceStartPosX:0.1
  });
  var minX=Infinity,
      maxX=-Infinity;
  path0.forEach(function(point){
      minX = Math.min(minX,point[0]);
      maxX = Math.max(maxX,point[0]);
  });



  var path1;

  if(opts.upsideDownBottom && def2.slice(-1)[0].bottomCrv && def2.slice(-1)[0].bottomCrv.r !=undefined && opts.deltaX>=0){
      def2 = def2.slice(0,-1);
      def2.push({"bottomCrv":{}})
  }
  if(opts.specialType==undefined){
      path1 = DefRidge(def2,[opts.deltaX+maxX,1.005],{
          mirrorY:Boolean(opts.upsideDownBottom)
          ,forceDepthRest:1.3
          ,forceStartPosX:false
      });
  }else{
      path1 = DefRidge(def2,[opts.deltaX+maxX,1.005],{
          mirrorY:Boolean(opts.upsideDownBottom)
          ,forceDepth:1
          ,forceStartPosX:false
      });
  }



  return path0.concat(path1);
}

var ridgeTri = [
  [0, 0],
  [0.5, 0.5],
  [0, 1]
];

ridgeTri[0].flat = true;
ridgeTri[1].flat = true;
ridgeTri[2].flat = true;

var ridgeCustom = [
  [0, 0],
  [0.25, 0.25],
  [0, 0.5],
  [0.25, 0.75],
  [0, 1]
];

ridgeCustom[0].flat = true;
ridgeCustom[1].flat = true;
ridgeCustom[2].flat = true;
ridgeCustom[3].flat = true;
ridgeCustom[4].flat = true;


var Ridges = {
      popular:[
  {edge:squareRoundedRidge(0.2,0.2,10),name:'Straight',apiID:69},     //

  {edge:squareRoundedRidge(0.7,0.2,10),name:'¼ Round',apiID:20},     //

  {edge:squareRoundedRidge(0.75,0.2,10,{
              bevelTop:true
          }),name:'¼ Bevel',apiID:1},
                                //
  {edge:squareRoundedRidge(0.7,0.7,10),name:'¼ Round T&B',apiID:21},     //

  {edge:squareRoundedRidge(1,0.3,10),name:'Half Bullnose',apiID:72},       //

  {edge:squareRoundedRidge(1,0.3,10,{     //
      bevelTop:true,
      bevelTopAsym:0.2
  }),name:'Half Bevel',apiID:71},

  {edge:squareRoundedRidge(1,1,10),name:'Full Bullnose',apiID:74},         //

  {edge:squareRoundedRidge(1.7,0.25,10),name:'Demi Bullnose',apiID:28},     //

  {edge:squareRoundedRidge(0.7,0.7,10,{     //
      bevelTop:true,
      bevelBottom:true
  }),name:'Bevel T  B'},

  {edge:squareRoundedRidge(1.4,0.2,10,{     //
              bevelTop:true
          }),name:'1" Bevel',apiID:22}

      ]
};

var allEdgesNameDict = {};

  for (var grId in Ridges){
      Ridges[grId].forEach(function(edge){
          if(edge.name) {
            allEdgesNameDict[edge.name]=edge
          }
      });
  }


Ridges.edgeByName = function(name){
  return allEdgesNameDict[name];
};

export default Ridges;