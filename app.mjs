import express from 'express'

const app = express()

app.use(express.static(process.cwd()))

app.get('/', (req, res) => {
  res.render('index.html')
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})
