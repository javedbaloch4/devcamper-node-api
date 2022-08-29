/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: "Show all the bootcamps" });
};

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamp
 * @access Public
 */
export const createBootcamp = (req, res, next) => {
  res
    .status(201)
    .json({ success: true, message: "Bootcamp has been created " });
};

/**
 * @desc Show a bootcamp
 * @route GET /api/v1/bootcamp/:id
 * @access Public
 */
export const showBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Show ing ${id} bootcamp` });
};

/**
 * @desc Update a bootcamp
 * @route PUT /api/v1/bootcamp/:id
 * @access Public
 */
export const updateBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Updated ${id} bootcamp` });
};

/**
 * @desc Delete a bootcamp
 * @route Delete /api/v1/bootcamp/:id
 * @access Public
 */
export const deleteBootcamp = (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: `Deleted ${id} bootcamp` });
};
