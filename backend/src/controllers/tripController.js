const tripService = require('../services/tripService');

const createTrip = async (req, res, next) => {
  try {
    const traveler_id = req.user.id;

    const trip = await tripService.createTrip({
      traveler_id,
      ...req.body,
    });

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTrips();
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTrips };