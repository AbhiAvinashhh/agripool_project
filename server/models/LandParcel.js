import mongoose from 'mongoose';

const landParcelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parcelName: {
    type: String,
    required: true
  },
  area: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['acre', 'hectare', 'sqft'],
      default: 'acre'
    }
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky'],
    required: true
  },
  currentCrop: {
    type: String,
    required: true
  },
  cropSeason: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'year-round']
  },
  phLevel: {
    type: Number,
    min: 0,
    max: 14
  },
  organicMatter: {
    type: Number,
    min: 0,
    max: 100
  },
  lastFertilized: Date,
  fertilizerPlan: [{
    fertilizerName: String,
    quantity: Number,
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton']
    },
    applicationDate: Date,
    cost: Number,
    status: {
      type: String,
      enum: ['planned', 'applied', 'cancelled'],
      default: 'planned'
    }
  }],
  recommendations: [{
    fertilizerName: String,
    quantity: Number,
    unit: String,
    reason: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    estimatedCost: Number,
    expectedYieldIncrease: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

landParcelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const LandParcel = mongoose.model('LandParcel', landParcelSchema);

export default LandParcel;

