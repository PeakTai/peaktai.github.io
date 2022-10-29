/**
 * 模块基类，包含基础功能.
 */
abstract class Module {
  private _children: Module[] = []
  private _parent?: Module

  /**
   * 模块构造器.
   */
  constructor(private _el: HTMLElement, ...classNames: string[]) {
    if (classNames.length) {
      _el.classList.add(...classNames)
    }
  }

  getParent() {
    return this._parent
  }

  getChildren() {
    return this._children
  }

  addChild(...children: Module[]) {
    children.forEach(child => {
      if (child.getParent()) {
        throw new Error('要添加的模块已经有父模块了，无法进行添加操作')
      }
      this._el.appendChild(child._el)
      this._children.push(child)
      child._parent = this
    })
  }

  removeChild(moduleOrIndex: Module | number) {
    let child: Module | undefined = undefined
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
    child._parent = undefined
    child.destroy()
    this._children.splice(index, 1)
    return true
  }
  /**
   * 挂载.
   * @param parentEl
   */
  mount(parentEl: HTMLElement) {
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
