import express from 'express';
import { body, validationResult } from 'express-validator';
import Transport from '../models/Transport.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/transport
// @desc    Get all transport listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { origin, destination, date, status, produceType } = req.query;
    const query = {};

    if (status) query.status = status;
    if (produceType) query.produceType = { $regex: produceType, $options: 'i' };
    if (origin) query['origin.city'] = { $regex: origin, $options: 'i' };
    if (destination) query['destination.city'] = { $regex: destination, $options: 'i' };
    if (date) {
      const searchDate = new Date(date);
      query.availableDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const transports = await Transport.find(query)
      .populate('userId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/transport/:id
// @desc    Get single transport listing
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate('userId', 'name email phone location')
      .populate('bookings.userId', 'name email phone');

    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/transport
// @desc    Create transport listing
// @access  Private
router.post('/', protect, [
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('origin').notEmpty().withMessage('Origin is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('availableDate').isISO8601().withMessage('Valid date is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('produceType').notEmpty().withMessage('Produce type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transport = await Transport.create({
      ...req.body,
      userId: req.user._id,
      transporterName: req.user.name
    });

    const populatedTransport = await Transport.findById(transport._id)
      .populate('userId', 'name email phone location');

    res.status(201).json(populatedTransport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/transport/:id
// @desc    Update transport listing
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    if (transport.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone location');

    res.json(updatedTransport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/transport/:id
// @desc    Delete transport listing
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    if (transport.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await transport.deleteOne();
    res.json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/transport/:id/book
// @desc    Book transport
// @access  Private
router.post('/:id/book', protect, [
  body('quantity').isNumeric().withMessage('Quantity must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    if (transport.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot book your own transport' });
    }

    if (transport.status !== 'available') {
      return res.status(400).json({ message: 'Transport is not available' });
    }

    transport.bookings.push({
      userId: req.user._id,
      quantity: req.body.quantity,
      status: 'pending'
    });

    await transport.save();

    const updatedTransport = await Transport.findById(transport._id)
      .populate('userId', 'name email phone location')
      .populate('bookings.userId', 'name email phone');

    res.json(updatedTransport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

