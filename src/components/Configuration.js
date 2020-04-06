const configuration = {
  edgeIconSize:100,
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
    shapeIconSize:150,
    edgeTypeColors:['hsl(0,50%,50%)','hsl(45,50%,50%)','hsl(90,50%,50%)','hsl(135,50%,50%)']
  }
}

export default configuration