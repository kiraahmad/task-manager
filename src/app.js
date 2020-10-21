const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if(req.method === 'POST') {
//         res.send('Sign ups are currently disabled!');
//     } else {
//         next();
//     }
// });

// app.use((req,res,next) => {
//     res.status(503).send('Site is currently under maintenance, Please try again soon.');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//listening port
app.listen(port, ()=> {
    console.log('server is running on port ' + port);
});