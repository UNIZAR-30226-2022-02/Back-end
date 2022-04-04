#!/bin/bash

#Prueba register correcto e incorrecto
curl -X POST -d "username=prueba&passwd=prueba&email=prueba@unizar.es" http://localhost:3000/register
curl -X POST -d "username=prueba&passwd=prueba&email=prueba@unizar.es" http://localhost:3000/register

#Prueba login correcta e incorrecta(user y passwd)
curl -X GET -d "username=prueba&passwd=prueba" http://localhost:3000/login
curl -X GET -d "username=prueba2&passwd=prueba" http://localhost:3000/login
curl -X GET -d "username=prueba&passwd=prueba2" http://localhost:3000/login

#Prueba borrar correcto e incorrecto
curl -X GET -d "username=prueba" http://localhost:3000/login/delete
curl -X GET -d "username=prueba" http://localhost:3000/login/delete
