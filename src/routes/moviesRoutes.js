const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const { body } = require('express-validator');

const validationsCreate = [
    body('title').notEmpty().withMessage('Enter a title'),
    body('rating').notEmpty().withMessage('Enter a rating'),
    body('awards').notEmpty().withMessage('Enter a number of awards'),
    body('release_date').notEmpty().withMessage('Enter a date'),
    body('length').notEmpty().withMessage('Enter a length'),
    body('genre_id').notEmpty().withMessage('Select a genre'),
    
  ]
  const validationsUpdate = [
    body('title').notEmpty().withMessage('Enter a title'),
    body('rating').notEmpty().withMessage('Enter a rating'),
    body('awards').notEmpty().withMessage('Enter a number of awards'),
    body('release_date').notEmpty().withMessage('Enter a date'),
    body('length').notEmpty().withMessage('Enter a length'),
    body('genre_id').notEmpty().withMessage('Select a genre'),
    
  ]

router.get('/movies', moviesController.list);
router.get('/movies/new', moviesController.new);
router.get('/movies/recommended', moviesController.recomended);
router.get('/movies/detail/:id', moviesController.detail);
//Rutas exigidas para la creación del CRUD
router.get('/movies/add', moviesController.add);
router.post('/movies/create', validationsCreate ,moviesController.create);
router.get('/movies/edit/:id', moviesController.edit);
router.put('/movies/update/:id', validationsUpdate,moviesController.update);
router.get('/movies/delete/:id', moviesController.delete);
router.delete('/movies/delete/:id', moviesController.destroy);

module.exports = router;