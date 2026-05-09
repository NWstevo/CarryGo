const requestService = require('../services/requestService');

const createRequest = async (req, res, next) => {
  try {
    const sender_id = req.user.id;

    const request = await requestService.createRequest({
      sender_id,
      ...req.body,
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    const requests = await requestService.getRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRequest, getRequests };