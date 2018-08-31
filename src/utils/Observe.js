var obsCbs = obsCbs || [];
var obsObjs = obsObjs || [];
var cloneObjs = cloneObjs || [];

function newOne(obj){
	obsObjs.push(obj);
	obsCbs.push([]);
	cloneObjs.push(Object.assign({}, obj));
}

module.exports = {
	del(obj, cb){
		let curObjIdx = obsObjs.indexOf(obj);
		if(~curObjIdx){
			let cbs = obsCbs[curObjIdx];
			let curCbIdx = cbs.indexOf(cb);
			if(~curCbIdx){
				cbs.splice(curCbIdx, 1);
				if(!cbs.length){
					obsObjs.splice(curObjIdx, 1);
				}
			}
		}
	},
	add(obj, cb){
		let curIdx = obsObjs.indexOf(obj);
		if(!~curIdx){
			curIdx = obsObjs.length;
			newOne(obj);
		}
		let cbs = obsCbs[curIdx];
		cbs.push(cb);
		for(let key in obj){
			Object.defineProperty(obj, key, {
				set: function(val){
					cloneObjs[curIdx][key] = val;
					for(let i = 0; i < cbs.length; i++){
						cbs[i].apply(obj, [val, key]);
					}
				},
				get: function(){
					return cloneObjs[curIdx][key];
				}
			});
		}
		return obj;
	},
};
