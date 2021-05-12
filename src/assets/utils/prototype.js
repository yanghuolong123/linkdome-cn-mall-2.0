Number.prototype.toFix = function (n) {
  const number = this.valueOf();
  const arr = number.toString().split('.');
  //整数的情况
  if(arr.length < 2){
    return number
  }else {
    //小数点后不足n位
    if(arr[1].toString().length <= n){
      return number
    }
    return Number(number.toFixed(n))
  }

}
