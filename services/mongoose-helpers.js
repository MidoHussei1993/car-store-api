async function pagination(req,res, model) {
  let page = parseInt(req.query.page) || 1; //for next page pass 1 here
  let limit = parseInt(req.query.limit) || 3;
  let sortDirection = parseInt(req.query.sortDirection) || -1;
  let query = {};
  await model
    .find(query)
    .sort({ update_at: sortDirection })
    .skip((page - 1) * limit) //Notice here
    .limit(limit)
    .exec(async (err, doc) => {
      if (err) {
        return res.json(err);
      }
      await model.countDocuments(query).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        const totalPages = Math.ceil(count / doc.length);
        return res.json({
          pagination: {
            totalItems: count,
            totalPages: totalPages,
            currentPage: page,
            pageSize: doc.length,
          },
          result: doc,
        });
      });
    });
}
exports.pagination = pagination;
