import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transporterName: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['truck', 'tractor', 'van', 'pickup', 'other']
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton'],
    default: 'kg'
  },
  origin: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  availableDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    enum: ['per_kg', 'per_quintal', 'per_ton', 'fixed'],
    default: 'per_kg'
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'completed', 'cancelled'],
    default: 'available'
  },
  produceType: {
    type: String,
    required: true
  },
  description: String,
  bookings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    quantity: Number,
    bookingDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transport = mongoose.model('Transport', transportSchema);

export default Transport;

