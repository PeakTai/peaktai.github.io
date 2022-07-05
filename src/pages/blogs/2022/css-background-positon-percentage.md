### 问题重现

background-position ， 一看名字就是设置背景位置的，第一反应就是和 position 差不多，然而设置了 left 和 top 却没有和我预想的一样，总是调不到想要的位置。

![background-position 完全没有效果](/assets/blogs/2022/css-background-positon-ppercentage/sample-1.png)

完全没有效果，不管百分比设置为多少，都不会有变化，仍然是占满。把背景的尺寸改了下，好像有点效果了，但是又和预期的不一样。

![预期出现在右下角，却在正中间](/assets/blogs/2022/css-background-positon-ppercentage/sample-2.png)

看样子，background-position 和 position 还是不一样的，试了下如果单位是像素而不是百分比就和预期的一样。

### 相关文档

> 百分比值的偏移指定图片的相对位置和容器的相对位置重合。值 0%代表图片的左边界（或上边界）和容器的左边界（上边界）重合。值 100%代表图片的右边界（或下边界）和容器的右边界（或下边界）重合。值 50%则代表图片的中点和容器的中点重合。
> 当指定百分比值的时候，实际上执行了以下的计算公式（该公式可以用数学方式定义图片和容器相对位置重合）：
> <br>(container width - image width) _ (position x%) = (x offset value)
> <br>(container height - image height) _ (position y%) = (y offset value)

这是 [MDN background-position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position) 文档中关于百分比单位的说明，给了个公式，但是看了后还是有点困惑。

> A percentage for the horizontal offset is relative to (width of background positioning area-width of background image). A percentage for the vertical offset is relative to (height of background positioning area-height of background image), where the size of the image is the size given bybackground-size.

找到了 w3c 的规范文档（CSS Backgrounds and Borders Module Level 3）中的说明，看意思应该是水平和垂直方向相对位置的百分比（背景定位区域对比背景图像）。仍然还是搞不懂，不过好在 w3c 的规范文档中给了个图。

![Diagram of the meaning of background-position](/assets/blogs/2022/css-background-positon-ppercentage/diagram-of-the-meaning-of-background-position.png)

这下算是搞明白了，原来 50%的意思就是背景区域的 50%处和背景图片的 50%处对齐，如果背景图片和背景区域刚好一样大，百分比就没有意思了，不管百分之几对齐，结果都是一样的。如果没有图像演示，还真的很难搞懂定义里说的是什么意思。

background-position 的百分比参数确实有点不符合直觉，以前没有怎么注意过，毕竟百分比用的很少。
