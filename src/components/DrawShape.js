import React from 'react'

const configuration = {
  edgeIconSize:70,
  edgeIconLineWidth:2,
  maxSinksNumber:4,
  sqFtShapeLimit:200,
  sqFtShapeLimitCircle:40,
  apperance:{
    gridBigCell:24,
    pixel2inchFactor:3,//to powinna byc liczba calkowita!
    gridBigColor:'#aaaaaa',
    gridCell:6,
    gridColor:'#dddddd',
    shapes:{
      fillColor:"rgba(128,128,128,0.5)",
      fillColorSelected:"rgba(128,128,128,0.8)",
      defaultMargin:20,
      lineWidth:3,
      guides:{
        color1:"#000000",
        color2:"#666666",
        guideDist:15,
      guideEndLength:15,
      centralGapLength:20
      }
    },
    shapeIconSize:100,
    edgeTypeColors:['hsl(0,50%,50%)','hsl(45,50%,50%)','hsl(90,50%,50%)','hsl(135,50%,50%)']
  }
}

export default class DrawShape extends React.Component {
  componentDidUpdate() {
    this.componentDidMount()
  }
  componentDidMount() {
    var iconDrawCanvas = document.getElementById(`iconDrawCanvas${this.props.id}`)
    var iconDrawCtx = iconDrawCanvas.getContext('2d')

    function updValuesMap(shape){
  	  for(var i = 0;i<shape.params.length;i++){
  	  	shape.paramsValuesMap[shape.params[i].label]=shape.params[i].value;
  	  }
    }

    function polygon (ptsFn){
  	  return function(ctx,offset,scale,fill,withGuides,fitHorizontal,edgeShape,p2i){
		    updValuesMap(this);
        var x,y,pts = ptsFn(this.paramsValuesMap);

        if(!p2i)
          p2i = 1;

		    this.bBox.minX = Infinity;
        this.bBox.maxX = -Infinity;
        this.bBox.minY = Infinity;
        this.bBox.maxY = -Infinity;

        ctx.fillStyle = fill;
        ctx.beginPath();
	
        var deltaX=this.pos[0],deltaY=this.pos[1],scale = 1;
        var rot = this.rot;
		    scale*=p2i;

        if(fitHorizontal){
          scale = ctx.canvas.width/(100+2*configuration.apperance.shapes.defaultMargin);
          deltaX=configuration.apperance.shapes.defaultMargin;
          deltaY=configuration.apperance.shapes.defaultMargin;
          rot = 0;
        }

        pts.forEach(function(pt,i){
          x=deltaX+pt[0]*Math.cos(rot)-pt[1]*Math.sin(rot);
          y=deltaY+pt[1]*Math.cos(rot)+pt[0]*Math.sin(rot);

          if(x<this.bBox.minX){
            this.bBox.minX = x;
          }
          if(x>this.bBox.maxX){
            this.bBox.maxX = x;
          }

          if(y<this.bBox.minY){
            this.bBox.minY = y;
          }
          if(y>this.bBox.maxY){
            this.bBox.maxY = y;
          }

          x*=scale;
          y*=scale;

          if(i==0)
            ctx.moveTo(x,y);
          else
            ctx.lineTo(x,y);


        },this);
        ctx.closePath();
        ctx.fill();

        var that = this;
        ctx.lineWidth = configuration.apperance.shapes.lineWidth;
        pts.reduceRight(function(ptA,ptB,i){
          //console.log(edgeShape,that,edgeShape || that)
          var thatEdges;

          if(edgeShape) {

            thatEdges = edgeShape;
          }else{

            thatEdges = that;
          }

          if(!thatEdges.params[i].isValidEdge){
            return ptB;
          }

          ctx.strokeStyle
            = configuration.
              apperance.
              edgeTypeColors[thatEdges.params[i].isBacksplash?3:(thatEdges.params[i].edgeType-1)];

          ctx.beginPath();

          var xA=deltaX+ptA[0]*Math.cos(rot)-ptA[1]*Math.sin(rot);
          var yA=deltaY+ptA[1]*Math.cos(rot)+ptA[0]*Math.sin(rot);

          var xB=deltaX+ptB[0]*Math.cos(rot)-ptB[1]*Math.sin(rot);
          var yB=deltaY+ptB[1]*Math.cos(rot)+ptB[0]*Math.sin(rot);

          xA*=scale;
          yA*=scale;
          xB*=scale;
          yB*=scale;


          ctx.moveTo(xA,yA);
          ctx.lineTo(xB,yB);
          ctx.stroke();
          return ptB;
        },pts[0]);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        if(withGuides){
          pts.reduceRight(function(ptA,ptB,i){
            ctx.strokeStyle
              = configuration.
                apperance.
                shapes.
                guides[that.params[i].isEditable?'color1':'color2']

            ctx.beginPath();

            var xA=deltaX+ptA[0]*Math.cos(rot)-ptA[1]*Math.sin(rot);
            var yA=deltaY+ptA[1]*Math.cos(rot)+ptA[0]*Math.sin(rot);

            var xB=deltaX+ptB[0]*Math.cos(rot)-ptB[1]*Math.sin(rot);
            var yB=deltaY+ptB[1]*Math.cos(rot)+ptB[0]*Math.sin(rot);

            xA*=scale;
            yA*=scale;
            xB*=scale;
            yB*=scale;

            var dX = xA-xB;
            var dY = yA-yB;

            var l = Math.sqrt(dX*dX+dY*dY);

            dX/=l;
            dY/=l;

            var guideDist = configuration.apperance.shapes.guides.guideDist;

            var guideEndLength= configuration.apperance.shapes.guides.guideEndLength;

            var centralGapLength =  configuration.apperance.shapes.guides.centralGapLength;

            ctx.moveTo(xA+dY*guideDist-dX*(l-centralGapLength)/2,yA-dX*guideDist-dY*(l-centralGapLength)/2);
            ctx.lineTo(xA+dY*guideDist,yA-dX*guideDist);

            ctx.moveTo(xB+dY*guideDist+dX*(l-centralGapLength)/2,yB-dX*guideDist+dY*(l-centralGapLength)/2);
            ctx.lineTo(xB+dY*guideDist,yB-dX*guideDist);

            that.params[i].left = (xA+xB)/2+dY*guideDist;
            that.params[i].top = (yA+yB)/2-dX*guideDist;

            ctx.font = '16px Arial'
            ctx.fillText(that.params[i].label, that.params[i].left-4, that.params[i].top + 4)

            ctx.moveTo(xA+dY*(guideDist-guideEndLength/2),yA-dX*(guideDist-guideEndLength/2));
            ctx.lineTo(xA+dY*(guideDist+guideEndLength/2),yA-dX*(guideDist+guideEndLength/2));

            ctx.moveTo(xB+dY*(guideDist-guideEndLength/2),yB-dX*(guideDist-guideEndLength/2));
            ctx.lineTo(xB+dY*(guideDist+guideEndLength/2),yB-dX*(guideDist+guideEndLength/2));

            ctx.stroke();

            return ptB;
          },pts[0]);
        }
      }
    }

    var drawFunctionsFactories = {
      polygon:polygon,
      //circle:circle
    }
  
    function ShapeDefinition(rawDef, withGuides){		
      
      if (withGuides == null) withGuides = false

      let drawFn =  rawDef.drawFn
      if(rawDef.drawFn[0] != null) {
        rawDef.drawFn = drawFunctionsFactories[rawDef.drawFn[0]](rawDef.drawFn[1]);

        rawDef.generate = function(isProto){
          var generated = {
            get rot(){
                  return Math.PI*this.rotDeg/180;
                },
            get isValid() {
                return this.params.reduce(function(result,param){
                  return result && param.isValidEdge && param.isValidValue
                },true);
              }
            };
    
            generated.params  = rawDef.params.map(function(label,i){
              var isBacksplash = false;
              var eT = null;
              return {
                isEditable:Boolean(label.match(/[A-Z]/)),
                label:label.toUpperCase(),
                value:isProto?rawDef.defaultParams[i]:null,
                left:120,
                top:120,
                prototypical:rawDef.prototypical && rawDef.prototypical.params[i],
                set edgeType(et){
                  eT = et
                },
                get edgeType(){
                  if(!generated.rotable){
                    return 3;
                  }
    
                  return eT;
                },
                errorStr:rawDef.errors[i],
                set isBacksplash(isB){
                  if(isB){
                    //this.edgeType=1
                  }
                  isBacksplash = isB
                },
                get isBacksplash(){
    
                  if(!generated.rotable){
                    return false
                  }
    
                  if(this.edgeType!=1)
                    isBacksplash = false;
    
                  return isBacksplash;								
                },
                get isValidEdge() {
    
                  if(!generated.rotable){
                    return true;
                  }
    
                  return (this.edgeType!==null);
                },
                get isValidValue() {
                  updValuesMap(generated);
                  return (!this.isEditable || 
                      ( 
                      this.value!=null &&
                        ( 
                          rawDef.paramsValidFn[i] == null || rawDef.paramsValidFn[i](generated.paramsValuesMap)
                        ) 
                      ) 
                    )
                },
                color:configuration.apperance.shapes.guides[Boolean(label.match(/[A-Z]/))?'color1':'color2']				
              }
            });
            generated.rawDef = rawDef;
            generated.pos = [configuration.apperance.shapes.defaultMargin,configuration.apperance.shapes.defaultMargin];
            generated.rotDeg = 0;
            generated.isProto = isProto;
            generated.rotable = !Boolean(rawDef.notRotable);
    
    
            generated.bBox = {
              minX:Infinity,
              maxX:-Infinity,
              minY:Infinity,
              maxY:-Infinity
            }
            generated.drawFn = rawDef.drawFn;
            generated.paramsValuesMap = {};
            generated.getArea = function(){
              updValuesMap(generated);
              return rawDef.areaFn(generated.paramsValuesMap);
            };
            
    
          return generated;
        }
    
        rawDef.prototypical = rawDef.generate(true);
      
        iconDrawCanvas.width = iconDrawCanvas.width;
        rawDef.drawFn = drawFn
        rawDef.prototypical.drawFn(
                  iconDrawCtx,
                  null,
                  null,
                  "#999",
                  withGuides,
                  true
                  );
      } else {
        iconDrawCanvas.width = iconDrawCanvas.width;
        rawDef.drawFn(
          iconDrawCtx,
          null,
          null,
          "#999",
          withGuides,
          true
          );
      }
  
      rawDef.iconURIData = iconDrawCanvas.toDataURL();
      
      return rawDef;		
    }
    let handleShapeFn = this.props.handleChange
    let shape = ShapeDefinition(this.props.rawDef, this.props.withGuides)

    if(handleShapeFn) {
      handleShapeFn(shape.prototypical)
    }
  }

  render() {
    return ( 
      <canvas id={`iconDrawCanvas${this.props.id}`} 
        width={this.props.width} 
        height={this.props.height}
        style={this.props.style ? this.props.style : undefined}
        />
    )
  }
}