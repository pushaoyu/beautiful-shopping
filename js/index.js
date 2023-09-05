// 需要将所有的DOM元素对象以及相关的资源全部加载完毕之后,再来实现的事件函数
window.onload = function () {
    var bigImgIndex = 0

    // 路径导航的数据渲染
    function navPathDataBind() {
        // 获取导航容器
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath')
        // 获取数据
        var path = goodData.path
        // 遍历数据
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) { // 最后一个数据没有url
                var aNode = document.createElement('a')
                aNode.innerText = path[i].title
                navPath.appendChild(aNode)
            } else {
                var aNode = document.createElement('a')
                aNode.href = path[i].url
                aNode.innerText = path[i].title
                var iNode = document.createElement('i')
                iNode.innerText = '/'
                navPath.appendChild(aNode)
                navPath.appendChild(iNode)
            }
        }
    }

    // 放大镜的移入和移出
    function bigClassBind() {
        /**
         * 1.获取小图框元素对象,并设置移入事件(onmouseenter)
         * 2.动态的创建蒙版元素以及大图框的和大图片元素
         * 3.移出(onmouseleave)时需要移除蒙版元素和大图框
         * */
        var smallPic = document.querySelector('#wrapper #content .contentMain #container #left #leftTop #smallPic')
        var leftTop = document.querySelector('#wrapper #content .contentMain #container #left #leftTop')
        smallPic.onmouseenter = function () {
            var divMask = document.createElement('div')
            divMask.className = 'mask'

            var imagessrc = goodData.imagessrc

            // 创建大图框元素
            var bigPic = document.createElement('bigPic')
            bigPic.id = 'bigPic'

            // 创建大图片元素
            var bigImg = document.createElement('img')
            bigImg.src = imagessrc[bigImgIndex].b

            bigPic.appendChild(bigImg)
            smallPic.appendChild(divMask)
            leftTop.appendChild(bigPic)

            // 设置移动事件
            smallPic.onmousemove = function (event) {
                //event.clientX:鼠标点距离浏览器左侧X轴的值
                // smallPic.getBoundingClientRect().left: 小图框元素距离浏览器左侧可视left值
                // offsetWidth: 为元素的占位宽度
                // left: 蒙版元素距离图框左侧距离

                var left = event.clientX - smallPic.getBoundingClientRect().left - divMask.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - divMask.offsetHeight / 2;

                if (left < 0) {
                    left = 0
                } else if (left > smallPic.clientWidth - divMask.offsetWidth) {
                    left = smallPic.clientWidth - divMask.offsetWidth
                }

                if (top < 0) {
                    top = 0
                } else if (top > smallPic.clientHeight - divMask.offsetHeight) {
                    top = smallPic.clientHeight - divMask.offsetHeight
                }

                // 设置left和top属性
                divMask.style.left = left + 'px'
                divMask.style.top = top + 'px'

                // 移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
                var scale = (smallPic.clientWidth - divMask.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth)
                // console.log(scale); // 0.495

                bigImg.style.left = -left / scale + 'px'
                bigImg.style.top = -top / scale + 'px'
            }

            // 设置移出事件
            smallPic.onmouseleave = function () {
                // 让小图框移除蒙版元素
                smallPic.removeChild(divMask)
                leftTop.removeChild(bigPic)

            }
        }
    }

    // 动态渲染放大镜缩略图的数据
    function thumbnaiData() {
        /**
         * 1.先获取piclist元素下的ul
         * 2.在获取data.js文件下的goodData-->imagessrc
         * 3.遍历数组,根据数组的长度来创建li元素
         * */

        var ul = document.querySelector('#wrapper #content .contentMain #container #left #leftBottom #piclist ul')
        var imagessrc = goodData.imagessrc
        for (var i = 0; i < imagessrc.length; i++) {
            var newLi = document.createElement('li')
            var newImg = document.createElement('img')
            newImg.src = imagessrc[i].s
            newLi.appendChild(newImg)
            ul.appendChild(newLi)
        }
    }

    // 缩略图的点击事件
    function thumbnaiClick() {
        /**
         * 1.获取所有的li元素,并且循环绑定点击事件
         * 2.点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有的src值
         * */
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #container #left #leftBottom #piclist ul li')
        var smallPic_img = document.querySelector('#wrapper #content .contentMain #container #left #leftTop #smallPic img')
        var imagessrc = goodData.imagessrc

        //小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPic_img.src = imagessrc[0].s

        for (var i = 0; i < liNodes.length; i++) {
            liNodes[i].index = i
            liNodes[i].onclick = function () {
                var idx = this.index
                bigImgIndex = idx

                // 变幻小图路径
                smallPic_img.src = imagessrc[idx].s
            }
        }


    }

    // 缩略图轮播效果
    function thumbnaiMove() {
        /**
         * 1.先获取左右两端的箭头按钮
         * 2.再获取可视的div以及ul元素和所有的li元素
         * 3.然后再发生点击事件
         * */
        var prev = document.querySelector('#wrapper #content .contentMain #container #left #leftBottom a.prev')
        var next = document.querySelector('#wrapper #content .contentMain #container #left #leftBottom a.next')
        var ul = document.querySelector('#wrapper #content .contentMain #container #left #leftBottom #piclist ul')
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #container #left #leftBottom #piclist ul li')

        //起点
        var start = 0
        // 步长
        var step = (liNodes[0].offsetWidth + 20) * 2
        //总体运动的距离值 = ul的宽度 - div框的宽度 = (图片的总数 - div中显示的数量) * (li的宽度+20)
        var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        prev.onclick = function () {
            start -= step
            if (start < 0) {
                start = 0
            }
            ul.style.left = -start + 'px'
        }

        next.onclick = function () {
            start += step
            if (start > endPosition) {
                start = endPosition
            }
            ul.style.left = -start + 'px'
        }
    }

    // 商品详情数据的动态渲染
    function rightTopData() {
        /**
         * 1.查找rightTop元素
         * 2.查找data.js->goodData->goodsDetail
         * 3.建立一个字符串变量,将原来的布局结构贴进来,将所对应的数据放在对应的位置上重新渲染rightTop元素
         * */
        var rightTop = document.querySelector('#wrapper #content .contentMain #container .right .rightTop')
        var goodsDetail = goodData.goodsDetail

        var s = `<h3>${goodsDetail.title}</h3>
        <p>${goodsDetail.recommend}</p>
        <div class="priceWrap">
            <div class="priceTop">
                <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                <div class="price">
                    <span>$</span>
                    <p>${goodsDetail.price}</p>
                    <i>降价通知</i>
                </div>
                <p>
                    <span>累计评价</span>
                    <span>${goodsDetail.evaluateNum}</span>
                </p>
            </div>
            <div class="priceBottom">
                <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                <p>
                    <span>${goodsDetail.promoteSales.type}</span>
                    <span>${goodsDetail.promoteSales.content}</span>
                </p>
            </div>
        </div>
        <div class="support">
            <span>支&nbsp;&nbsp;&nbsp;持</span>
            <span>${goodsDetail.support}</span>
        </div>
        <div class="address">
            <span>配送至</span>
            <p>${goodsDetail.address}</p>
        </div>`

        // 重新渲染rightTop元素
        rightTop.innerHTML = s
    }

    // 商品参数数据的动态渲染
    function rightBottomData() {
        /**
         * 1.找rightBottom的元素对象
         * 2.查找data.js->goodData.goodsDatail.crumData数据
         * 3.由于数据是一个数组,需要遍历,有一个元素则需要有一个动态的dl元素对象(dt,dd)
         * */
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #container .right .rightBottom .chooseWrap')
        var crumbData = goodData.goodsDetail.crumbData
        // console.log(crumbData);
        for (var i = 0; i < crumbData.length; i++) {
            var dlNode = document.createElement('dl')
            var dtNode = document.createElement('dt')
            dtNode.innerText = crumbData[i].title
            dlNode.appendChild(dtNode)
            for (var k = 0; k < crumbData[i].data.length; k++) {
                var ddNode = document.createElement('dd')
                ddNode.innerText = crumbData[i].data[k].type
                ddNode.setAttribute('price',crumbData[i].data[k].changePrice)
                dlNode.appendChild(ddNode)
            }
            // console.log(ddNode);
            chooseWrap.appendChild(dlNode)
        }
    }

    // 点击商品参数之后的颜色排他效果
    function clickddBind() {
        /**
         * 1.获取所有的dl元素,取其中一个dl元素下的所有dd先做实验
         * 2.循环所有的dd元素并且添加点击事件
         * 3.确定实际发生事件的目标源对象设置其文字颜色效果为红色,然后给其他所有的的元素颜色都重置为基础颜色(#666)
         * ===================================================================================================
         * 
         * 点击dd之后产生的mark标记
         * 1.首先先来创建一个可以容纳点击的dd元素的容器(数组),确定数组的起始长度
         * 2.然后再将点击的dd元素的值按照对应下标来写入到数组的元素身上
         * */
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #container .right .rightBottom .chooseWrap dl')
        var arr = new Array(dlNodes.length)
        var choose = document.querySelector('#wrapper #content .contentMain #container .right .rightBottom .choose')
        // console.log(choose);
        arr.fill(0)
        

        for (var i = 0; i < dlNodes.length; i++) {
            (function (i) {
                var ddNodes = dlNodes[i].querySelectorAll('dd')
                for (var j = 0; j < ddNodes.length; j++) {
                    ddNodes[j].onclick = function () {
                        // 清空数组里的元素
                        choose.innerHTML = ''
                        for (var k = 0; k < ddNodes.length; k++) {
                            ddNodes[k].style.color = '#666'
                        }
                        this.style.color = 'red'

                        // 点击哪一个dd元素动态产生一个新的mark标记元素
                        arr[i] = this
                        changePriceBind(arr)

                        arr.forEach((value,index)=>{
                            if(value){
                                var markDiv = document.createElement('div')
                                var aNode = document.createElement('a')
                                markDiv.innerText = value.innerText
                                markDiv.className = 'mark'
                                aNode.innerText = 'X'
                                aNode.setAttribute('index',index)

                                markDiv.appendChild(aNode)
                                choose.appendChild(markDiv)                   
                            }
                        })

                        //获取所有的a标签元素,并循环绑定点击事件
                        var allA = document.querySelectorAll('#wrapper #content .contentMain #container .right .rightBottom .choose .mark a')
                        for(var n=0;n<allA.length;n++){
                            allA[n].onclick = function(){
                                // 获取点击的a标签身上的index属性
                                var idx = this.getAttribute('index')
                                arr[idx] = 0

                                // 查找对应下标的那个dl行中的所有的dd元素
                                var ddlist = dlNodes[idx].querySelectorAll('dd')
                                for(var m=0;m<ddlist.length;m++){
                                    // 其余所有的dd的文字颜色为黑色
                                    ddlist[m].style.color = '#666'
                                }
                                // 默认的第一个dd文字颜色恢复成红色
                                ddlist[0].style.color = 'red' 
                                
                                choose.removeChild(this.parentNode)

                                //删除后调用价格变动函数
                                changePriceBind(arr)
                            }
                        }
                    }
                }
            })(i)
        }
    }

    // 价格变动的函数声明
    function changePriceBind(arr){
        /**
         * 1.获取价格的标签元素
         * 2.给每一个dd标签身上默认都设置一个自定义属性,用来记录变化的价格
         * 3.遍历arr数组,将dd元素身上的新变化的价格和自己的价格(5299)相加
         * 4.最后将计算之后的结果重新渲染到p标签上
         * */ 
        var oldPrice = document.querySelector('#wrapper #content .contentMain #container .right .rightTop .priceWrap .priceTop .price p')
        var price = goodData.goodsDetail.price
        for(var i=0;i<arr.length;i++){
            if(arr[i]){
                var changePrice = Number(arr[i].getAttribute('price'))
                price+=changePrice
            }
        }
        oldPrice.innerText = price
    }

    // 设置dot移动
    function dotMove(){
        // 计算一行可以容纳多少dot
        var num = Math.floor(window.innerWidth / 10)
        var star = document.querySelector('.satr')
        
        for(var i=0;i<num;i++){
            var dots = document.createElement('div')
            dots.className = 'dot'
            star.appendChild(dots)
            dots.style.animationDelay = Math.random()+'s'
            var r = Math.floor(Math.random()*255)
            var g = Math.floor(Math.random()*255)
            var b = Math.floor(Math.random()*255)
            dots.style.backgroundColor = 'rgb('+ r +','+ g +','+ b +',1)'
        }
    }

    // 设置卡片移入移出效果
    function cardMove(){
        var card1 = document.querySelector('#wrapper .cardContainer .card1')
        var card2 = document.querySelector('#wrapper .cardContainer .card2')
        var card3 = document.querySelector('#wrapper .cardContainer .card3')
        var card4 = document.querySelector('#wrapper .cardContainer .card4')
        var card5 = document.querySelector('#wrapper .cardContainer .card5')
        var card6 = document.querySelector('#wrapper .cardContainer .card6')
        var cardInfo1 = document.querySelector('#wrapper .cardContainer .card1 .cardInfo1')
        var cardInfo2 = document.querySelector('#wrapper .cardContainer .card2 .cardInfo2')
        var cardInfo3 = document.querySelector('#wrapper .cardContainer .card3 .cardInfo3')
        var cardInfo4 = document.querySelector('#wrapper .cardContainer .card4 .cardInfo4')
        var cardInfo5 = document.querySelector('#wrapper .cardContainer .card5 .cardInfo5')
        var cardInfo6 = document.querySelector('#wrapper .cardContainer .card6 .cardInfo6')

        card2.onmouseenter = function(){
            cardInfo1.style.width = 0+'px'
            cardInfo2.style.left = -240+'px'   
        }
        card2.onmouseleave = function(){
            cardInfo1.style.width = 400+'px'
            
        }


        card3.onmouseenter = function(){
            cardInfo1.style.width = 0+'px'
            card2.style.left = 300+'px'
            cardInfo3.style.left = -240+'px'
        }
        card3.onmouseleave = function(){
            card2.style.left = 540+'px'
            cardInfo1.style.width = 400+'px'
        }

        card4.onmouseenter = function(){
            cardInfo1.style.width = 0+'px'
            card2.style.left = 300+'px'
            card3.style.left = 460+'px'
            cardInfo4.style.left = -240+'px'
        }
        card4.onmouseleave = function(){
            card2.style.left = 540+'px'
            card3.style.left = 700+'px'
            cardInfo1.style.width = 400+'px'
        }

        card5.onmouseenter = function(){
            cardInfo1.style.width = 0+'px'
            card2.style.left = 300+'px'
            card3.style.left = 460+'px'
            card4.style.left = 620+'px'
            cardInfo5.style.left = -240+'px'
        }
        card5.onmouseleave = function(){
            cardInfo1.style.width = 0+'px'
            card2.style.left = 540+'px'
            card3.style.left = 700+'px'
            card4.style.left = 860+'px'
            cardInfo1.style.width = 400+'px'
        }
        
        card6.onmouseenter = function(){
            cardInfo1.style.width = 0+'px'
            card2.style.left = 300+'px'
            card3.style.left = 460+'px'
            card4.style.left = 620+'px'
            card5.style.left = 780+'px'
            cardInfo6.style.left = -240+'px'
        }
        card6.onmouseleave = function(){
            cardInfo1.style.width = 0+'px'
            card2.style.left = 540+'px'
            card3.style.left = 700+'px'
            card4.style.left = 860+'px'
            card5.style.left = 1020+'px'
            cardInfo1.style.width = 400+'px'
        }
    }

    // 侧边栏展开关闭
    function asideNavClose(){
        var btns = document.querySelector('#wrapper .rightNav .btns')
        var rightNav = document.querySelector('#wrapper .rightNav')
        btns.onclick = function(){
            if(rightNav.classList.contains('active')){ //如果是关闭状态
                rightNav.classList.add('asideClose')
                rightNav.classList.remove('active')
                btns.classList.remove('btnsClose')
                btns.classList.add('btnsOpen')
                
            }else{
                rightNav.classList.remove('asideClose')
                rightNav.classList.add('active')
                btns.classList.add('btnsClose')
                btns.classList.remove('btnsOpen')
            }
            
        }
    }

    navPathDataBind()
    bigClassBind()
    thumbnaiData()
    thumbnaiClick()
    thumbnaiMove()
    rightTopData()
    rightBottomData()
    clickddBind()
    dotMove()
    cardMove()
    asideNavClose()
}