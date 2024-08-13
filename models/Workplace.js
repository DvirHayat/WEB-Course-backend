import mongoose from 'mongoose';

const WorkplaceSchema = new mongoose.Schema({
  Workplace: {
    type: String,
    required: [true, 'Please provide a name for the workplace.'],
  }
});

export default mongoose.models.Workplace || mongoose.model('Workplace', WorkplaceSchema);
