const siteRouter = require('./site')
const adminRouter = require('./admin')
const layoutRouter = require('./layout')


const route = (app)=>{

   app.use('/admin/',adminRouter)
   app.use('/layout/', layoutRouter)
   app.use('/',siteRouter);
    

}


module.exports = route;