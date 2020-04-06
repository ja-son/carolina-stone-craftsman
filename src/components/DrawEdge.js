import React from 'react'
import PropTypes from 'prop-types'
import configuration from './Configuration'
import Ridges from './Ridges'

class DrawEdge extends React.Component {
  drawRidge(icon,ridge,width,color,fill,strips){

    var aspectRatio = 1;
    var paths = [];

    if(this.props.aspectratio){
      aspectRatio = this.props.aspectratio;
    }

    ridge.reduce(function(currPath,point,i){
        if(point.isPathStart || i===0){
            currPath = [];
            paths.push(currPath);
        }
        currPath.push(point);
        return currPath;
  
    },null);
  
  
  
    var unit =  configuration.edgeIconSize;
  
    icon.width = configuration.edgeIconSize*aspectRatio;
    icon.height = configuration.edgeIconSize;
  
  
  if(this.props.size){
    unit =  this.props.size;
  
    icon.width = this.props.size*aspectRatio;
    icon.height = this.props.size;
  }
  
    var cx = icon.getContext('2d');
  
    var deltaY = 0;
    var deltaX = 0;
  
    cx.beginPath();
  
    if(!color)
        color = '#d56324';
  
    cx.strokeStyle = color;
  
    if(!width)
        width = 1;
  
    cx.lineWidth = configuration.edgeIconLineWidth;
    cx.fillStyle = '#d56324';
  
    var scale = 0.75;
  
    if(paths.length>1) {
  
        deltaY = 0.5;
        deltaX = 0.5;
        scale = 0.4;
    }
  
  deltaX+=(aspectRatio-1)/0.75;
  
  
    var maxX = ridge.reduce(function(pA,pB,i){
        if(pA[0]>pB[0])
            return pA
        else
            return pB
    })[0];
  
    ridge.reduce(function(pA,pB,i){
  
        if(pB.isPathStart){
  
            cx.closePath();
  
            if(fill)
                cx.fill();
  
            cx.stroke();
  
            cx.beginPath();
  
            return pB;
        }
  
  
  
        if(strips){
            cx.beginPath();
            cx.strokeStyle = (i%2==0)?'red':'green';
            cx.lineWidth = 2;
        }
  
        if(i==1 || strips || pA.isPathStart) {
  
            cx.moveTo(
                    Math.max(1+cx.lineWidth,((1 - scale) / 2 + scale * (pA[0] + deltaX + (1 - maxX))) * unit),
                    ((1 - scale) / 2 + scale * (pA[1] - deltaY)) * unit
            );
  
        }
  
        cx.lineTo(
                Math.max(1+cx.lineWidth,((1-scale)/2+scale*(pB[0]+deltaX+(1-maxX)))*unit),
                ((1-scale)/2+scale*(pB[1]-deltaY))*unit
        );
  
        if(strips){
  
  
            cx.stroke();
            cx.closePath();
  
        }
  
        return pB;
    });
  
    cx.closePath();
  
    if(fill)
        cx.fill();
  
    cx.stroke();
  }

  componentDidMount() {
    var canvas = document.getElementById(`ridgeIcon${this.props.id}`)
    var edge = Ridges.edgeByName(this.props.name)
    var width = this.props.width ? this.props.width : undefined
    this.drawRidge(canvas, edge.edge, undefined, '#999')
  }

  render() {
    return ( 
      <canvas id={`ridgeIcon${this.props.id}`} 
          width={this.props.width} 
          height={this.props.height}
          style={this.props.style}
          ></canvas>
    )
  }
}

DrawEdge.propTypes = {
  name: PropTypes.string,
}

export default DrawEdge