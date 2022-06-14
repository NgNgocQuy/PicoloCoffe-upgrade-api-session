const express = require("express")
const Category = require("./models/categories")

const categoryGetAll = async (key,values)=>{
    return await Category.find().exec()
}

const categoryDetail = async (categoryID)=>{
    return await Category.findOne({id:categoryID}).exec()
}

module.exports = {
    categoryGetAll,
    categoryDetail,
}