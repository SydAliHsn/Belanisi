module.exports = class {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
  
      // remove advanced fields
      const exculededFields = ['sort', 'page', 'limit', 'fields'];
      exculededFields.forEach(field => delete queryObj[field]);
  
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
  
      console.log(JSON.parse(queryStr));
  
      this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
  
        this.query.sort(sortBy);
      } else {
        this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const selectedFields = this.queryString.fields.split(',').join(' ');
  
        this.query.select(selectedFields);
      } else {
        this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate() {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 100;
      const skip = (page - 1) * limit;
  
      this.query.skip(skip).limit(limit);
  
      return this;
    }
  };
  