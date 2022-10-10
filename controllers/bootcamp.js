import path from "path"
import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"
import geocoder from "../utils/nodeGeoCoder.js";

/**
 * @desc Get all bootcamps
 * @route /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler( async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamp
 * @access Public
 */
export const createBootcamp = asyncHandler( async (req, res, next) => {
    // Add user in req 
    req.body.user = req.user.id

    // Check if bootcamp is published
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

    // Check if already created Bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`The role ${req.user.role} has already published Bootcamp`)
      );
    }

    const bootcamp = await Bootcamp.create(req.body);

    /**
     * Todo: Bug here in middleware next is required.
     */
    if (!bootcamp) { 
      return new ErrorResponse('Failed to create bootcamp', 400)
    }

    res.status(200).json({ success: true, msg: "Bootcamp has been created.", bootcamp });
});

/**
 * @desc Show a bootcamp
 * @route GET /api/v1/bootcamp/:id
 * @access Public
 */
export const showBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Update a bootcamp
 * @route PUT /api/v1/bootcamp/:id
 * @access Public
 */
export const updateBootcamp = asyncHandler( async (req, res, next) => {
    let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id);
   
    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`This user is not authorized to update the Bootcamps`)
      );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      msg: "Data has been updated",
      data: bootcamp,
    });
});

/**
 * @desc Delete a bootcamp
 * @route DELETE /api/v1/bootcamp/:id
 * @access Public
 */
export const deleteBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
      );
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`This user is not authorized to delete the Bootcamps`)
      );
    }

    bootcamp.remove();

    res.status(200).json({ success: true, msg: "Bootcamp has been deleted" })
});


/**
 * @desc Get bootcamps by radius
 * @route GET /api/v1/bootcamps/:zipcode/:distance
 * @access Public
 */
export const getBootcampsByRadius = asyncHandler ( async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get Lng, Lat from geocoder
  const loc = await geocoder.geocode(zipcode);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Get the radius
  const radius = distance / 3963;

  // Get the data with the distance
  const bootcamps = await Bootcamp.find({
    location: { 
      $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }
    }
  })

  res.status(200).json({success: true, count: bootcamps.length , data: bootcamps })
});


/**
 * @desc Upload Bootcamp image
 * @route PUT /api/v1/bootcamp/:id/photo
 * @access Private
 */
 export const uploadBootcampPhoto = asyncHandler( async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`The bootcamp not found wiht id ${req.params.id}`)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`This user is not authorized to delete the Bootcamps`)
    );
  }

  // Check if has file
  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file `, 400)
    )
  }

  const file = req.files.photo;

  // Make sure the file is photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }

  // Check photo size
  if (file.size > process.env.MAX_UPLOAD_SIZE) {
    return next(new ErrorResponse(`Image size must be less then ${process.env.MAX_UPLOAD_SIZE}`, 500))
  }

  // Create custom file name & upload image
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
      success: true,
      data: file.name
    })

  })
});