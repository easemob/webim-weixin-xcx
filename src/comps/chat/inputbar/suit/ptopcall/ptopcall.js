
Component({
	properties: {

  	},
	data: {
		visible: false,
		callType: null
	},
	methods: {
		show(calltype){
			this.setData({
				callType: calltype,
				visible: true
			})
		},
		cancel(){
			this.setData({
				visible: false
			})
		},

		callAudio(){
			this.triggerEvent('makeAudioCall', this.data.callType)
			this.cancel()
		},

		callVideo(){
			this.triggerEvent('makeVideoCall', this.data.callType)
			this.cancel()
		}
	}
})