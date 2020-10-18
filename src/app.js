const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//listening port
app.listen(port, ()=> {
    console.log('server is running on port ' + port);
});

const bcrypt = require('bcryptjs');

const myFunction = async () => {
    const password = 'Mead1234'
    const hashedPassword = await bcrypt.hash(password, 8);

    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare('Mead1234', hashedPassword);
    console.log(isMatch);
}
myFunction();