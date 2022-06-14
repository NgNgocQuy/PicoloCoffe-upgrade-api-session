const IncrementCount = require("./models/incrementCount")

const incrementSum = async(name)=>{
    return await IncrementCount.findOne({collectionName:name}).exec()
}

const updateSum = async(name,quatity)=>{
    let snapshot = await IncrementCount.findOne({collectionName:name}).exec()
    snapshot.count.value = `${parseInt(snapshot.count.value) + parseInt(quatity)}`
    let newsnapshot = await snapshot.save().exec()
    return newsnapshot
}

module.exports = {
    incrementSum,
    updateSum,
}