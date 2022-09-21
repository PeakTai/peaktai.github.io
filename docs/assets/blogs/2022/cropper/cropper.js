/**
 * 模块基类，包含基础功能.
 */
class Module {
  /**
   * 模块构造器.
   * @param {HTMLElement} rootEl 根元素
   */
  constructor(rootEl) {
    this._el = rootEl
    /** @type {Module[]} */
    this._children = []
    /** @type {Module|undefined} */
    this._parent = undefined
  }
  /**
   * 添加样式类名.
   * @param  {string[]} classNames
   * @returns {Module}
   */
  addClass(...classNames) {
    this._el.classList.add(...classNames)
    return this
  }
  /**
   * 移除样式类名.
   * @param  {string[]} classNames
   * @returns {Module}
   */
  removeClass(...classNames) {
    this._el.classList.remove(...classNames)
    return this
  }
  /**
   * 判定是否包含指定样式类名.
   * @param {string} className
   * @returns {boolean}
   */
  containsClass(className) {
    return this._el.classList.contains(className)
  }
  /**
   * @returns {Module | undefined}
   */
  getParent() {
    return this.parent
  }
  /**
   * 添加子模块.
   * @param {Module} child
   */
  addChild(child) {
    if (child.getParent()) {
      throw new Error('要添加的模块已经有父模块了，无法进行添加操作')
    }
    this._el.appendChild(child._el)
    this._children.push(child)
    child._parent = this
  }
  /**
   *
   * @param {Module | number} moduleOrIndex
   * @returns {boolean}
   */
  removeChild(moduleOrIndex) {
    /** @type { Module | undefined} */
    let child = undefined
    let index = -1
    if (typeof moduleOrIndex === 'number') {
      index = moduleOrIndex
      child = this._children[moduleOrIndex]
    } else {
      child = moduleOrIndex
      index = this._children.findIndex(c => c === moduleOrIndex)
    }
    if (!child || index === -1) {
      return false
    }
    child.parent = undefined
    child.destroy()
    this._children.splice(index, 1)
    return true
  }
  /**
   * 挂载到指定dom元素上.
   * @param {HTMLElement} parentEl
   */
  mount(parentEl) {
    if (this._parent) {
      throw new Error('已经添加至其它模块中，无法进行挂载')
    }
    parentEl.appendChild(this._el)
  }
  /**
   * 置空，销毁所有子模块.
   */
  empty() {
    ;[...this._children].forEach(c => c.destroy())
  }

  destroy() {
    this.empty()
    if (this._parent) {
      this._parent.removeChild(this)
    } else {
      this._el.remove()
    }
  }
}

/**
 * 剪裁器.
 */
class Cropper extends Module {
  /**
   *
   * @param {number} height
   */
  constructor(height) {
    super(document.createElement('div'))
    this._el.style.height = `${
      typeof height === 'number' && height > 200 && height < 1000 ? height : 400
    }px`
    /** @type {string} */
    this._imgUrl = ''
    this._render()
  }
  /**
   * @private
   * @returns {void}
   */
  _render() {
    if (!this._imgUrl) {
      // 无图片显示文件选择
      this.empty()
      this._cropbox = null
      this.addChild(
        new FilePicker({
          onChange: file => {
            this._imgUrl = URL.createObjectURL(file)
            this._render()
          }
        })
      )
      return
    }
    // 显示图片，图片加载成功后显示裁剪框
    const img = new Img({
      url: this._imgUrl,
      onError: e => {
        alert('加载图片失败')
        console.error(e)
        this._imgUrl = ''
        this._render()
      },
      onLoad: () => this._renderCropBox(img.getOccupiedArea())
    })
    this.addChild(img)
  }
  /**
   *
   * @param {{left:number,top:number,width:number,height:number}} draggableArea 可拖拽区域
   */
  _renderCropBox(draggableArea) {
    // TODO
    /** @type {CropBox|null} */
    this._cropbox = new CropBox(this._el, draggableArea)
    this.addChild(cropbox)
  }

  getCropInfo() {
    if (!this._cropbox) {
      return undefined
    }
    return this._cropbox.getCropInfo()
  }
}
/**
 * 文件选择器.
 */
class FilePicker extends Module {
  /**
   *
   * @param {{onChange:(file:File)=>void}} options
   */
  constructor(options) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpg,image/jpeg,image/png'
    super(input)
    if (options.onChange) {
      input.addEventListener('change', e => {
        const file = input.files && input.files[0] ? input.files[0] : null
        if (file && this._listener) {
          options.onChange(file)
        }
      })
    }
  }
}
/**
 * 图片
 */
class Img extends Module {
  /**
   *
   * @param {{url:string,onError:(e:any)=>void,onLoad:()=>void}} options
   */
  constructor(options) {
    const image = new Image(options.url)
    super(image)
    image.onload = options.onload
    image.onerror = options.onerror
  }

