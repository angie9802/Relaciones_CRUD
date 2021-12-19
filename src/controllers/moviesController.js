const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, association } = require("sequelize");
const { validationResult } = require('express-validator');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id,{ 
            include : [{association: 'genre'},{association:'actors'}]
        })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie : movie});
            });
    },
    new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll()
            .then(allGenres => {
                res.render('moviesAdd.ejs', {allGenres : allGenres})
            })
    },
    create: function (req,res) {
        const resultValidation = validationResult(req)

        if(resultValidation.errors.length > 0){
            return Genres.findAll()
            .then(allGenres => {
                res.render('moviesAdd.ejs', {
                    allGenres : allGenres,
                    errors : resultValidation.mapped(),
                    oldData: req.body
                })
            })
        }

        Movies.create({
            title : req.body.title,
            rating : req.body.rating,
            awards :req.body.awards,
            release_date :req.body.release_date,
            length : req.body.length,
            genre_id : req.body.genre_id
        })
        res.redirect('/movies')
    },
    edit: function(req,res) {
        let reqMovies = Movies.findByPk(req.params.id,{
            include: ["genre"]
        })
        let reqGenres = Genres.findAll()
           
        Promise.all([reqMovies,reqGenres])
            .then(([Movie,allGenres])=>{
                res.render('moviesEdit.ejs',{Movie : Movie, allGenres : allGenres})
            })
    },
    update: function (req,res) {
        const resultValidation = validationResult(req)
        let reqMovies = Movies.findByPk(req.params.id,{
            include: ["genre"]
        })
        let reqGenres = Genres.findAll()

        if(resultValidation.errors.length > 0){
            return Promise.all([reqMovies,reqGenres])
            .then(([Movie,allGenres])=>{
                res.render('moviesEdit.ejs',{
                    Movie : Movie, 
                    allGenres : allGenres,
                    errors : resultValidation.mapped(),
                    oldData: req.body
                })
            })
            
        }

        Movies.update({
            title : req.body.title,
            rating : req.body.rating,
            awards :req.body.awards,
            release_date :req.body.release_date,
            length : req.body.length,
            genre_id : req.body.genre_id
        },{
            where : {
                id :req.params.id
            }
        })
        res.redirect('/movies')
    },
    delete: function (req,res) {
        Movies.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDelete.ejs', {Movie : movie});
            });

    },
    destroy: function (req,res) {
        Movies.destroy({
            where : {
                id :req.params.id
            }
        })
        res.redirect('/movies')

    }
}

module.exports = moviesController;