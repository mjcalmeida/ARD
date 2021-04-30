const express = require('express')
const timelineManager = require('./timelineManager')
const app = express()

//Static
app.use(express.static('public'));

app.listen(3333, () => {
    console.log('Timeline running on port 3333')

    timelineManager.run()
})