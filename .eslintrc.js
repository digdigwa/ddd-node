module.exports = {
    root: true,
    "extends": "standard",                          // 地址：https://github.com/standard/standard
    "rules": {
        'indent': ['error', 4, { SwitchCase: 1 }],  // 缩进4空格
        "no-multi-spaces": ["error", {
            "ignoreEOLComments": true,              // 忽略行尾注释前的多个空格
            "exceptions": {
                "VariableDeclarator": true,         // 等号对齐。允许定义的变量后有多个空格
                "ImportDeclaration": true           // from对齐。允许import后的变量后from前多个空格
            }
        }]
    }
};
