import mongoose from 'mongoose';

const whatsappCloneSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

export default mongoose.model('messageContent', whatsappCloneSchema);