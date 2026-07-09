import mongoose from 'mongoose';

const ElementSchema = new mongoose.Schema({
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },
  height: { type: Number },
  color: { type: String },
  fillColor: { type: String },
  strokeWidth: { type: Number },
  text: { type: String },
  points: { type: Array },
  id: { type: String, required: true } // Unique ID for each element on the canvas
});

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Untitled Board' },
  elements: [ElementSchema],
  canvasWidth: { type: Number, default: 800 },
  canvasHeight: { type: Number, default: 600 },
  createdBy: { type: String, default: 'Anonymous' },
}, { timestamps: true });

export default mongoose.model('Board', BoardSchema);
