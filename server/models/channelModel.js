import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    members: [{
         type: mongoose.Schema.ObjectId, 
         ref: "User",
         require: true
    }],
    
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    },
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: "Message",
        require: false
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }

})

channelSchema.pre('save', function (next) {
     this.updatedAt = Date.now();
     next();
})

channelSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    next();
})

const Channel = mongoose.model('Channel', channelSchema)

export default Channel;