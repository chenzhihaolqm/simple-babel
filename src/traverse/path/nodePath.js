const types = require('../../types')
const Scope = require('./scope.js')
class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
       this.node = node
       this.parent = parent
       this.parentPath = parentPath
       this.key = key
       this.listKey = listKey
       this.__scode = null
       Object.entries(types).forEach(([key, func]) => {
          if(key.startsWith('is')) {
            this[key] = () => {
                return func.call(this, this.node)
            }
          }
       })
    }
    get scode() {
      if(this.__scode) {
        return this.__scode
      }
      const parentScope = this.parentPath && this.parentPath.scode
      this.__scode = this.isBlock ? new Scope(parentScope, this) : parentScope
      return this.__scode
    }
    isBlock() {
        return types.vistorKeys.get(this.node.type).isBlock 
    }
    replaceWith(node){
        if(this.listKey) {
            this.parent[this.key][this.listKey] = node
        }else {
            this.parent[this.key] = node
        }
        
    }
    remove() {
        if(this.listKey) {
            this.parent[this.key][this.listKey] = null
        }else {
            this.parent[this.key] = null
        }
    }
    find(func, _this) {
      let curPath = _this || this
      let isFinded = false
      if(typeof func === 'function') {
        while(curPath && !isFinded) {
            isFinded = func.call(this, curPath)
            curPath = curPath.parentPath
        }
      }
      return isFinded
    }
    findParent(func) {
        if(!this.parentPath) {
            return false
        }
        return this.find(func, this.parentPath)
    }
    traverse(visitor) {
      const node = this.node
      const traverse = require('../index.js')
      traverse(node, visitor)
    }
    _traverse(node, visitor) {
        const keys = types.vistorKeys.get(node.type)
        keys.forEach((key, index) => {
            const prop = this.node[key]
            if(Array.isArray(prop)) {
                prop.forEach(childNode => {
                    this._traverse(childNode, visitor, key, index)
                })
            } else {
                this._traverse(prop, visitor, key)
            }
        })
    }
}

module.exports = NodePath