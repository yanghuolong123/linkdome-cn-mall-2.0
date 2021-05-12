
// var ctx = null;
export let t = 0; //贝塞尔函数涉及的占比比例，0<=t<=1
export let origin_nodes = [] ;//点击的控制点对象数组
export let bezierNodes = []; //绘制内部控制点的数组
export let isPrinting = false ;//正在绘制中
export let num = 0 ;//控制点数
export let clickon = 0; //鼠标按下时间戳
export let clickoff = 0; //鼠标抬起
export var nodesss = [];
export var pathNodes = [];
export const  drawBezier = (ctx, origin_nodes,color) => {
    if(t > 1) {
        // drawCircle(ctx,origin_nodes[0].x, origin_nodes[0].y,true)
        // drawCircle(ctx,origin_nodes[2].x, origin_nodes[2].y,true)
    	// drawArrow(ctx, origin_nodes[1].x, origin_nodes[1].y, origin_nodes[2].x, origin_nodes[2].y, 20, 10, 2, color);
    	t = 0;
        bezierNodes  = []
        pathNodes.push(nodesss)
        nodesss = [];
        return 
    }
    var nodes = origin_nodes
    t += 0.01
    drawnode(ctx, nodes,color)
    drawBezier(ctx, nodes,color)
}
 const drawnode = (ctx, nodes,color) => {

    if(!nodes.length) return
    var _nodes = nodes
    var next_nodes = []
    _nodes.forEach(function(item, index) {
        var x = item.x,
            y = item.y    
        if(_nodes.length === 1) {
            bezierNodes.push(item)
            if(bezierNodes.length > 1) {
                bezierNodes.forEach(function (obj, i) {
                    if (i) {
                        var startX = bezierNodes[i - 1].x,
                            startY = bezierNodes[i - 1].y,
                            x = obj.x,
                            y = obj.y
                            ctx.beginPath()
                            ctx.moveTo(startX, startY)
                            ctx.lineTo(x, y)
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = color
                            ctx.stroke()
                            if(t.toFixed(2)==0.99){
                                let nObjs = {};
                                nObjs.x = x;
                                nObjs.y = y;
                                nodesss.push(obj)
                            }
                    }
                })
            }
        }
    })  
    if(_nodes.length) {
        for(var i = 0; i < _nodes.length - 1; i++) {
            var arr = [{
                x: _nodes[i].x,
                y: _nodes[i].y
            }, {
                x: _nodes[i + 1].x,
                y: _nodes[i + 1].y 
            }]
            next_nodes.push(bezier(arr, t))
            
        }
        drawnode(ctx,next_nodes,color)
    }

}
const  factorial = (num)=> { //递归阶乘
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

const bezier = (arr, t) => { //通过各控制点与占比t计算当前贝塞尔曲线上的点坐标
    var x = 0,
        y = 0,
        n = arr.length - 1
    arr.forEach(function(item, index) {
        if(!index) {
            x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        } else {
            x += factorial(n) / factorial(index) / factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += factorial(n) / factorial(index) / factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        }
    })
    return {
        x: x,
        y: y
    }
}
    /**
     * 画箭头
     * @param {obj} ctx canvas的content对象
     * @param {int*} fromX 起始点x坐标
     * @param {int} fromY 起始点y坐标
     * @param {int} toX 结束点x坐标 
     * @param {int} toY 结束点y坐标
     * @param {int} theta 箭头夹角
     * @param {int} headlen 斜边长度
     * @param {int} width 箭头宽度
     * @param {string}} color 颜色
     */
    	
    const drawArrow = (ctx, fromX, fromY, toX, toY, theta, headlen, width, color)=>{
        theta = typeof(theta) != 'undefined' ? theta: 30;
        headlen = typeof(theta) != 'undefined' ? headlen: 10;
        width = typeof(width) != 'undefined' ? width: 1;
        color = typeof(color) != 'color' ? color: '#000'; 
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
            angle1 = (angle + theta) * Math.PI / 180, 
            angle2 = (angle - theta) * Math.PI / 180, 
            topX = headlen * Math.cos(angle1), 
            topY = headlen * Math.sin(angle1), 
            botX = headlen * Math.cos(angle2), 
            botY = headlen * Math.sin(angle2); 
        ctx.save();
        ctx.beginPath(); 
        var arrowX = fromX - topX, 
        arrowY = fromY - topY;
        arrowX = toX + topX; 
        arrowY = toY + topY; 
        ctx.moveTo(arrowX, arrowY); 
        ctx.lineTo(toX, toY); 
        arrowX = toX + botX; 
        arrowY = toY + botY;
        ctx.lineTo(arrowX, arrowY); 
        ctx.strokeStyle = color; 
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.fillStyle=color;
        ctx.fill();
}
export const formatMiddle = (x1,y1,x2,y2,length) =>{
    var k1 = (y2-y1/x2-x1);
    var k2 = Math.tan(30);
    var x3 = (1+k1*k2)*(x1+x2)+k1*(y2-y1)*(1+k1*k2)+2*(k1*x1)*(k1-k2)/(2*(Math.pow(k1,2)+1))
    var y3 = (k1-k2)*(1+k1*k2)*(x1+x2+k1*y2-k1*y1)+2*k1*k2*(Math.pow((k1-k2),2))-2*x1*(k1-k2)*((Math.pow(k1,2)+1))/((2*(Math.pow(k1,2)+1))*(1+k1*k2))+y1
    return x3+","+y3
}
export const formatNode = (x1,y1,x2,y2,length)=>{
	var angle = Math.atan2(y2-y1,x2-x1);
    var x3 = (x1+x2)*0.5;
    var y3 = (y1+y2)*0.5;
    var xx = Math.abs(length*Math.cos(angle));
    var yy = Math.abs(length*Math.sin(angle));
    var x6 = 0;
    var y6 = 0;
    if(y2<y1&&x2>x1){  // from left down to right top
        x6 = x3+yy;
        y6= y3+xx; 
    }
    else if(y1==y2&&x1<x2){ //from left to right
        x6 = x3;
        y6 = y3+10;
    }
    else if(y1==y2&&x1>x2){//from right to left
        x6 = x3;
        y6 = y3-10;
    }
    else if(x1==x2&&y1>y2){ //from bottom to top
        x6 = x3+10;
        y6 = y3;
    }
    else if(x1==x2&&y1<y2){ //from top to bottom
        x6 = x3-10;
        y6 = y3;
    }
    else if(y2<y1&&x1>x2){//from right bottm to left top
        x6 = x3+yy;
        y6= y3-xx; 
    }
    else if(y1-y2<0&&x1-x2>0){ //from right top to left bottom 
        x6 = x3-yy;
        y6= y3-xx; 
    }
    else if(y1-y2<0&&x2-x1>0){//from left top to right bottom
        x6 = x3-yy;
        y6= y3+xx; 
    }
    var obj = {};
    obj.x = x6;
    obj.y = y6;
	return obj;
}
// export const drawCircle = (ctx,x,y,type) =>{
//     if(!Boolean(x)&&!Boolean(x)){
//         return false;   
//     }
//     if(type){
//         ctx.beginPath()
//         ctx.arc(x,y, 4, 0, Math.PI * 2, false)
//         ctx.fillStyle = "#E8585A"
//         ctx.fill()
//     }
//     ctx.beginPath()
//     ctx.lineWidth = 0.5;
//     ctx.arc(x,y, 8, 0, Math.PI * 2, false)
//     ctx.arc(x,y, 12, 0, Math.PI * 2, false)
//     ctx.strokeStyle = "#E8585A"
//     ctx.stroke();
// }
export const drawCircle = (ctx,x,y,type) =>{
if(!Boolean(x)&&!Boolean(x)){
    return false;   
}
    ctx.clearRect(x-50, y-50, 120, 120)
    ctx.beginPath()
    ctx.arc(x,y, 3, 0, Math.PI * 2, false)
    ctx.fillStyle = "#E8585A"
    ctx.fill()
    ctx.beginPath()
    ctx.lineWidth = 0.5;
    ctx.arc(x,y, type, 0, Math.PI * 2, false)
    ctx.arc(x,y, (type+2), 0, Math.PI * 2, false)
    ctx.arc(x,y, (type+4), 0, Math.PI * 2, false)
    ctx.strokeStyle = "#E8585A"
    ctx.stroke();
}