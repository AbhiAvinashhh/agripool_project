import express from 'express';
import { body, validationResult } from 'express-validator';
import LandParcel from '../models/LandParcel.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/fertilizer/parcels
// @desc    Get all land parcels for user
// @access  Private
router.get('/parcels', protect, async (req, res) => {
  try {
    const parcels = await LandParcel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fertilizer/parcels/:id
// @desc    Get single land parcel
// @access  Private
router.get('/parcels/:id', protect, async (req, res) => {
  try {
    const parcel = await LandParcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({ message: 'Land parcel not found' });
    }

    if (parcel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/fertilizer/parcels
// @desc    Create land parcel
// @access  Private
router.post('/parcels', protect, [
  body('parcelName').notEmpty().withMessage('Parcel name is required'),
  body('area.value').isNumeric().withMessage('Area value must be a number'),
  body('soilType').notEmpty().withMessage('Soil type is required'),
  body('currentCrop').notEmpty().withMessage('Current crop is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const parcel = await LandParcel.create({
      ...req.body,
      userId: req.user._id
    });

    // Generate recommendations
    const recommendations = generateRecommendations(parcel);
    parcel.recommendations = recommendations;
    await parcel.save();

    res.status(201).json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/fertilizer/parcels/:id
// @desc    Update land parcel
// @access  Private
router.put('/parcels/:id', protect, async (req, res) => {
  try {
    const parcel = await LandParcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({ message: 'Land parcel not found' });
    }

    if (parcel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedParcel = await LandParcel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Regenerate recommendations if relevant fields changed
    if (req.body.soilType || req.body.currentCrop || req.body.phLevel) {
      updatedParcel.recommendations = generateRecommendations(updatedParcel);
      await updatedParcel.save();
    }

    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/fertilizer/parcels/:id
// @desc    Delete land parcel
// @access  Private
router.delete('/parcels/:id', protect, async (req, res) => {
  try {
    const parcel = await LandParcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({ message: 'Land parcel not found' });
    }

    if (parcel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await parcel.deleteOne();
    res.json({ message: 'Land parcel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/fertilizer/parcels/:id/recommendations
// @desc    Generate fertilizer recommendations
// @access  Private
router.post('/parcels/:id/recommendations', protect, async (req, res) => {
  try {
    const parcel = await LandParcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({ message: 'Land parcel not found' });
    }

    if (parcel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const recommendations = generateRecommendations(parcel);
    parcel.recommendations = recommendations;
    await parcel.save();

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate fertilizer recommendations
function generateRecommendations(parcel) {
  const recommendations = [];
  const areaInAcres = parcel.area.unit === 'acre' 
    ? parcel.area.value 
    : parcel.area.unit === 'hectare' 
      ? parcel.area.value * 2.471 
      : parcel.area.value / 43560;

  // Basic fertilizer recommendations based on soil type and crop
  const fertilizerData = {
    'clay': { npk: '10:26:26', quantity: 50, name: 'NPK Complex' },
    'sandy': { npk: '12:32:16', quantity: 60, name: 'NPK Complex' },
    'loamy': { npk: '19:19:19', quantity: 45, name: 'NPK Complex' },
    'silt': { npk: '17:17:17', quantity: 50, name: 'NPK Complex' },
    'peaty': { npk: '20:20:20', quantity: 40, name: 'NPK Complex' },
    'chalky': { npk: '15:15:15', quantity: 55, name: 'NPK Complex' }
  };

  const baseFertilizer = fertilizerData[parcel.soilType] || fertilizerData['loamy'];
  
  // Calculate quantity based on area
  const quantity = Math.round(baseFertilizer.quantity * areaInAcres);
  const estimatedCost = quantity * 25; // Assuming ₹25 per kg
  const expectedYieldIncrease = Math.round(areaInAcres * 2); // 2 quintals per acre

  recommendations.push({
    fertilizerName: baseFertilizer.name,
    quantity: quantity,
    unit: 'kg',
    reason: `Recommended for ${parcel.soilType} soil with ${parcel.currentCrop} crop`,
    priority: 'high',
    estimatedCost: estimatedCost,
    expectedYieldIncrease: expectedYieldIncrease
  });

  // Add organic manure recommendation
  recommendations.push({
    fertilizerName: 'Organic Manure',
    quantity: Math.round(areaInAcres * 500),
    unit: 'kg',
    reason: 'Improves soil structure and nutrient retention',
    priority: 'medium',
    estimatedCost: Math.round(areaInAcres * 500 * 2),
    expectedYieldIncrease: Math.round(areaInAcres * 1)
  });

  // Add micronutrients if pH is low
  if (parcel.phLevel && parcel.phLevel < 6.5) {
    recommendations.push({
      fertilizerName: 'Lime (Calcium Carbonate)',
      quantity: Math.round(areaInAcres * 100),
      unit: 'kg',
      reason: 'Soil pH is low, lime helps neutralize acidity',
      priority: 'high',
      estimatedCost: Math.round(areaInAcres * 100 * 5),
      expectedYieldIncrease: Math.round(areaInAcres * 1.5)
    });
  }

  return recommendations;
}

export default router;