  /**
   * 获取占用的区域信息，也即是裁剪框可以使用的区域，裁剪范围不能超出区域.
   * @returns
   */
  getOccupiedArea() {
    const rect = this._el.getBoundingClientRect()
    const pRect = this._parent.getBoundingClientRect()
    return {
      left: rect.left - pRect.left,
      top: rect.top - pRect.top,
      width: rect.width,
      height: rect.height
    }
  }
}
/**
 * 可拖动模块，封装拖动事件，通过事件回调可以获取拖动的偏移位置.
 */
class DraggerModule extends Module {
  /**
   *
   * @param {{
   *  container:HTMLElement,
   *  onDragStart:()=>void
   *  onDragging:(offsetX:number,offsetY:number)=>void
   *  onDragEnd:(offsetX:number,offsetY:number)=>void
   * }} options 选项.container：容器，拖动仅发生在容器中，离开则取消.
   */
  constructor(options) {
    super(document.createElement('div'))
    this._container = options.container
    this._startCoords = { x: 0, y: 0 }
    const moveHanlder = e => {
      const offsetx = e.clientX - this._startCoords.x
      const offsetY = e.clientY - this._startCoords.y
      options.onDrag(offsetx, offsetY)
    }
    const reset = () => {
      this._startCoords = { x: 0, y: 0 }
      this._container.removeEventListener('mousemove', moveHanlder)
      this._el.removeEventListener('mouseup', endHanlder)
      this._container.removeEventListener('mouseout', endHanlder)
      this._container.removeEventListener('mouseup', endHanlder)
    }
    const endHanlder = e => {
      const offsetx = e.clientX - this._startCoords.x
      const offsetY = e.clientY - this._startCoords.y
      options.onDragEnd(offsetx, offsetY)
      reset()
    }
    this._el.addEventListener('mousedown', e => {
      e.stopPropagation()
      options.onDragStart()
      this._startCoords = { x: e.clientX, y: e.clientY }
      this._container.addEventListener('mousemove', moveHanlder)
      this._el.addEventListener('mouseup', endHanlder, { once: true })
      this._container.addEventListener('mouseout', endHanlder, { once: true })
      this._container.addEventListener('mouseup', endHanlder, { once: true })
    })
  }
}
/**
 * @typedef {object} BoundingInfo
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */
/**
 * 拖动框.
 */
