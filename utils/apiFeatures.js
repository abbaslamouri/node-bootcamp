class APIFeatures {
  constructor(query, queryObj) {
    this.query = query
    this.queryObj = queryObj
  }

  filter() {
    // filter query
    const queryObjClone = { ...this.queryObj }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObjClone[el])

    // Advanced filtering
    let queryString = JSON.stringify(queryObjClone)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    console.log('PPPPP', this.queryObj, queryObjClone, JSON.parse(queryString))

    this.query = this.query.find(JSON.parse(queryString))

    return this
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('createdDate')
    }

    return this
  }

  fields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ')
      console.log(fields)
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = this.queryObj.page * 1 || 1
    const limit = this.queryObj.limit * 1 || 5
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
