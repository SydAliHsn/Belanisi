module.exports = class {
  constructor(query, queryString) {
    this.query = query;
    this.queryObj = queryString;
  }

  filter() {
    const queryObj = { ...this.queryObj };

    // remove advanced fields
    const exculededFields = ['sort', 'page', 'limit', 'fields'];
    exculededFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  querySearch() {
    if (this.queryObj.q) {
      this.query.find({ $text: { $search: this.queryObj.q } });
    }

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');

      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const selectedFields = this.queryObj.fields.split(',').join(' ');

      this.query.select(selectedFields);
    } else {
      this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.queryObj.page || 1;
    const limit = +this.queryObj.limit || 25;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }
};
