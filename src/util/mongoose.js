module.exports = {
    multipleMongooseToObject: function (mongooseArray){
        return mongooseArray.map(mongoose => mongoose.toObject());
    },
    
    mongooseToObject :function (mongooseArray){
        return mongooseArray ? mongooseArray.toObject():mongooseArray;

    },

    // dùng khi multipleMongooseToObject không hoạt động
    // hoặc error: mongooseArray.toObject is not function
    otherMultipleMongooseToObject: function (mongooseArray){
        return [mongooseArray].map(mongoose => mongoose.toObject());
    },
} 

