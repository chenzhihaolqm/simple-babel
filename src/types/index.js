const astDefinationsMap = new Map()
astDefinationsMap.set('Program', {
    vistors: ['body'],
    isBlock: true
})
astDefinationsMap.set('VariableDeclaration', {
    vistors: ['declarations']
})
astDefinationsMap.set('VariableDeclarator', {
    vistors: ['id', 'init']
})

astDefinationsMap.set('Identifier', {})
astDefinationsMap.set('BinaryExpression', {
    vistors: ['left', 'right']
})

astDefinationsMap.set('ExpressionStatement', {
    vistors: ['expression']
})

astDefinationsMap.set('CallExpression', {
    vistors: ['callee', 'arguments']
})

var validations = {}
Array.from(astDefinationsMap.keys()).forEach(name => {
   validations['is' + name] = function(node) {
    return node.type === name
   }
})

module.exports = {
    vistorKeys: astDefinationsMap,
    ...validations
}