const express = require('express')
const app= express()
const cors=require('cors') // for calling api without cors policy restriction
app.use(cors())
app.use(express.json())
const mysql=require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});
db.connect(err=>{
    if(err){
        console.error('Error connecting to database: ',err)
        return 
    }
    console.log("connected to database")
})
// creating inventory_management databse if there isn't one already
db.query("show databases;",(err,result)=>{
    if(err){
        console.error("Error showing Databases: ",err.stack)
        return
    }
    const data=JSON.parse(JSON.stringify(result))
    const databases=[] 
    for (i in data){
        databases.push(data[i].Database)
    }
    if(!databases.find(db=>db==="inventory_management")){
        console.log("database not found")
        db.query("create database inventory_management;")
    }
    
})
db.query("use inventory_management;",(err,result)=>{
    if(err){
        console.error("Error using database: ",err.stack)
        return
    }
})
// creating table if there isn't one already
db.query("show tables;",(err,result)=>{
    if(err){
        console.error("Error showing tables: ",err.stack)
        return
    }
    const data=JSON.parse(JSON.stringify(result))
    const tables=[] 
    for (i in data){
        tables.push(data[i].Tables_in_inventory_management)
    }
    if(!tables.find(db=>db==="products")){
        console.log("products table not found")
        db.query(`CREATE TABLE products (
                    product_id INT PRIMARY KEY AUTO_INCREMENT,
                    product_name VARCHAR(255),
                    category_id INT,
                    supplier_id INT,
                    quantity INT,
                    price DECIMAL(10, 2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
        `)
    }
})
// Main api route
app.post("/api",(req,res)=>{
    try{
        const { product_name, category_id, supplier_id, quantity, price } = (req.body);
        const query = `INSERT INTO products (product_name, category_id, supplier_id, quantity, price) VALUES ("${product_name}", ${Number(category_id)}, ${Number(supplier_id)}, ${Number(quantity)}, ${Number(price)})`;
        db.query(query,(err,result)=>{
            if(err){
                console.error('Error inserting product: ',err)
                res.json({
                    "success":false,
                    "message":`Error inserting product: ${err}`
                })
            }
            else{
                res.json({
                    "success":true,
                    "message":`Product inserted successfully`,
                    "data":result
                    })
            }
        })
    }
    catch(err){
        res.json({
            "success":false,
            "message":"There is somthing wrong with request"
        })
        console.error(err)
    }
})
// SERVER
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})