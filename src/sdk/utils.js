(function(){

	var EMPTYFN = function(){};
	var _code = require("./status").code;
	var WEBIM_FILESIZE_LIMIT = 10485760;
	var _tmpUtilXHR = false;
	var _hasFormData = typeof FormData !== "undefined";
	var _hasBlob = typeof Blob !== "undefined";
	var _isCanSetRequestHeader = _tmpUtilXHR.setRequestHeader || false;
	var _hasOverrideMimeType = _tmpUtilXHR.overrideMimeType || false;
	var _isCanUploadFileAsync = _isCanSetRequestHeader && _hasFormData;
	var _isCanUploadFile = _isCanUploadFileAsync || false;
	var _isCanDownLoadFile = _isCanSetRequestHeader && (_hasBlob || _hasOverrideMimeType);

	if(!Object.keys){
		Object.keys = (function(){
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable("toString");
			var dontEnums = [
				"toString",
				"toLocaleString",
				"valueOf",
				"hasOwnProperty",
				"isPrototypeOf",
				"propertyIsEnumerable",
				"constructor"
			];
			var dontEnumsLength = dontEnums.length;

			return function(obj){
				if(typeof obj !== "object" && (typeof obj !== "function" || obj === null)){
					throw new TypeError("Object.keys called on non-object");
				}
				let result = [];
				let prop;
				let i;
				for(prop in obj){
					if(hasOwnProperty.call(obj, prop)){
						result.push(prop);
					}
				}
				if(hasDontEnumBug){
					for(i = 0; i < dontEnumsLength; i++){
						if(hasOwnProperty.call(obj, dontEnums[i])){
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	let utils = {
		hasFormData: _hasFormData,
		hasBlob: _hasBlob,
		emptyfn: EMPTYFN,
		isCanSetRequestHeader: _isCanSetRequestHeader,
		hasOverrideMimeType: _hasOverrideMimeType,
		isCanUploadFileAsync: _isCanUploadFileAsync,
		isCanUploadFile: _isCanUploadFile,
		isCanDownLoadFile: _isCanDownLoadFile,
		isSupportWss: true,
		hasFlash: false,
		xmlrequest: false,

		stringify: function(json){
			if(typeof JSON !== "undefined" && JSON.stringify){
				return JSON.stringify(json);
			}
			let s = "";
			let arr = [];
			return iterate(json);

			function iterate(json){
				var isArr = false;
				if(Object.prototype.toString.call(json) === "[object Array]"){
					arr.push("]", "[");
					isArr = true;
				}
				else if(Object.prototype.toString.call(json) === "[object Object]"){
					arr.push("}", "{");
				}
				for(let o in json){
					if(Object.prototype.toString.call(json[o]) === "[object Null]"){
						json[o] = "null";
					}
					else if(Object.prototype.toString.call(json[o]) === "[object Undefined]"){
						json[o] = "undefined";
					}
					if(json[o] && typeof json[o] === "object"){
						s += "," + (isArr ? "" : "\"" + o + "\":" + (isArr ? "\"" : "")) + iterate(json[o]) + "";
					}
					else{
						s += ",\"" + (isArr ? "" : o + "\":\"") + json[o] + "\"";
					}
				}
				if(s != ""){
					s = s.slice(1);
				}
				return arr.pop() + s + arr.pop();
			}
		},

		registerUser: function(options){
			var orgName = options.orgName || "";
			var appName = options.appName || "";
			var appKey = options.appKey || "";
			var suc = options.success || EMPTYFN;
			var err = options.error || EMPTYFN;

			if(!orgName && !appName && appKey){
				let devInfos = appKey.split("#");
				if(devInfos.length === 2){
					orgName = devInfos[0];
					appName = devInfos[1];
				}
			}
			if(!orgName && !appName){
				err({
					type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
				});
				return false;
			}
			let apiUrl = options.apiUrl;
			let restUrl = apiUrl + "/" + orgName + "/" + appName + "/users";
			let userjson = {
				username: options.username,
				password: options.password,
				nickname: options.nickname || ""
			};
			let userinfo = utils.stringify(userjson);
			options = {
				url: restUrl,
				data: userinfo,
				success: suc,
				error: err
			};
			return utils.ajax(options);
		},

		login: function(options){
			options = options || {};
			let suc = options.success || EMPTYFN;
			let err = options.error || EMPTYFN;
			let appKey = options.appKey || "";
			let devInfos = appKey.split("#");
			if(devInfos.length !== 2){
				err({
					type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
				});
				return false;
			}
			let orgName = devInfos[0];
			let appName = devInfos[1];
			let user = options.user || "";
			let pwd = options.pwd || "";
			let apiUrl = options.apiUrl;
			let loginJson = {
				grant_type: "password",
				username: user,
				password: pwd,
				timestamp: +new Date()
			};
			let loginfo = utils.stringify(loginJson);
			options = {
				url: apiUrl + "/" + orgName + "/" + appName + "/token",
				data: loginfo,
				success: suc,
				error: err
			};
			return utils.ajax(options);
		},

		getFileUrl: function(fileInputId){
			var uri = {
				url: "",
				filename: "",
				filetype: "",
				data: ""
			};
			var fileObj = typeof fileInputId === "string"
				? document.getElementById(fileInputId)
				: fileInputId;
			if(!utils.isCanUploadFileAsync || !fileObj){
				return uri;
			}
			try{
				if(window.URL.createObjectURL){
					let fileItems = fileObj.files;		// 一个对象,文件列表
					if(fileItems.length > 0){
						let u = fileItems.item(0);		// 有关选取文件的信息
						uri.data = u;
						uri.url = window.URL.createObjectURL(u);	// 指向该文件的URL
						uri.filename = u.name || "";
					}
				}
				let index = uri.filename.lastIndexOf(".");
				if(index != -1){
					uri.filetype = uri.filename.substring(index + 1).toLowerCase();
				}
				return uri;
			}
			catch(e){
				throw e;
			}
		},

		getFileSize: function(fileInputId){
			let file = document.getElementById(fileInputId);
			let fileSize = 0;
			if(file){
				if(file.files){
					if(file.files.length > 0){
						fileSize = file.files[0].size;
					}
				}
			}
			return fileSize;
		},

		trim: function(str){
			str = typeof str === "string" ? str : "";
			return str.trim
				? str.trim()
				: str.replace(/^\s|\s$/g, "");
		},

		parseEmoji: function(msg){
			if(typeof WebIM.Emoji === "undefined" || typeof WebIM.Emoji.map === "undefined"){
				return msg;
			}
			let emoji = WebIM.Emoji;
			for(let face in emoji.map){
				if(emoji.map.hasOwnProperty(face)){
					while(msg.indexOf(face) > -1){
						msg = msg.replace(face, "<image class=\"emoji\" src=\"" + emoji.path + emoji.map[face] + "\" /></image>");
					}
				}
			}
			return msg;
		},

		parseLink: function(msg){
			var reg = /(https?:\/\/|www\.)([a-zA-Z0-9-]+(\.[a-zA-Z0-9]+)+)(:[0-9]{2,4})?\/?((\.[:_0-9a-zA-Z-]+)|[:_0-9a-zA-Z-]*\/?)*\??[:_#@*&%0-9a-zA-Z-/=]*/gm;
			msg = msg.replace(reg, function(v){
				var prefix = /^https?/gm.test(v);
				return "<a href='" + (prefix ? v : "//" + v) + "' target='_blank'>" + v + "</a>";
			});
			return msg;
		},

		parseJSON: function(data){
			if(window.JSON && window.JSON.parse){
				return window.JSON.parse(data + "");
			}
			let requireNonComma;
			let depth = null;
			let str = utils.trim(data + "");
			return str && !utils.trim(
				str.replace(
					/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,
					function(token, comma, open, close){
						if(requireNonComma && comma){
							depth = 0;
						}
						if(depth === 0){
							return token;
						}
						requireNonComma = open || comma;
						depth += !close - !open;
						return "";
					})
			)
				? (Function("return " + str))()
				: (Function("Invalid JSON: " + data))();
		},

		parseUploadResponse: function(response){
			return response.indexOf("callback") > -1
				// lte ie9
				? response.slice(9, -1)
				: response;
		},

		parseDownloadResponse: function(response){
			return (
				(response && response.type && response.type === "application/json") ||
				Object.prototype.toString.call(response).indexOf("Blob") < 0
			)
				? this.url + "?token="
				: window.URL.createObjectURL(response);
		},

		uploadFile: function(options){
			options = options || {};
			options.onFileUploadProgress = options.onFileUploadProgress || EMPTYFN;
			options.onFileUploadComplete = options.onFileUploadComplete || EMPTYFN;
			options.onFileUploadError = options.onFileUploadError || EMPTYFN;
			options.onFileUploadCanceled = options.onFileUploadCanceled || EMPTYFN;
			let acc = options.accessToken || this.context.accessToken;
			if(!acc){
				options.onFileUploadError({
					type: _code.WEBIM_UPLOADFILE_NO_LOGIN,
					id: options.id
				});
				return;
			}
			let orgName, appName, devInfos;
			let appKey = options.appKey || this.context.appKey || "";
			if(appKey){
				devInfos = appKey.split("#");
				orgName = devInfos[0];
				appName = devInfos[1];
			}
			if(!orgName && !appName){
				options.onFileUploadError({
					type: _code.WEBIM_UPLOADFILE_ERROR
					, id: options.id
				});
				return;
			}
			let apiUrl = options.apiUrl;
			let uploadUrl = apiUrl + "/" + orgName + "/" + appName + "/chatfiles";
			if(!utils.isCanUploadFileAsync){
				if(utils.hasFlash && typeof options.flashUpload === "function"){
					options.flashUpload && options.flashUpload(uploadUrl, options);
				}
				else{
					options.onFileUploadError({
						type: _code.WEBIM_UPLOADFILE_BROWSER_ERROR
						, id: options.id
					});
				}
				return;
			}
			let fileSize = options.file.data ? options.file.data.size : undefined;
			if(fileSize > WEBIM_FILESIZE_LIMIT){
				options.onFileUploadError({
					type: _code.WEBIM_UPLOADFILE_ERROR,
					id: options.id
				});
				return;
			}
			else if(fileSize <= 0){
				options.onFileUploadError({
					type: _code.WEBIM_UPLOADFILE_ERROR,
					id: options.id
				});
				return;
			}
			let xhr = utils.xmlrequest();
			let onError = function(e){
				options.onFileUploadError({
					type: _code.WEBIM_UPLOADFILE_ERROR,
					id: options.id,
					xhr: xhr
				});
			};
			if(xhr.upload){
				xhr.upload.addEventListener("progress", options.onFileUploadProgress, false);
			}
			if(xhr.addEventListener){
				xhr.addEventListener("abort", options.onFileUploadCanceled, false);
				xhr.addEventListener("load", function(e){
					try{
						let json = utils.parseJSON(xhr.responseText);
						try{
							options.onFileUploadComplete(json);
						}
						catch(e){
							options.onFileUploadError({
								type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
								, data: e
							});
						}
					}
					catch(e){
						options.onFileUploadError({
							type: _code.WEBIM_UPLOADFILE_ERROR,
							data: xhr.responseText,
							id: options.id,
							xhr: xhr
						});
					}
				}, false);
				xhr.addEventListener("error", onError, false);
			}
			else if(xhr.onreadystatechange){
				xhr.onreadystatechange = function(){
					if(xhr.readyState === 4){
						if(ajax.status === 200){
							try{
								let json = utils.parseJSON(xhr.responseText);
								options.onFileUploadComplete(json);
							}
							catch(e){
								options.onFileUploadError({
									type: _code.WEBIM_UPLOADFILE_ERROR,
									data: xhr.responseText,
									id: options.id,
									xhr: xhr
								});
							}
						}
						else{
							options.onFileUploadError({
								type: _code.WEBIM_UPLOADFILE_ERROR,
								data: xhr.responseText,
								id: options.id,
								xhr: xhr
							});
						}
					}
					else{
						xhr.abort();
						options.onFileUploadCanceled();
					}
				};
			}
			xhr.open("POST", uploadUrl);
			xhr.setRequestHeader("restrict-access", "true");
			xhr.setRequestHeader("Accept", "*/*");		// Android QQ browser has some problem with this attribute.
			xhr.setRequestHeader("Authorization", "Bearer " + acc);
			let formData = new FormData();
			formData.append("file", options.file.data);
			xhr.send(formData);
		},

		download: function(options){
			options.onFileDownloadComplete = options.onFileDownloadComplete || EMPTYFN;
			options.onFileDownloadError = options.onFileDownloadError || EMPTYFN;
			let accessToken = options.accessToken || this.context.accessToken;
			let xhr = utils.xmlrequest();
			if(!accessToken){
				options.onFileDownloadError({
					type: _code.WEBIM_DOWNLOADFILE_NO_LOGIN,
					id: options.id
				});
				return;
			}
			let onError = function(e){
				options.onFileDownloadError({
					type: _code.WEBIM_DOWNLOADFILE_ERROR,
					id: options.id,
					xhr: xhr
				});
			};
			if(!utils.isCanDownLoadFile){
				options.onFileDownloadComplete();
				return;
			}
			if("addEventListener" in xhr){
				xhr.addEventListener("load", function(e){
					options.onFileDownloadComplete(xhr.response, xhr);
				}, false);
				xhr.addEventListener("error", onError, false);
			}
			else if("onreadystatechange" in xhr){
				xhr.onreadystatechange = function(){
					if(xhr.readyState === 4){
						if(ajax.status === 200){
							options.onFileDownloadComplete(xhr.response, xhr);
						}
						else{
							options.onFileDownloadError({
								type: _code.WEBIM_DOWNLOADFILE_ERROR,
								id: options.id,
								xhr: xhr
							});
						}
					}
					else{
						xhr.abort();
						options.onFileDownloadError({
							type: _code.WEBIM_DOWNLOADFILE_ERROR,
							id: options.id,
							xhr: xhr
						});
					}
				};
			}
			let method = options.method || "GET";
			let resType = options.responseType || "blob";
			let mimeType = options.mimeType || "text/plain; charset=x-user-defined";
			xhr.open(method, options.url);
			if(typeof Blob !== "undefined"){
				xhr.responseType = resType;
			}
			else{
				xhr.overrideMimeType(mimeType);
			}
			let innerHeaer = {
				"X-Requested-With": "XMLHttpRequest",
				Accept: "application/octet-stream",
				"share-secret": options.secret,
				Authorization: "Bearer " + accessToken
			};
			let headers = options.headers || {};
			for(let key in headers){
				innerHeaer[key] = headers[key];
			}
			for(let key in innerHeaer){
				if(innerHeaer[key]){
					xhr.setRequestHeader(key, innerHeaer[key]);
				}
			}
			xhr.send(null);
		},

		parseTextMessage: function(message, faces){
			if(typeof message !== "string"){
				return false;
			}
			if(Object.prototype.toString.call(faces) !== "[object Object]"){
				return {
					isemoji: false,
					body: [
						{
							type: "txt",
							data: message
						}
					]
				};
			}
			let receiveMsg = message;
			let emessage = [];
			let expr = /\[[^[\]]{2,3}\]/mg;
			let emoji = receiveMsg.match(expr);
			if(!emoji || emoji.length < 1){
				return {
					isemoji: false,
					body: [
						{
							type: "txt",
							data: message
						}
					]
				};
			}

			let isemoji = false;
			for(let i = 0; i < emoji.length; i++){
				let tmsg = receiveMsg.substring(0, receiveMsg.indexOf(emoji[i]));
				let existEmoji = faces.map[emoji[i]];
				if(tmsg){
					emessage.push({
						type: "txt",
						data: tmsg
					});
				}
				if(!existEmoji){
					emessage.push({
						type: "txt",
						data: emoji[i]
					});
					continue;
				}
				let emojiStr = faces.map ? existEmoji : null;
				if(emojiStr){
					isemoji = true;
					emessage.push({
						type: "emoji",
						data: emojiStr
					});
				}
				else{
					emessage.push({
						type: "txt",
						data: emoji[i]
					});
				}
				let restMsgIndex = receiveMsg.indexOf(emoji[i]) + emoji[i].length;
				receiveMsg = receiveMsg.substring(restMsgIndex);
			}
			if(receiveMsg){
				emessage.push({
					type: "txt",
					data: receiveMsg
				});
			}
			if(isemoji){
				return {
					isemoji: isemoji,
					body: emessage
				};
			}
			return {
				isemoji: false,
				body: [
					{
						type: "txt",
						data: message
					}
				]
			};
		},

		ajax: function(options){
			var suc = options.success || EMPTYFN;
			var error = options.error || EMPTYFN;
			var type = options.type || "POST",
				data = options.data || null,
				tempData = "";

			if(type.toLowerCase() === "get" && data){
				for(let o in data){
					if(data.hasOwnProperty(o)){
						tempData += o + "=" + data[o] + "&";
					}
				}
				tempData = tempData ? tempData.slice(0, -1) : tempData;
				options.url += (options.url.indexOf("?") > 0 ? "&" : "?") + (tempData ? tempData + "&" : tempData) + "_v=" + new Date().getTime();
				data = null;
				tempData = null;
			}
			console.log("wx.request", options.url);
			wx.request({
				url: options.url,
				data: options.data,
				header: options.headers,
				method: type,
				success: function(res){
					console.log("wx.request.success", arguments);
					if(res.statusCode == "200"){
						suc(res);
					}
					else{
						error(res);
					}
				},
				complete(){
					console.log("wx.request.complete", arguments);
				},
				fail(){
					console.log("wx.request.fail", arguments);
				}
			});
		},

		ts: function(){
			var d = new Date();
			var Hours = d.getHours();		// 获取当前小时数(0-23)
			var Minutes = d.getMinutes();	// 获取当前分钟数(0-59)
			var Seconds = d.getSeconds();	// 获取当前秒数(0-59)
			var Milliseconds = d.getMilliseconds();	// 获取当前毫秒
			return (Hours < 10 ? "0" + Hours : Hours) + ":" +
				(Minutes < 10 ? "0" + Minutes : Minutes) + ":" +
				(Seconds < 10 ? "0" + Seconds : Seconds) + ":" +
				Milliseconds + " ";
		},

		getObjectKey: function(obj, val){
			for(let key in obj){
				if(obj[key] == val){
					return key;
				}
			}
			return "";
		}

	};

	exports.utils = utils;

}());
