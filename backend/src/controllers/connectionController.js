const connectionService = require('../services/connectionService');

const createTripConnection = async (req, res, next) => {
  try {
    const connection = await connectionService.createTripConnection({
      trip_id: req.params.tripId,
      initiator_id: req.user.id,
      message: req.body.message,
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

const createRequestConnection = async (req, res, next) => {
  try {
    const connection = await connectionService.createRequestConnection({
      request_id: req.params.requestId,
      initiator_id: req.user.id,
      message: req.body.message,
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

const getSentConnections = async (req, res, next) => {
  try {
    const connections = await connectionService.getSentConnections(req.user.id);
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

const getReceivedConnections = async (req, res, next) => {
  try {
    const connections = await connectionService.getReceivedConnections(req.user.id);
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

const acceptConnection = async (req, res, next) => {
  try {
    const connection = await connectionService.updateConnectionStatus({
      connection_id: req.params.id,
      user_id: req.user.id,
      new_status: 'accepted',
    });

    res.status(200).json(connection);
  } catch (error) {
    next(error);
  }
};

const rejectConnection = async (req, res, next) => {
  try {
    const connection = await connectionService.updateConnectionStatus({
      connection_id: req.params.id,
      user_id: req.user.id,
      new_status: 'rejected',
    });

    res.status(200).json(connection);
  } catch (error) {
    next(error);
  }
};

const cancelConnection = async (req, res, next) => {
  try {
    const connection = await connectionService.updateConnectionStatus({
      connection_id: req.params.id,
      user_id: req.user.id,
      new_status: 'cancelled',
    });

    res.status(200).json(connection);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTripConnection,
  createRequestConnection,
  getSentConnections,
  getReceivedConnections,
  acceptConnection,
  rejectConnection,
  cancelConnection,
};