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

const Task = require('./models/task');
const User = require('./models/user');
    
const main = async () => {
    // const task = await Task.findById('5f93c38be612103064c94eaf');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    const user = await User.findById('5f93c21ec14aac2904bcca9e');
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()