const mongoose = require('mongoose');

async function pagination(req,res, model) {
  let page = parseInt(req.query.page) || 1; //for next page pass 1 here
  let limit = parseInt(req.query.limit) || 3;
  let sortDirection = parseInt(req.query.sortDirection) || -1;
  let query = {};
  if((req.query.model == 'car') && req.query.searchValue){
    if(req.query.searchValue.length > 1){
      query = {model:{$match:req.query.searchValue}}
    }
  }else if((req.query.model == 'mark') && req.query.searchValue){
    if(req.query.searchValue.length > 1){
      query = {name:{ "$regex":req.query.searchValue, "$options": "i" }}
    }
  }
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
            totalItems: count?count:0,
            totalPages: totalPages?totalPages:0,
            currentPage: count?page:0,
            pageSize: doc.length,
          },
          result: doc,
        });
      });
    });
}
async function carPagination(req,res, model) {
  let page = parseInt(req.query.page) || 1; //for next page pass 1 here
  let limit = parseInt(req.query.limit) || 3;
  let sortDirection = parseInt(req.query.sortDirection) || -1;
  let query = {};
  if((req.query.model == 'car') && req.query.searchValue){
    if(req.query.searchValue.length >= 1){
      query = {model:{ "$regex":req.query.searchValue, "$options": "i" }
      ,...(mongoose.Types.ObjectId.isValid(req.query.mark) && {'mark._id': req.query.mark})}

    }
  }
  await model
    .find(query)
    .select({
      model : 1,
      license: 1,
      mark: 1,
      drive: 1,
      type: 1,
      fuel: 1,
      price: 1,
      createdAt: 1,
      description: 1,
      mainImage : 1
    })
    .sort({ update_at: sortDirection })
    .skip((page - 1) * limit) //Notice here
    .limit(limit)
    .populate([{path:'mark',model:'Mark'}])
    .exec(async (err, doc) => {
      if (err) {
        return res.json(err);
      }
      await model.countDocuments(query).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        const totalPages = Math.ceil(count / doc.length);
        return res.status(200).send({
          pagination: {
            totalItems: count?count:0,
            totalPages: totalPages?totalPages:0,
            currentPage: count?page:0,
            pageSize: doc.length,
          },
          result: doc,
        });
      });
    });
}
exports.pagination = pagination;
exports.carPagination = carPagination;
