
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');


//causes cors error when we receiving a get request from extension
const cors = require('cors');

const mongoose = require('mongoose');
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://Sankar:Desamsetti1&%40@cluster0.yju1e0z.mongodb.net/API', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });


const BlogSChema = {
    id: {
        type: String,
        required: true
    },
    content: {
        type: Object,
        required: true
    }
};

const Blog = mongoose.model("next data", BlogSChema);


const func1 = async () => {
    const inp = "https://api.coinstats.app/public/v1/coins?skip=200&limit=2000&currency=INR";
    let data = []
    data = await axios.get(inp);
    return data.data;
}


app.get('/', (req, res) => {
    let data = [];
    const rt = func1();
    rt.then((data) => {
        Blog.create({ id: "1", content: data });
        res.send(data);
    });

});

app.get('/api', (req, res) => {
    Blog.find({}, (err, foundItems) => {
        if (err) {
            console.log(err);
        } else {
            res.send(foundItems);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}
);
