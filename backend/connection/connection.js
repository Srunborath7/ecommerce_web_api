const mysql = require('mysql'); 
const connection = mysql.createConnection({ 
    host: 'localhost',      
    user: 'root',
    password: '',           
    database: 'ecommercedb',    
}); 
// Connect to MySQL 
connection.connect((err) => { 
if (err) { 
console.error('Connection failed:', err.stack); 
return; 
} 
console.log('Connected to MySQL as ID ' + connection.threadId); 
}); 
module.exports = connection;