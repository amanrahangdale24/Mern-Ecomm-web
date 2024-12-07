const express = require('express'); 
const app = express(); 
const cookieparser = require('cookie-parser'); 
const dotenv = require('dotenv')
dotenv.config(); 
const cors = require('cors'); 
const  path = require('path'); 

const accountRoutes = require('./routes/account.routes') 
const imageUploadRoutes = require('./routes/fileUpload.routes')
const brandRoutes = require('./routes/brand.routes')
const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/products.routes')
const dropdownRoutes = require('./routes/dropdown.routes.js')
const reviewRoutes = require('./routes/review.routes.js')
const cartRoutes = require('./routes/cart.routes.js')
const orderRoutes = require('./routes/order.routes.js')
// db 
const connectDB = require('./db/config/connection')
connectDB(); 




app.use(express.json());  // to convert req data to json format
app.use(express.urlencoded({extended : false})) ; // to collect the form data
app.use(cors()); 
app.use(cookieparser()); 
app.use('/images', express.static(path.join((__dirname , 'images')))) 


app.get('/', (req,res)=>{
    res.send('server is wroking')
})
app.use('/user', accountRoutes); 
app.use('/image', imageUploadRoutes); 
app.use('/brand', brandRoutes); 
app.use('/category', categoryRoutes); 
app.use('/product', productRoutes); 
app.use('/dropdown', dropdownRoutes); 
app.use('/review',reviewRoutes); 
app.use('/cart', cartRoutes); 
app.use('/order', orderRoutes); 

const port = process.env.PORT || 4044; 

app.listen(port);