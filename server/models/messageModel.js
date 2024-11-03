import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   sender: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Users",
     require: true
   },
   recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: false
   },
   messageType: {
      type: String,
      enum: ["text", "file"],
      require: true
   },
    content: {
       type: String,
       require: function(){
            return this.messageType === "text"
       }
   },
   fileURL: {
       type: String,
       require: function(){
        return this.messageType === "file"
      }
   },
   timeStamp: {
        type: Date,
        default: Date.now()
   }
})

const Message = mongoose.model('message', messageSchema);

export default Message;