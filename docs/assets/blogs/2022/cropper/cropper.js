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
   * @param  {...string} classNames
   * @returns {Module}
   */
  addClass(...classNames) {
    this._el.classList.add(...classNames)
    return this
  }
  /**
   * 移除样式类名.
   * @param  {...string} classNames
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

  empty() {
    this._children.forEach(c => c.destroy())
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
