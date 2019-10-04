export const get = model => async (req, res) => {
  try {
    let doc = await model
      .findOne({ _id: req.params.id, createdBy: req.user.id })
      .lean()
      .exec();
    if (!doc) {
      return res.status(404).end();
    }
    res.status(200).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const getAll = model => async (req, res) => {
  try {
    let docs = await model
      .find({ createdBy: req.user.id })
      .lean()
      .exec();
    if (!docs) {
      res.status(400).end();
    }
    res.status(200).json({ data: docs });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const create = model => async (req, res) => {
  try {
    let doc = await model.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const update = model => async (req, res) => {
  try {
    let updatedDoc = await model
      .findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        {
          ...req.body
        },
        { new: true }
      )
      .lean()
      .exec();
    if (!updatedDoc) {
      return res.status(400).end();
    }
    res.status(201).json({ data: updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const removeOne = model => async (req, res) => {
  try {
    let removed = await model
      .findOneAndRemove({ _id: req.params.id, createdBy: req.user.id })
      .lean()
      .exec();
    if (!removed) {
      return res.status(400).end();
    }
    res.status(200).json({ data: removed });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export let crudControllers = model => ({
  removeOne: removeOne(model),
  update: update(model),
  getAll: getAll(model),
  get: get(model),
  create: create(model)
});
