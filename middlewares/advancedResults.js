const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.qurey
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "page", "limit", "sort"];

  // Loop over removeFileds and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Creating query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resourse
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    // In mongoose doces, must have space between fileds
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // SORT
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndext = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate
  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndext < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