class CropBox extends DraggerModule {
  /**
   *
   * @param {HTMLElement} container 容器
   * @param {{left:number,top:number,width:number,height:number}} draggableArea 可拖动区域，无论怎么拖动拖拽框始终只能在这片区域内.
   */
  constructor(container, draggableArea) {
    // 自身拖动的处理
    super({
      container,
      onDragStart: () => {
        /** @type {BoundingInfo|null} */
        this._startBoundingInfo = this._getBoundingInfo()
      },
      onDragging: (offsetX, offsetY) => this._move(offsetX, offsetY),
      onDragEnd: (offsetX, offsetY) => {
        this._move(offsetX, offsetY)
        this._startBoundingInfo = null
      }
    })
    this._draggableArea = draggableArea
    this.addClass('crop-box')
    // 默认覆盖满整个区域
    this._el.left = `${this._draggableArea.left}px`
    this._el.top = `${this._draggableArea.top}px`
    this._el.width = `${this._draggableArea.width}px`
    this._el.height = `${this._draggableArea.height}px`
    // 四个边
    this._addDraggleModule({ bottom: true }, 'drag-bar', 'left')
    this._addDraggleModule({ bottom: true }, 'drag-bar', 'right')
    this._addDraggleModule({ bottom: true }, 'drag-bar', 'top')
    this._addDraggleModule({ bottom: true }, 'drag-bar', 'bottom')
    // 四个角
    this._addDraggleModule({ bottom: true, left: true }, 'drag-btn', 'top-left')
    this._addDraggleModule({ bottom: true, left: true }, 'drag-btn', 'top-right')
    this._addDraggleModule({ bottom: true, left: true }, 'drag-btn', 'bottom-left')
    this._addDraggleModule({ bottom: true, left: true }, 'drag-btn', 'bottom-right')
  }
  /**
   * 添加拖动模块.
   * @private
   * @param {{
   *  left?:boolean,
   *  right?:boolean,
   *  top?:boolean,
   *  bottom?:boolean
   * }} directions 允许拖拽的方向
   * @param {...string} classNames
   */
  _addDraggleModule(directions, classNames) {
    this.addChild(
      new DraggerModule({
        container,
        onDragStart: () => {
          this._startBoundingInfo = this._getBoundingInfo()
        },
        onDragging: (offsetX, offsetY) =>
          this._stretch(Object.assign({ offsetX, offsetY }, directions)),
        onDragEnd: (offsetX, offsetY) => {
          this._stretch(Object.assign({ offsetX, offsetY }, directions))
          this._startBoundingInfo = null
        }
      }).addClass(...classNames)
    )
  }
  /**
   * 移动.
   * @private
   * @param {number} offsetX
   * @param {number} offsetY
   */
  _move(offsetX, offsetY) {
    if (!this._startBoundingInfo) {
      return
    }
    let newPosition = {
      left: this._startBoundingInfo.left + offsetX,
      top: this._startBoundingInfo.top + offsetY
    }
    // 判定是否超出可拖拽区域
    if (newPosition.left < this._draggableArea.left) {
      newPosition.left = this._draggableArea.left
    }
    // 右侧超出
    if (
      newPosition.left + this._startBoundingInfo.width >
      this._draggableArea.left + this._draggableArea.width
    ) {
      newPosition.left =
        this._draggableArea.left + this._draggableArea.width - this._startBoundingInfo.width
    }
    // 顶部
    if (newPosition.top < this._draggableArea.top) {
      newPosition.top = this._draggableArea.top
    }
    // 底部
    if (
      newPosition.top + this._startBoundingInfo.height >
      this._draggableArea.top + this._draggableArea.height
    ) {
      newPosition.top =
        this._draggableArea.top + this._draggableArea.height - this._startBoundingInfo.height
    }
    this._el.style.top = `${newPosition.top}px`
    this._el.style.left = `${newPosition.left}px`
  }
  /**
   * 获取当前的边界信息.
   */
  _getBoundingInfo() {
    const rect = this._el.getBoundingClientRect()
    const cRect = this._container.getBoundingClientRect()
    return {
      left: rect.left - cRect.left,
      top: rect.top - cRect.top,
      width: rect.width,
      height: rect.height
    }
  }
  /**
   * 拉伸.
   * @param {{
   *  left?:boolean,
   *  right?:boolean,
   *  top?:boolean,
   *  bottom?:boolean,
   *  offsetX:number,
   *  offsetY:number
   * }} options 选项
   */
  _stretch(options) {
    if (!this._startBoundingInfo) {
      return
    }
    // 左侧拉伸，右侧不变
    if (options.left) {
      let newLeft = this._startBoundingInfo.left + options.offsetX
      // 超出判定
      if (newLeft < this._draggableArea.left) {
        newLeft = this._draggableArea.left
      }
      // 更改宽度让右侧保持不变
      const widthDiff = this._startBoundingInfo.left - newLeft
      let newWidth = this._startBoundingInfo.width + widthDiff
      // 不得小于6，保证拖动按钮可以正常显示
      if (newWidth < 6) {
        newWidth = 6
        newLeft = this._startBoundingInfo.left + this._startBoundingInfo.width - 6
      }
      this._el.style.left = `${newLeft}px`
      this._el.style.width = `${newWidth}px`
    }
    // 右侧拉伸
    if (options.right) {
      let newWidth = this._startBoundingInfo.width + options.offsetX
      // 不得小于6，保证拖动按钮可以正常显示
      if (newWidth < 6) {
        newWidth = 6
      } else if (
        newWidth + this._startBoundingInfo.left >
        this._draggableArea.left + this._draggableArea.width
      ) {
        newWidth =
          this._draggableArea.left + this._draggableArea.width - this._startBoundingInfo.left
      }
      this._el.style.width = `${newWidth}px`
    }
    // 上
    if (options.top) {
      let newTop = this._startBoundingInfo.top + options.offsetY
      if (newTop < this._draggableArea.top) {
        newTop = this._addDraggleModule.top
      }
      // 调整高度让底部保持不变
      const heightDiff = this._startBoundingInfo.top - newTop
      let newHeight = this._startBoundingInfo.height + heightDiff
      if (newHeight < 6) {
        newHeight = 6
        newTop = this._startBoundingInfo.top + this._startBoundingInfo.height - 6
      }
      this._el.style.top = `${newTop}px`
      this._el.style.height = `${newHeight}px`
    }
    // 下
    if (options.bottom) {
      let newHeight = this._startBoundingInfo.height + options.offsetY
      if (newHeight < 6) {
        newHeight = 6
      } else if (
        this._startBoundingInfo.top + newHeight >
        this._draggableArea.top + this._draggableArea.height
      ) {
        newHeight =
          this._draggableArea.top + this._draggableArea.height - this._startBoundingInfo.top
      }
      this._el.style.height = `${newHeight}px`
    }
  }
  /**
   * 获取裁剪信息，数据都是相对于可裁剪区域的百分比.
   * @public
   * @returns {{
   *  leftPercentage:number,
   *  topPercentage:number,
   *  widthPercentage:number,
   *  heightPercentage:number
   * }}
   */
  getCropInfo() {
    const rect = this._el.getBoundingClientRect()
    const cRect = this._container.getBoundingClientRect()
    // 相对于容器的位置
    const left = rect.left - cRect.left
    const top = rect.top - cRect.top
    return {
      leftPercentage: ((left - this._draggableArea.left) * 100) / this._draggableArea.width,
      topPercentage: ((top - this._draggableArea.top) * 100) / this._draggableArea.height,
      widthPercentage: (rect.width * 100) / this._draggableArea.width,
      heightPercentage: (rect.height * 100) / this._draggableArea.height
    }
  }
}
