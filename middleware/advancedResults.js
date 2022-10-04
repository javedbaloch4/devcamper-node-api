const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

  // Deep copy req.query
  const reqQuery = { ...req.query }

  // Remove fields
  const removeFields = ['select','sort','page','limit']

  // Loop to remove fields 
  removeFields.forEach(param => delete reqQuery[param])

  // Stringfy req.query
  let queryStr = JSON.stringify(req.query)

  // Create operators ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`)

  // Finding resources   
  query = model.find(JSON.parse(queryStr))


  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit;
  const total = await model.countDocuments();
  
  query = query.skip(startIndex).limit(limit)

  // Check if populate
  if (populate) {
      query = query.populate(populate)
  }
    
  // Execute the query
  const results = await query;

  // Paginate result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }


  next()
}

export default advancedResults;