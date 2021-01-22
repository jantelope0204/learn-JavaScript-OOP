//食物对象 Food
//食物定位
;(function (window) {
    //js 自调用封装独享(闭包),
    const position = 'absolute'
    //创建食物对象 js 函数首字符大写
    //生成的食物对象个数
    const elements = []
    const document = window.document

    function Food(x, y, width, height, color) {
        //出现的 坐标轴
        this.x = x || 0
        this.y = y || 0
        //大小
        this.width = width || 20
        this.height = height || 20
        this.color = color || 'green'
    }
    //接下来的的食物对象都要随机方式出现在屏幕上 构建render 方法
    //参数map 存放
    Food.prototype.render = function (map) {
        // 随机食物的位置，map.宽度/food.宽度，总共有多少分food的宽度，随机一下。然后再乘以food的宽度
        this.x = parseInt(Math.random() * (map.offsetWidth / this.width));
        this.y = parseInt(Math.random() * (map.offsetHeight / this.height));
        //出现div 对象
        let div = document.createElement("div");
        map.appendChild(div)
        div.style.position = position
        div.style.width = this.width + 'px'
        div.style.height = this.height + 'px'
        div.style.left = this.x + 'px'
        div.style.top = this.y + 'px'
        div.style.backgroundColor = this.color
        elements.push(div)
    }
    //通过自调用函数，进行封装，通过window暴露Food对象
    window.Food = Food
}(window, undefined))

//构建蛇的对象
;(function (window) {
    //闭包 可以出现同名的变名称 而且会互不干扰
    const position = 'absolute'
    const elements = []
    const document = window.document
    function Snake(width,height,direction) {
        // 设置每一个蛇节的宽度
        this.width = width || 20
        this.height = height || 20
        //蛇头运动的方向
        this.direction = direction || 'left'
        //蛇的每一部分,蛇头以及蛇尾
        this.body = [
            {x:3,y:3,color:'red'},//蛇头
            {x:2,y:2,color:'red'},
            {x:1,y:1,color:'red'}
        ]
    }
    //原型构造蛇对象
    Snake.prototype.render = function (map) {
        //构建一个蛇的div
        //游戏只能有一条蛇 需要在生成之前删除原有的蛇
        for (let i = 0; i < this.body.length; i++) {
            let obj = this.body[i];
            let div = document.createElement("div");
            map.appendChild(div);
            div.style.left = obj.x * this.width + 'px'
            div.style.top = obj.y * this.height + 'px'
            div.style.width = this.height + 'px'
            div.style.height = this.height + 'px'
            div.style.position = position
            div.style.backgroundColor = obj.color
            elements.push(div)
        }
    }
    //共有行为 移动
    Snake.prototype.move = function (food, direction) {
        //蛇头增加一节 蛇尾减少一节
        //todo

    }

})(window,undefined)



