//食物对象 Food
//食物定位
;(function (window,undefined) {
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
        //页面保证只有一个食物对象 每创建一个 删除旧的
        remove()
        // 随机食物的位置，map.宽度/food.宽度，总共有多少分food的宽度，随机一下。然后再乘以food的宽度
        this.x = parseInt(Math.random() * (map.offsetWidth / this.width))*this.width;
        this.y = parseInt(Math.random() * (map.offsetHeight / this.height))*this.height;
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
    function remove(){
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.parentNode.removeChild(element);
            elements.splice(i, 1);
        }
    }
    //通过自调用函数，进行封装，通过window暴露Food对象
    window.Food = Food
}(window, undefined))

//构建蛇的对象
;(function (window,undefined) {
    //闭包 可以出现同名的变名称 而且会互不干扰
    const position = 'absolute'
    const elements = []
    const document = window.document
    function Snake(width,height,direction) {
        // 设置每一个蛇节的宽度
        this.width = width || 20
        this.height = height || 20
        //蛇头运动的方向
        this.direction = direction || 'right'
        //蛇的每一部分,蛇头以及蛇尾
        this.body = [
            {x:3,y:2,color:'blue'},//蛇头
            {x:2,y:2,color:'red'},
            {x:1,y:2,color:'red'}
        ]
    }
    //原型构造蛇对象
    Snake.prototype.render = function (map) {
        //构建一个蛇的div
        remove()
        //游戏只能有一条蛇 需要在生成之前删除原有的蛇
        for (let i = 0; i < this.body.length; i++) {
            let obj = this.body[i];
            let div = document.createElement("div");
            map.appendChild(div);
            div.style.left = obj.x * this.width + 'px'
            div.style.top = obj.y * this.height + 'px'
            div.style.width = this.width + 'px'
            div.style.height = this.height + 'px'
            div.style.position = position
            div.style.backgroundColor = obj.color
            elements.push(div)
        }
    }
    //共有行为 移动
    Snake.prototype.move = function (food, map) {
        //初始化之前删除旧有的蛇对象
        //蛇头增加一节 蛇尾减少一节
        let i = this.body.length - 1;
        for(; i > 0; i--) {
            this.body[i].x = this.body[i-1].x
            this.body[i].y = this.body[i-1].y
        }
        // 根据移动的方向，决定蛇头如何处理
        switch (this.direction){
            case 'left':
                this.body[0].x -= 1;
                break;
            case 'right':
                this.body[0].x += 1;
                break;
            case 'top':
                this.body[0].y -= 1;
                break;
            case 'bottom':
                this.body[0].y += 1;
                break;
        }
        // 在移动的过程中判断蛇是否吃到食物
        // 如果蛇头和食物的位置重合代表吃到食物
        // 食物的坐标是像素，蛇的坐标是几个宽度，进行转换
        //吃到食物 位置会重合 食物放在蛇尾,随后移动 再次展现增加的长度 稍微有点绕
        // {x: 5, y: 2, color: 'red'},
        // {x: 4, y: 2, color: 'blue'},
        // {x: 3, y: 2, color: 'blue'},
        // {x: 2, y: 2, color: 'blue'}
        // 在移动的过程中判断蛇是否吃到食物
        let headX = this.body[0].x * this.width
        let headY = this.body[0].y * this.height
        if (headX === food.x && headY === food.y) {
            //蛇尾增加一个div
            let lastDiv = this.body[this.body.length-1]
            this.body.push({
                x: lastDiv.x,
                y: lastDiv.y,
                color: lastDiv.color
            })
            food.render(map)
        }

    }
    function remove(){
        //删除蛇对象保证页只有一条蛇
        let i = elements.length-1
        for (; i >= 0; i--) {
            elements[i].parentNode.removeChild(elements[i])
            elements.splice(i, 1);
        }
    }
    //往外暴露snake对象
    window.Snake = Snake
})(window,undefined)

//游戏对象 闭包的思想
;(function (window,undefined){
    const document = window.document;
    let that = null;//game 对象
    function Game(map){
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        that = this
    }
    Game.prototype.start = function () {
        this.food.render(this.map);
        this.snake.render(this.map);
        //私有方法
        runSnake(this.snake,this.map)
        //绑定键盘事件 控制蛇的移动方向
        bingKey()

    };
    function runSnake(){
        //循环定时器
        const timeId =setInterval(function (){
            this.snake.move(this.food, this.map);
            //渲染之前删除原有的蛇
            this.snake.render(this.map);
            //判断蛇是否撞墙
            let maxX = this.map.offsetWidth / this.snake.width
            let maxY = this.map.offsetHeight / this.snake.height
            let headX = this.snake.body[0].x
            let headY = this.snake.body[0].y
            if (headX < 0 || headX >= maxX) {
                clearInterval(timeId);
                alert('Game Over');
            }
            if (headY < 0 || headY >= maxY) {
                clearInterval(timeId);
                alert('Game Over');
            }
        }.bind(that),150)
    }
    //键盘绑定函数
    function bingKey(){
        document.addEventListener("keydown", function (e) {
            //键盘
            switch (e.keyCode) {
                //根据键盘的位置控制蛇头运行方法
                case 37:
                    //left
                    this.snake.direction = 'left';
                    break;
                case 38:
                    //top
                    this.snake.direction = 'top';
                    break;
                case 39:
                    //right
                    this.snake.direction = 'right';
                    break;
                case 40:
                    //bottom
                    this.snake.direction = 'bottom';
                    break;
            }
        }.bind(that),false);
    }
    window.Game = Game
})(window,undefined)

//启动游戏 开启游戏
;(function (window,undefined){
    const document = window.document
    const map = document.getElementById("map");
    const game = new Game(map)
    game.start()
})(window,undefined);



