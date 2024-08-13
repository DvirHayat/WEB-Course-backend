import mongoose from 'mongoose';

const HobbySchema = new mongoose.Schema({
  activity: {
    type: String,
    required: [true, 'Please provide a name for the hobby.'],
  }
});

export default mongoose.models.Hobby || mongoose.model('Hobby', HobbySchema);