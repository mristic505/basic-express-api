// Add express
var express = require('express');
var app = express();
// Needed for API
app.use(express.json());
// User input validation class
const Joi = require('joi');

// DEFINE PORT =====================
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
]

// GET METHOD ================
app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/api/courses', (req, res) => {
    res.send([courses]);
});

app.get('/api/courses/:id', (req, res) => {    
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found.`)
    res.send(course);
});

// POST REQUESTS ================
app.post('/api/courses', (req, res) => {
    
    // USER INPUT VALIDATION    
    const {error} = validateCourse(req.body);    
    if(error) return res.status(400).send(error);

    const course = {
        id: courses.length + 1, 
        name: req.body.name 
    };
    courses.push(course);
    res.send(course);    
});

// PUT METHOD =====================
app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found.`)
    // Input validation    
    const {error} = validateCourse(req.body);    
    if(error) return res.status(400).send(error);
    // Update course
    course.name = req.body.name;
    res.send(course);
    
});

// DELETE METHOD
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found.`)        
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(courses);    
});

function validateCourse(course) {
    const schema = { // Set user input validation rule for name
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}