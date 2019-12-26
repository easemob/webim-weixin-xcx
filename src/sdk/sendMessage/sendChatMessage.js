var sendChatMessage = function(messageOption, conn){
    debugger
	var self = conn;

	var emptyMessage = [];
    var contentMessage = self.context.root.lookup("easemob.pb.MessageBody.Content");
    var fifthMessage = contentMessage.decode(emptyMessage);
    if (messageOption.type === "txt") {
        fifthMessage.type = 0;
    } else {
        

    }
    fifthMessage.text = messageOption.msg;
    var messageBody = self.context.root.lookup("easemob.pb.MessageBody");
    var fourthMessage = messageBody.decode(emptyMessage);
    if (messageOption.group === "groupchat" && !messageOption.roomType) {
        fourthMessage.type = 2;
        fourthMessage.from = {
            appKey: self.appKey,
            name: self.user,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        };
        fourthMessage.to = {
            appKey: self.appKey,
            name: messageOption.to,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        }

    }
    else if (messageOption.group === "groupchat" && messageOption.roomType === true) {
        fourthMessage.type = 3;
        fourthMessage.from = {
            appKey: self.appKey,
            name: self.user,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        };
        fourthMessage.to = {
            appKey: self.appKey,
            name: messageOption.to,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        }
    }
    else{
        fourthMessage.type = 1;
        fourthMessage.from = self.context.jid;
        fourthMessage.to = {
            appKey: self.appKey,
            name: messageOption.to,
            domain: "easemob.com",
            clientResource: self.clientResource
        }
    }
    fourthMessage.contents = [fifthMessage];

    fourthMessage = messageBody.encode(fourthMessage).finish();
    var MetaMessage = self.context.root.lookup("easemob.pb.Meta");
    var thirdMessage = MetaMessage.decode(emptyMessage);
    thirdMessage.id = messageOption.id;
    if (messageOption.group === "groupchat" && messageOption.roomType === false) {
        thirdMessage.from = {
            appKey: self.appKey,
            name: self.user,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        };
        thirdMessage.to = {
            appKey: self.appKey,
            name: messageOption.to,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        }
    }
    else if (messageOption.group === "groupchat" && messageOption.roomType === true) {
        thirdMessage.from = {
            appKey: self.appKey,
            name: self.user,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        };
        thirdMessage.to = {
            appKey: self.appKey,
            name: messageOption.to,
            domain: "conference.easemob.com",
            clientResource: self.clientResource
        }
    }
    else{
        thirdMessage.from = self.context.jid;
        thirdMessage.to = {
            appKey: self.appKey,
            name: messageOption.to,
            domain: "easemob.com",
            clientResource: self.clientResource
        }
    }
    thirdMessage.ns = 1;
    thirdMessage.payload = fourthMessage;
    var commSyncULMessage = self.context.root.lookup("easemob.pb.CommSyncUL");
    var secondMessage = commSyncULMessage.decode(emptyMessage);
    secondMessage.meta = thirdMessage;
    secondMessage = commSyncULMessage.encode(secondMessage).finish();
    var msyncMessage = self.context.root.lookup("easemob.pb.MSync");
    var firstMessage = msyncMessage.decode(emptyMessage);
    firstMessage.version = self.version;
    firstMessage.encryptType = [0];
    firstMessage.command = 0;
    firstMessage.guid = self.jid;
    firstMessage.payload = secondMessage;
    firstMessage = msyncMessage.encode(firstMessage).finish();
    return firstMessage;
}

export default sendChatMessage
