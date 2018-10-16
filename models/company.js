const mongoose = require('mongoose')
// 一个公司
const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true }
})
// 创建Model
const Company = mongoose.model('company', CompanySchema, 'company')

const companyModel = {
  save: async (company) => {
    const newcompany = new Company(company)
    const data = await newcompany.save()
    return data
  },
  findOne: async (company) => {
    const data = await Company.findOne(company)
    return data
  },
  findList: async (filter) => {
    const companyList = await Company.find(filter)
    return companyList
  }
}
module.exports = companyModel
