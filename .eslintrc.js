
// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 6,								// es6
		sourceType: "module",						// script | module
		ecmaFeatures: {
			jsx: true,
			globalReturn: false,					// top 作用域 return
			impliedStrict: false,					// 执行 strict 标准
			experimentalObjectRestSpread: true,		// 实验中的语法特性，react 需要
			allowImportExportEverywhere: false,		// babel-eslint 提供
			codeFrame: false						// babel-eslint 提供
		}
	},
	parser: "babel-eslint",		// babel-eslint | esprima | espree (default)
	env: {
		browser: true,
		es6: true,
		amd: true,
		jest: true,
		jquery: true,
		commonjs: true,
		// shared-node-browser: false,		// 不能开启？

		worker: false,
		node: false,
		serviceworker: false,
		mocha: false,
		jasmine: false,
		phantomjs: false,
		protractor: false,
		qunit: false,
		prototypejs: false,
		shelljs: false,
		meteor: false,
		mongo: false,
		applescript: false,
		nashorn: false,
		atomtest: false,
		embertest: false,
		webextensions: false,
		greasemonkey: false,
	},
	// 假定的全局变量，避免模块内 no-undef 时报假错
	// 值为 false 时，能检测全局被覆盖
	globals: {
		wx: true,
		App: true,
		Page: true,
		Component: true,
		getApp: true,
		getCurrentPages: true,
	},

	rules: {

		/*
			---------------
			POSSIBLE ERRORS
			---------------
		 */
		"no-extra-semi":				1,					// 禁止多余的分号

		"for-direction":				2,					// for 循环死了
		"no-cond-assign":				2,					// 防止 if 写成赋值
		"no-debugger":					2,					// 禁止 debugger
		"no-dupe-args":					2,					// 禁止参数重名
		"no-dupe-keys":					2,					// 禁止 key 重名
		"no-duplicate-case":			2,					// 禁止 case 重复
		"no-func-assign":				2,					// 禁止覆盖函数字面量
		"no-inner-declarations":	[2, "both"],			// 禁止在 if 中 var
		"no-irregular-whitespace":		2,					// 禁止非常规空白
		"no-prototype-builtins":		2,					// 禁止直接调用 obj 上的 proto 方法
		"no-sparse-arrays":				2,					// 防止数组中多余的逗号
		"no-template-curly-in-string":	2,					// 禁止字符串中出现 ${}
		"no-unreachable":				2,					// 禁止出现无法执行到的语句
		"no-unsafe-finally":			2,					// 禁止 finally 出现控制语句
		"no-unsafe-negation":			2,					// 禁止有歧义、不安全的 ! 号
		"use-isnan":					2,					// 强制 isNaN()
		"valid-typeof":					2,					// 防止 typeof 类型的字符写错
		"valid-jsdoc":					2,					// 如果有的话，校验 jsdoc


		/*
			--------------
			BEST PRACTICES
			--------------
		 */
		// "curly":						2,					// 控制语句块强制大括号（冲突 nonblock-statement-body-position）
		// "no-case-declarations":		2,					// 强制 case 加大括号，明确 let 等的作用域（非 es6 无意义）
		"accessor-pairs":				2,					// 如果 setter，则不能没有 getter
		"block-scoped-var":				2,					// 禁止块级作用域中 var 和使用该 var
		"default-case":					2,					// switch 强制 default
		"no-alert":						2,					// 禁止 alert prompt confirm 等
		"no-caller":					2,					// 禁止 arguments.caller
		"no-eval":						2,					// 禁止 eval
		"no-extra-bind":				2,					// 禁止无意义的 bind() 调用
		"no-fallthrough":				2,					// 禁止 case fallthrough
		"no-floating-decimal":			2,					// 禁止省略形式的浮点定义
		"no-global-assign":				2,					// 禁止覆盖全局对象
		"no-implied-eval":				2,					// 禁止隐式的 eval，比如 setTimeout
		"no-iterator":					2,					// 禁止替换原生的 __iterator__
		"no-proto":						2,					// 禁止使用 __proto__
		"no-labels":					2,					// 禁止使用 label 语句
		"no-lone-blocks":				2,					// 禁止无意义的 block 标记
		"no-new-func":					2,					// 禁止使用 Function
		"no-new-wrappers":				2,					// 禁止使用带 new 的基本类型封装
		"no-redeclare":					2,					// 禁止重复声明
		"no-return-assign":				2,					// 禁止不打括号的 return 赋值
		"no-sequences":					2,					// 禁止使用逗号运算符
		"no-throw-literal":				2,					// 禁止 throw 文本
		"no-useless-concat":			2,					// 禁止无意义的拼接
		"no-useless-escape":			2,					// 禁止无意义的转义
		"no-void":						2,					// 禁止使用 void
		"no-with":						2,					// 禁止使用 with
		"yoda":						[2, "never"],			// 禁止反向的判断比较

		"no-return-await":				2,					// 禁止没有意义的 return 时使用 await
		"require-await":				2,					// 禁止 async 的 func 中没有 await

		"dot-notation":		[1, { "allowKeywords":false }],	// 警告：不必要的计算属性访问 or 直接访问关键字为 key 的属性
		"no-eq-null":					1,					// null 必须 ===
		"vars-on-top":					1,					// 建议变量都定义在 scope 顶部
		"radix":						1,					// 建议 parseInt 带上进制参数
		"no-invalid-this":				1,					// 限制 this 的使用
		"consistent-return":			1,					// 建议统一 return
		"no-else-return":				1,					// 建议统一 return
		"no-useless-return":			1,					// 建议删除、合并没有意义的 return
		"guard-for-in":					1,					// for in 的警告（观察观察）

		// 如果 method 没有使用 this，应该使用 static
		"class-methods-use-this": [1, { "exceptMethods":["render"] }],
		// 强制 promise reject error 对象
		"prefer-promise-reject-errors": [2, { "allowEmptyReject":true }],
		// 强制 IIFE 必须打括号
		"wrap-iife": [2, "any", { "functionPrototypeMethods":true }],
		// 禁止魔法数字
		"no-magic-numbers": [1, { "detectObjects":true, "ignoreArrayIndexes":true, "ignore":[0,1,-1] }],



		/*
			---------
			VARIABLES
			---------
		 */
		"strict":						2,					// 禁止 strict 指令
		"no-delete-var":				2,					// 禁止 delete 变量（好像语法上就不允许了）
		"no-shadow-restricted-names":	2,					// 禁止定义与全局重名的变量
		"no-undef":						2,					// 禁止使用未定义变量
		"no-undef-init":				2,					// 禁止显式定义为 undefined
		"no-unused-vars":				1,					// 警告未使用的变量
		"no-use-before-define":		[1, "nofunc"],			// 警告提前使用了变量
		"no-restricted-globals":	[2, "name", "stop"],	// 禁止使用的全局变量


		/*
			----------------
			STYLISTIC ISSUES
			----------------
		 */
		"comma-spacing":				1,					// 警告：逗号无空格间隔
		"computed-property-spacing":	1,					// 警告：计算属性左右加空格
		"consistent-this":			[1, "me"],				// 警告：不规范的 this 别名
		"eol-last":						1,					// 警告：文件末无空行
		"func-call-spacing":			1,					// 警告：不规范的调用前空格
		"new-parens":					1,					// 警告：new 调用必须打括号
		"no-lonely-if":					1,					// 警告：else 中的只有 if 不合理
		"no-mixed-operators":			1,					// 警告：表达式中运算符过于复杂
		"no-mixed-spaces-and-tabs":		1,					// 警告：混合了 tab 和 space
		"no-unneeded-ternary":			1,					// 警告：精简条件表达式
		"object-curly-spacing":		[1, "always"],			// 警告：obj 大括号需要空格
		"semi":							1,					// 警告：缺少分号
		"semi-spacing":					1,					// 警告：分号后需要空格
		"switch-colon-spacing":			1,					// 警告：case 冒号需要空格
		"spaced-comment":				1,					// 警告：注释需要空格
		"space-unary-ops":				1,					// 警告：一元符空格问题
		"space-infix-ops":				1,					// 警告：运算符必须空格
		"key-spacing":		[1, { "mode": "minimum" }],		// 警告：obj 的 key 冒号需要空格

		"jsx-quotes":					1,					// 警告：jsx 最好用双引

		"no-whitespace-before-property":	2,				// 禁止 dot 属性访问带空格
		"nonblock-statement-body-position":	2,				// 强制单句控制写成一行

		// 警告：链式调用必须断行，3 级以上
		"newline-per-chained-call": [1, { "ignoreChainWithDepth": 3 }],
		// 函数小括号的空格定义
		"space-before-function-paren": [1, {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],
		// 引号规则
		"quotes": [1, "double", { "allowTemplateLiterals":true }],
		// 强制属性引号
		"quote-props": [2, "as-needed", { "keywords":true }],
		// 警告：行末空格
		"no-trailing-spaces": [1, { "skipBlankLines":true }],
		// 警告：缩进 tab
		"indent": [1, "tab", { "MemberExpression":0 }],
		// 关键字左右空格
		"keyword-spacing": [1, {
			"overrides": {
				"if": { before:false, after:false },
				"else": { before:false, after:false },
				"do": { before:false, after:false },
				"while": { before:false, after:false },
				"for": { before:false, after:false },

				"try": { before:false, after:false },
				"catch": { before:false, after:false },
				"finally": { before:false, after:false },

				"switch": { before:false, after:false },
				"default": { before:false, after:false },
			}
		}],
		// 警告：大写调用就是 new
		"new-cap": [1, {
			"newIsCapExceptions":[],
			"capIsNewExceptions":["Deferred"]
		}],
		// 大括号外面的空格
		"space-before-blocks": [1, {
			"functions": "never",
			"keywords": "never",
			"classes": "always"
		}],
		// 大括号样式
		"brace-style": [1, "stroustrup", { "allowSingleLine": true }],
		// 小括号中的空格
		"space-in-parens": [1, "never"],

	}
};
