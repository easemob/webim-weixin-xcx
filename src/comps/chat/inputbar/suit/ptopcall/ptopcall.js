
Component({
	properties: {

  	},
	data: {
		visible: false,
	},
	methods: {
		show(){
			this.setData({
				visible: true
			})
		},
		cancel(){
			this.setData({
				visible: false
			})
		},

		callAudio(){
			this.triggerEvent('makeAudioCall', 'single')
			this.cancel()
		},

		callVideo(){
			this.triggerEvent('makeVideoCall', 'single')
			this.cancel()
		}
	}
})